//
//  UserKitModule.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import UserKit

@objc(UserKitModule)
class UserKitModule: NSObject {
    @objc class func initialize(token: String) {
        UserKit.initialize(token: token)
        UserKit.mainInstance().deviceType = DeviceType.Phone.rawValue
    }
}
