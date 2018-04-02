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
    
    public static let sharedInstance = UserKitModule()
    private var module: UserKitInstance! = nil
    
    private override init() {
        super.init()
    }
    
    @objc public func initialize(token: String) {
        UserKit.initialize(token: token)
        module = UserKit.mainInstance()
    }
    
    @objc public func setDeviceType(type: String) {
        module.deviceType = type
    }
    
    @objc public func time(event: String) {
        module.time(event: event)
    }
    
    @objc public func track(event: String, properties: [String: Any]) {
        module.track(event: event, properties: properties)
    }
    
    @objc public func addDeviceToken(_ token: Data) {
        module.deviceToken = token
    }
}
