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
        currentWindow??.rootViewController = viewController
        
    }
}
