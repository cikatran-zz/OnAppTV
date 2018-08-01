//
//  FetchRequest.swift
//  AppKitCore
//
//  Created by Huy Nguyen on 10/20/17.
//  Copyright © 2017 mStage. All rights reserved.
//

import Alamofire

struct FetchRequest: Requestable {
    
    init(param: Parameters? = nil, body: Data? = nil, method: HTTPMethod) {
        self.param = param
        self.body = body
        self.httpMethod = method
    }
    
    var body: Data?
    
    typealias T = Any
    
    var param: Parameters?
    
    var urlPath: String = ""
    
    var urlCharacterSet: CharacterSet? = nil
    
    var addionalHeader: HeaderParameter? = nil
    
    var httpMethod: HTTPMethod
    
    var endPoint: String {
        get { return "Constants.URLEndPoint.BASE_URL" }
    }
    
    var parameterEncoding: ParameterEncoding {
        get { return URLEncoding.default }
    }
    
    func decode(data: Any) -> T {
        return data
    }
}

public struct FileResponse {
    public var location: String
    public var lastModified: String
}

struct FetchFile: Requestable {
    
    init(param: Parameters? = nil, body: Data? = nil, method: HTTPMethod) {
        self.param = param
        self.body = body
        self.httpMethod = method
    }
    
    var addionalHeader: HeaderParameter?
    
    typealias T = FileResponse
    
    var body: Data?
    
    var param: Parameters?
    
    var urlPath: String = ""
    
    var urlCharacterSet: CharacterSet? = nil
    
    var httpMethod: HTTPMethod
    
    var endPoint: String {
        get { return "Constants.URLEndPoint.BASE_URL" }
    }
    
    var parameterEncoding: ParameterEncoding {
        get { return URLEncoding.default }
    }
    
    func decode(data: Any) -> FileResponse {
//        guard let data = data as? String, let filePath = URL(string: data) else {
//            return ""
//        }
        //ApplicationManager.sharedInstance.cache.set(value: filePath.lastPathComponent.data(using: .utf8)!, key: urlPath)
        guard let response = data as? DownloadResponse<Data> else {
            return FileResponse(location: "", lastModified: "")
        }
        let lastModified = response.response?.allHeaderFields["Last-Modified"] as? String
        let resultPath = response.destinationURL?.path ?? ""
        return FileResponse(location: resultPath, lastModified: lastModified ?? "")
    }
}

