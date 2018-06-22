//
//  RequestUtil.swift
//  STB
//
//  Created by 沈凯 on 2018/6/14.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

let address = "https://www.getpostman.com/collections/4a4f812337898c2a3f7d"
let POST_URL = "http://contentkit-prod.ap-southeast-1.elasticbeanstalk.com/graphql"
let POST_AUTHORIZATION = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiI1YWRlZWJkMTVmNGEwNTAwMWU5Nzg5ZDQiLCJpYXQiOjE1MjQ1NTg4MDF9.pOyAXvsRaN3dj_dU5luKjgNyULnN6pNlpBnxGcHax0M"

class RequestUtil: NSObject {
    
    class func hIG_GetRequest(completionHandler: @escaping (_ data: Data?,_ response: URLResponse?, _ error: Error?) -> Void) {
        let url = URL(string: address)
        let request = URLRequest(url: url! as URL)
        let config = URLSessionConfiguration.default
        let session = URLSession(configuration: config)
        let dataTask = session.dataTask(with: request) { (data, response, error) in
            DispatchQueue.main.async(execute: {() -> Void in
                completionHandler(data, response, error)
            })
        }
        dataTask.resume()
    }
    
    class func hIG_PostRequest(model: RequestsModel, completionHandler: @escaping (_ data: Data?,_ response: URLResponse?, _ error: Error?) -> Void) {
        var bodyData: Data!
        if (model.dataMode == "raw") {
            bodyData = model.rawModeData.data(using: String.Encoding.utf8)
        }
        let url = URL(string: model.url)
        var request = URLRequest(url: url!)
        request.httpMethod = "POST"
        request.httpBody = bodyData
        request.setValue(String(bodyData.count), forHTTPHeaderField: "Content-Length")
        
        for header: HeaderDataModel in model.headerData {
            if header.enabled {
                request.setValue(header.value, forHTTPHeaderField: header.key)
            }
        }
        let config = URLSessionConfiguration.default
        let session = URLSession(configuration: config)
        let dataTask = session.dataTask(with: request) { (data, response, error) in
            DispatchQueue.main.async(execute: {() -> Void in
                completionHandler(data, response, error)
            })
        }
        dataTask.resume()
    }
    
    class func hIG_PostRequest(bodyString: String, completionHandler: @escaping (_ data: Data?,_ response: URLResponse?, _ error: Error?) -> Void) {
        let bodyData = bodyString.data(using: String.Encoding.utf8)!
        let url = URL(string: POST_URL)
        var request = URLRequest(url: url!)
        request.httpMethod = "POST"
        request.httpBody = bodyData
        request.setValue(String(bodyData.count), forHTTPHeaderField: "Content-Length")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(POST_AUTHORIZATION, forHTTPHeaderField: "Authorization")
        
        let config = URLSessionConfiguration.default
        let session = URLSession(configuration: config)
        let dataTask = session.dataTask(with: request) { (data, response, error) in
            DispatchQueue.main.async(execute: {() -> Void in
                completionHandler(data, response, error)
            })
        }
        dataTask.resume()
    }
}
