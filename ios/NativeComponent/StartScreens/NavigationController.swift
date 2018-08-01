//
//  NavigationController.swift
//  STB
//
//  Created by 沈凯 on 2017/11/29.
//  Copyright © 2017年 Ssky. All rights reserved.
//

import UIKit

class NavigationController: UINavigationController {

    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationBar.isHidden = true
    }
    
    override var childViewControllerForStatusBarStyle: UIViewController {
        return self.topViewController!;
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
