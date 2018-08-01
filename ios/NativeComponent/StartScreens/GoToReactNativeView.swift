//
//  GoToReactNativeView.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/22/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

func goToReactNative() {
    DispatchQueue.main.async {
        
        let currentWindow = UIApplication.shared.delegate?.window
        
        let rootView = (UIApplication.shared.delegate as? AppDelegate)?.reactNativeView
        
        let viewController = UIViewController()
        viewController.view = rootView
        viewController.view.backgroundColor = UIColor(red: 1.0, green: 45.0/255, blue: 85.0/255, alpha: 1.0)
        currentWindow??.rootViewController = viewController
        
    }
}
