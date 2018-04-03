//
//  OANotificationCenter.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import UserNotifications
import UserKit

@objc(OANotificationCenter)
class OANotificationCenter: NSObject, UNUserNotificationCenterDelegate {
    
    public static let sharedInstance: OANotificationCenter = OANotificationCenter()
    
    private override init() {
        super.init()
    }
    
    @objc public func requestPermission(callback: @escaping () -> Void) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.badge, .sound, .alert], completionHandler: { granted, error in
            if granted {
                UNUserNotificationCenter.current().delegate = self
            }
            callback()
        })
    }
    
    @objc public func checkGranted(callback: @escaping (Bool) -> Void) {
        UNUserNotificationCenter.current().getNotificationSettings { (settings) in
            if settings.authorizationStatus == .authorized {
                callback(true)
            } else {
                callback(false)
            }
        }
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([UNNotificationPresentationOptions.alert, UNNotificationPresentationOptions.sound])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        // TODO: - Handle notification
        UserKit.mainInstance().pushNotificationOpened(response.notification.request.content.userInfo)
    }
}


