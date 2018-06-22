//
//  JumpToSystem.swift
//  STB
//
//  Created by 沈凯 on 2018/6/19.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

enum JumpType : String {
    case WIFI             = "WIFI"
    case BLUETOOTH        = "Bluetooth"
    case CELLULAR_NETWORK = "MOBILE_DATA_SETTINGS_ID"
    case HOTSPOT          = "INTERNET_TETHERING"
    case VPN              = "VPN"
    case CARRIER          = "Carrier"
    case NOTIFICATIONS    = "NOTIFICATIONS_ID&path=bundleid"
    case LOCATION         = "LOCATION"
    case GENERAL          = "General"
    case ABOUT            = "General&path=About"
    case KEYBOARD         = "General&path=Keyboard"
    case ACCESSIBILITY    = "General&path=ACCESSIBILITY"
    case INTERNATIONAL    = "General&path=INTERNATIONAL"
    case RESET            = "General&path=Reset"
    case WALLPAPER        = "Wallpaper"
    case SIRI             = "SIRI"
    case PRIVACY          = "Privacy"
    case SAFARI           = "SAFARI"
    case MUSIC            = "MUSIC"
    case PHOTOS           = "Photos"
    case FACETIME         = "FACETIME"
    case BATTERY          = "BATTERY_USAGE"
    case DEVICE_STORAGE   = "General&path=STORAGE_ICLOUD_USAGE/DEVICE_STORAGE"
    case DISPLAY          = "DISPLAY"
    case SOUNDS           = "Sounds"
    case STORE            = "STORE"
    case CASTLE           = "CASTLE"
}

class JumpToSystem: UIDevice {
    
    class func hIG_CurrentSystemVersion() -> Float {
        return Float(current.systemVersion)!
    }

    class func hIG_JumpSystem(cmd: JumpType, statusBlock: @escaping (Bool) -> Void) {
        let urlString = "App-Prefs:root=\(cmd)"
//        let settingPath = UIApplicationOpenSettingsURLString
        
        if #available(iOS 10.0, *) {
            let optionDict = [UIApplicationOpenURLOptionUniversalLinksOnly: false]
            if #available(iOS 11.0, *) {
                UIApplication.shared.open(URL(string: urlString)!, options: optionDict, completionHandler: statusBlock)
//                UIApplication.shared.open(URL(string: settingPath)!, options: optionDict, completionHandler: statusBlock)
            }else {
                if UIApplication.shared.canOpenURL(URL(string: urlString)!) {
//                    iOS 10.0 < verion < iOS 11.0
                    UIApplication.shared.open(URL(string: urlString)!, options: optionDict, completionHandler: statusBlock)
                }
            }
        } else {
            if UIApplication.shared.canOpenURL(URL(string: urlString)!) {
//                < iOS 10
                UIApplication.shared.openURL(URL(string: urlString)!)
            }
        }
    }
}
