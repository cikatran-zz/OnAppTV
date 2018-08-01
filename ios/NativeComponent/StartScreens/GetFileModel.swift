//
//  GetFileModel.swift
//  STB
//
//  Created by 沈凯 on 2018/6/14.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

class GetFileModel: NSObject {
    var fileID: String!
    var name: String!
    var fileDescription: String!
    var order: [String]!
    var folders: NSArray!
    var folders_order: NSArray!
    var timestamp: Int!
    var owner: String!
    var filePublic: Bool!
    var events: NSArray!
    var variables: NSArray!
    var auth: Any?
    var requests: [RequestsModel]!
    
    init(dic: [AnyHashable: Any]) {
        super.init()
        setValuesForKeys(dic as! [String : Any])
        fileID = dic["id"] as! String
        filePublic = dic["public"] as! Bool
        fileDescription = dic["description"] as! String
        timestamp = dic["timestamp"] as! Int
        let arr = dic["requests"] as! NSArray
        let arrTemp = NSMutableArray.init()
        for temp in arr {
            let model = RequestsModel(dic: temp as! [AnyHashable : Any])
            arrTemp.add(model)
        }
        requests = arrTemp as! [RequestsModel]
    }
    
    override func setValue(_ value: Any?, forUndefinedKey key: String) {
        
    }
}
