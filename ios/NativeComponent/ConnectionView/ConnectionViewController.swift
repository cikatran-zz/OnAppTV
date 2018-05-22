//
//  ConnectionViewController.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/22/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit

class ConnectionViewController: UIViewController, ConnectViewDelegate {
    
    func connectSuccess() {
        NotificationCenter.default.post(name: NSNotification.Name("RefreshNotification") , object: nil)
        self.dismiss(animated: true) {
            let vc = SoftwareUpdateController()
            UIApplication.shared.delegate?.window??.rootViewController?.present(vc, animated: true, completion: nil)
        }
        
    }
    
    func connectFail(error: String) {
        NotificationCenter.default.post(name: NSNotification.Name("RefreshNotification") , object: nil)
        self.dismiss(animated: true, completion: nil)
    }
    
    
    var connectionView: ConnectView!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        self.view.backgroundColor = .clear
        connectionView = ConnectView()
        connectionView.connectViewDelegate = self
        self.view.addSubview(connectionView)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
