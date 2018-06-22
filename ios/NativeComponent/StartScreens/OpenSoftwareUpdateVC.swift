//
//  OpenSoftwareUpdateVC.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/22/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(OpenSoftwareUpdateVC)
class OpenSoftwareUpdateVC: NSObject {
    
    public static let sharedInstance = OpenSoftwareUpdateVC()
    
    private override init() {
        super.init()
    }
    
    @objc public func open(window: UIWindow) {
        let rootVC = SoftwareUpdateController();
        rootVC.isFirst = true
        window.rootViewController = NavigationController.init(rootViewController: rootVC)
    }
}
