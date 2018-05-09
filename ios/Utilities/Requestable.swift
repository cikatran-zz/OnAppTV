//
//  Requestable.swift
//  AppKitCore
//
//  Created by Huy Nguyen on 10/3/17.
//  Copyright © 2017 mStage. All rights reserved.
//

import Alamofire
import PromiseKit

// Variable
public typealias HeaderParameter = [String: String]

//
// MARK: - Requestable protocol
protocol Requestable: URLRequestConvertible {
    
    associatedtype T
    
    var urlPath: String {get set}
    
    var urlCharacterSet: CharacterSet? { get set}
    
    var httpMethod: HTTPMethod {get}
    
    var param: Parameters? {get}
    
    var body: Data? {get}
    
    var addionalHeader: HeaderParameter? {get set}
    
    var parameterEncoding: ParameterEncoding {get}
    
    func toPromise() -> Promise<T>
    
    func decode(data: Any) -> T
    
    init(param: Parameters?, body: Data?, method: HTTPMethod)
}


//
// MARK: - Conform URLConvitible from Alamofire
extension Requestable {
    func asURLRequest() -> URLRequest {
        return self.buildURLRequest()
    }
}


//
// MARK: - Default implementation
extension Requestable {
    
    // Param
    var param: Parameters? {
        get { return nil }
    }
    
    // Additional Header
    var addionalHeader: HeaderParameter? {
        get { return nil }
    }
    
    // Default
    var defaultHeader: HeaderParameter {
        get { return ["Accept": "application/json"] }
    }
    
    // Encoode
    var parameterEncoding: ParameterEncoding {
        get { return JSONEncoding.default }
    }
    
    var urlCharacterSet: CharacterSet? {
        get {
            return urlCharacterSet
        }
    }
    
    var url: URL {
        get {
            return URL(string: urlCharacterSet == nil ? urlPath : urlPath.addingPercentEncoding(withAllowedCharacters: urlCharacterSet!)!)!
        }
    }
    
    func toPromiseDownload() -> Promise<T> {
        return Promise { fulfill, reject in
            
            let destination = DownloadRequest.suggestedDownloadDestination(for: .cachesDirectory, in: .userDomainMask)
            
            guard let urlRequest = try? self.asURLRequest() else {
                reject(NSError.unknowError())
                return
            }
            Alamofire.download(urlRequest, to: destination)
                .validate(statusCode: 200..<300)
                .responseData(queue: DispatchQueue.global(qos: .userInteractive), completionHandler: { (response) in
                    
                    guard let mimeType = response.response?.mimeType else { return }
                    
                    if mimeType.equalsIgnoringCase("application/json") {
                        
                        // Check Response
                        guard let _ = response.destinationURL?.path else {
                            reject(NSError.unknowError())
                            return
                        }
                        
                        let result = self.decode(data: response)
                        fulfill(result)
                        
                    } else {
                        
                        // Check error
                        if let error = response.result.error {
                            if let dataLocalFile = self.loadFileLocal(urlPath: response.destinationURL) {
                                let result = self.decode(data: dataLocalFile)
                                fulfill(result)
                            } else {
                                reject(error as NSError)
                                return
                            }
                        }
                        
                        // Check Response
                        guard let _ = response.result.value else {
                            reject(NSError.unknowError())
                            return
                        }
                        
                        let result = self.decode(data: response)
                        
                        fulfill(result)
                    }
                })
        }
    }
    
    private func loadFileLocal(urlPath: URL?) -> Data? {
        guard let urlPath = urlPath else {
            return nil
        }
        let fileManager = FileManager.default
        if fileManager.fileExists(atPath: urlPath.path) {
            let data = fileManager.contents(atPath: urlPath.path)
            return data
        } else {
            return nil
        }
    }
    
    // Promise
    func toPromise() -> Promise<T> {
        
        return Promise { fulfill, reject in
            
            guard let urlRequest = try? self.asURLRequest() else {
                reject(NSError.unknowError())
                return
            }
            
            Alamofire.request(urlRequest)
                .validate(statusCode: 200..<300)
                .validate(contentType: ["application/json"])
                .responseJSON(queue: DispatchQueue.global(qos: .userInteractive), completionHandler: { (response) in
                    
                    // Check error
                    if let error = response.result.error {
                        reject(error as NSError)
                        return
                    }
                    
                    // Check Response
                    guard let data = response.result.value else {
                        reject(NSError.jsonMapperError())
                        return
                    }
                    
                    // Parse here
                    let result = self.decode(data: data)
                    
                    // Fill
                    fulfill(result)
                })
        }
    }
    
    // Build URL Request
    func buildURLRequest() -> URLRequest {
        
        // Init
        var urlRequest = URLRequest(url: self.url)
        urlRequest.httpMethod = self.httpMethod.rawValue
        urlRequest.timeoutInterval = TimeInterval(10 * 1000)
        urlRequest.httpBody = self.body
        
        // Encode param
        var request = try! self.parameterEncoding.encode(urlRequest, with: self.param)
        
        
        // Add addional Header if need
        if let additinalHeaders = self.addionalHeader {
            for (key, value) in additinalHeaders {
                request.addValue(value, forHTTPHeaderField: key)
            }
        }
        
        return request
    }
}
