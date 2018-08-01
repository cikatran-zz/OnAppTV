//
//  Networking.swift
//  AppKitCore
//
//  Created by Huy Nguyen on 10/3/17.
//  Copyright © 2017 mStage. All rights reserved.
//

import Foundation
import Alamofire
import PromiseKit
import SwiftyJSON

//
// MARK: - Result warpper
enum NetworkResult<T> {
    case success(T)
    case failed(Error)
}


//
// MARK: - Networking
public class Networking {
    
    /// Singleton
    static let shared = Networking()
    
    
    /// Fetch
    public func fetch(_ url: String, _ params: Parameters? = nil,_ strHeader: String? = nil,_ urlCharacterSet: CharacterSet? = nil) -> Promise<Any> {
        
        // Request
        var request = FetchRequest(param: params, method: .get)
        request.urlPath = url
        request.urlCharacterSet = urlCharacterSet
        request.addionalHeader = asStringToHeaderObj(strHeader)
        return request.toPromise()
    }
    
    public func post(_ url: String, _ data: Data? = nil, _ strHeader: String? = nil) -> Promise<Any> {
        var request = FetchRequest(param: nil, body: data, method: .post)
        request.urlPath = url
        request.addionalHeader = asStringToHeaderObj(strHeader)
        return request.toPromise()
    }
    
    public func fetchFile(with urlPath: String) -> Promise<FileResponse> {
        var fetchFile = FetchFile(param: nil, method: .get)
        fetchFile.urlPath = urlPath
        return fetchFile.toPromiseDownload()
    }

    private func asStringToHeaderObj(_ strHeader: String?) -> HeaderParameter? {
        guard let strHeader = strHeader, let strEncode: Data = strHeader.data(using: .utf8) else { return nil }
        guard let json = try? JSON(data: strEncode), let dictObj = json.dictionaryObject, let headerObj = dictObj as? HeaderParameter  else { return nil }
        return headerObj
    }
}
