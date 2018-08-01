//
//  RequestsModel.swift
//  STB
//
//  Created by 沈凯 on 2018/6/14.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

class RequestsModel: NSObject {
    var requestsID: String!
    var headers: String!
    var headerData: [HeaderDataModel]!
    var url: String!
    var queryParams: NSArray!
    var pathVariables: NSArray!
    var pathVariableData: NSArray!
    var events: NSArray!
    var auth: Any!
    var method: String!
    var collectionId: String!
    var data: NSArray!
    var dataMode: String!
    var name: String!
    var requestsDescription: String!
    var descriptionFormat: String!
    var time: Int!
    var version: Int!
    var responses: NSArray!
    var currentHelper: Any!
    var helperAttributes: Any!
    var rawModeData: String!
    
    init(dic: [AnyHashable: Any]) {
        super.init()
        setValuesForKeys(dic as! [String : Any])
        requestsID = dic["id"] as! String
        requestsDescription = dic["description"] as! String
        time = dic["time"] as! Int
        version = dic["version"] as! Int
        let arr = dic["headerData"] as! NSArray
        let arrTemp = NSMutableArray.init()
        for temp in arr {
            let model = HeaderDataModel(dic: temp as! [AnyHashable : Any])
            arrTemp.add(model)
        }
        headerData = arrTemp as! [HeaderDataModel]
    }
    
    override func setValue(_ value: Any?, forUndefinedKey key: String) {
        
    }
}
