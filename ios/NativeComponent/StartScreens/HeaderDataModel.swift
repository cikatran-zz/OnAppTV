//
//  HeaderDataModel.swift
//  STB
//
//  Created by 沈凯 on 2018/6/14.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

class HeaderDataModel: NSObject {
    var key: String!
    var value: String!
    var headerDataDescription: String!
    var enabled: Bool!
    
    init(dic: [AnyHashable: Any]) {
        super.init()
        setValuesForKeys(dic as! [String : Any])
        headerDataDescription = dic["description"] as! String
        enabled = dic["enabled"] as! Bool
    }
    
    override func setValue(_ value: Any?, forUndefinedKey key: String) {
        
    }
}
