//
//  ConnectionViewController.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/22/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit

class ConnectionViewController: UIViewController {
    
    
    var connectionView: ConnectView!
    var beginPoint: CGPoint!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        self.view.backgroundColor = .clear
        connectionView = ConnectView()
        connectionView.connectViewDelegate = self
        connectionView.add.addTarget(self, action: #selector(addButtonAction(sender:)), for: .touchUpInside)
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

extension ConnectionViewController {
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        if connectionView != nil {
            let touch = touches.first
            beginPoint = touch?.location(in: connectionView)
        }
    }
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        if connectionView != nil {
            let touch = touches.first
            let currentLocation = touch?.location(in: connectionView)
            var frame = connectionView.frame
            frame.origin.y += (currentLocation?.y)! - self.beginPoint.y;
            connectionView.frame = frame
        }
    }
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        self.dismiss(animated: true, completion: nil)
    }
    
    func addButtonAction(sender: UIButton) {
        let vc = WifiConnectViewController()
        let nav = NavigationController.init(rootViewController: vc);
        self.dismiss(animated: true) {
            UIApplication.shared.delegate?.window??.rootViewController?.present(nav, animated: true, completion: nil)
        }
    }
}

extension ConnectionViewController: ConnectViewDelegate {
    func connectSuccess(isSave: Bool) {
        NotificationCenter.default.post(name: NSNotification.Name("RefreshNotification") , object: nil)
        self.dismiss(animated: true) {
            let vc = SoftwareUpdateController()
            UIApplication.shared.delegate?.window??.rootViewController?.present(vc, animated: true, completion: nil)
        }
    }
    
    func connectFail(error: String) {
        //NotificationCenter.default.post(name: NSNotification.Name("RefreshNotification") , object: nil)
        self.dismiss(animated: true, completion: nil)
    }
}
