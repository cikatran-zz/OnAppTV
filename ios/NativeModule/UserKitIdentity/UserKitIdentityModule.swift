//
//  UserKitIdentityModule.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import UserKitIdentity

@objc(UserKitIdentityModule)
class UserKitIdentityModule: NSObject {
    @objc class func initialize(token: String) {
        UserKitIdentity.initialize(token: token)
        #if DEBUG
            UserKitIdentity.mainInstance().loggingEnabled = true
        #endif
    }
}
