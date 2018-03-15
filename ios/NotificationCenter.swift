//
//  NotificationCenter.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import UserNotifications


class NotificationCenter: NSObject, UNUserNotificationCenterDelegate {
    
    static let shared = NotificationCenter()
    
    private override init() {
        super.init()
    }
    
    public func requestPermission(successBlock: (()->Void)?, errorBlock: ((Error?)->Void)?) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.badge, .sound, .alert], completionHandler: { granted, error in
            if granted {
                UNUserNotificationCenter.current().delegate = self
                successBlock?()
            } else {
                errorBlock?(error)
            }
        })
    }
}
