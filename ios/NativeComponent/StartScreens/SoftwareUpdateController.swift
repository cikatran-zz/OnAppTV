//
//  SoftwareUpdateControllerViewController.swift
//  STB
//
//  Created by 沈凯 on 2018/4/26.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit
import STBAPI

let screenWidth = UIScreen.main.bounds.size.width;
let screenHeight = UIScreen.main.bounds.size.height;

class SoftwareUpdateController: UIViewController {

    @IBOutlet weak var topic: UILabel!
    @IBOutlet weak var content: UILabel!
    @IBOutlet weak var on: UILabel!
    @IBOutlet weak var subTitle: UILabel!
    @IBOutlet weak var stb: UILabel!
    @IBOutlet weak var bottomLabel: UILabel!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var install: UIButton!
    
    var isPop: Bool!
    var isFirst: Bool!
    var loadingView: LoadingView!
    let time: TimeInterval = 2.0
    let duration = 0.5
    var connectView: ConnectView!
    var antenaView: AntenaView!
    var passwordView: PasswordView!
    var timer: Timer!
    var timerNumber: Int!
    var timerMax: Int!
    var isSetting: Bool!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let loadView_Width = screenWidth / 5
        let loadView_Height = CGFloat(16.0 / 664.0) * screenHeight
        let loadView_x = (screenWidth - loadView_Width) / 2
        let loadView_y = CGFloat(545.0 / 664.0) * screenHeight
        loadingView = LoadingView.init(frame: CGRect.init(x: loadView_x, y: loadView_y, width: loadView_Width, height: loadView_Height), tintColor: UIColor.white)
        loadingView.alpha = 0.25
        self.view.addSubview(loadingView)
        loadingView.startAnimating()

        defaultSetting()
        
        if isFirst {
            firstTimeDisplay()
        }else {
            otherDisplay()
        }
    }
    
    func defaultSetting() {
        if isFirst == nil {
            isFirst = false
        }
        
        if isPop == nil {
            isPop = false
        }
        
        if timerMax == nil {
            timerMax = 5
        }
        
        if isSetting == nil {
            isSetting = false
        }
    }
    
    func firstTimeDisplay() {
        self.subTitle.text = "Welcome to\na revolutionary TV app’s"
        
        isSetting = true
        timerNumber = 0
        
        timer = Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(scanStart), userInfo: nil, repeats: true);
        RunLoop.current.add(timer, forMode: .commonModes)
        
        Api.shared()?.hIG_UdpReceiveMessage({ (stbs) in
            if stbs?.count != 0 {
                self.scanStop()
                DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + self.time) {
                    self.on.isHidden = true
                    self.subTitle.isHidden = true
                    self.stb.isHidden = true
                    
                    self.loadingView.stopAnimating()
                    
                    if self.connectView == nil {
                        self.connectView = ConnectView.init()
                        self.connectView.isTabbar = false
                        self.connectView.confirm.setTitle("Connect", for: .normal)
                        self.connectView.add.addTarget(self, action: #selector(self.installButtonAction(_:)), for: .touchUpInside)
                        self.view.addSubview(self.connectView)
                        self.connectView.connectViewDelegate = self
                        
                        if sysVersion! < 11 {
                            self.connectView.transform = CGAffineTransform.init(scaleX: 0.01, y: 0.01)
                            UIView.animate(withDuration: self.duration) {
                                self.connectView.transform = CGAffineTransform.identity
                            }
                        }else {
                            self.connectView.alpha = 0.0
                            UIView.animate(withDuration: self.duration) {
                                self.connectView.alpha = 1.0
                            }
                        }
                    }
                }
            }
        })
    }
    
    func scanStart() {
        timerNumber = timerNumber + 1
        
        if (TARGET_IPHONE_SIMULATOR == 1 && TARGET_OS_IPHONE == 1) {
            Api.shared().hIG_UdpOperation();
        }else{
            Api.shared().hIG_GetMobileWifiInfo({ (dic) in
                if (dic?.keys.contains("SSID"))! {
                    let ssid = dic?["SSID"] as! String;
                    if !ssid.hasPrefix("STB") {
                        Api.shared().hIG_UdpOperation();
                    }
                }else {
                    Api.shared().hIG_UdpOperationInWan()
                }
            })
        }
        
        if timerNumber == timerMax {
            scanStop()
            on.isHidden = true
            subTitle.isHidden = true
            stb.isHidden = true
            
            loadingView.stopAnimating()
            
            topic.text = "Select your STB"
            //            Background
            let backgroundView_x = CGFloat(45.0 / 375.0) * kScreenWidth
            let backgroundView_y = CGFloat(99.0 / 664.0) * kScreenHeight
            let backgroundView_width = CGFloat(282.0 / 375.0) * kScreenWidth
            let backgroundView_height = backgroundView_width / CGFloat(282.0 / 396.0)
            let blur = UIBlurEffect.init(style: .light)
            let backgroundView = UIVisualEffectView.init(effect: blur)
            backgroundView.frame = CGRect.init(x: backgroundView_x, y: backgroundView_y, width: backgroundView_width, height: backgroundView_height)
            backgroundView.backgroundColor = UIColor.init(red: 0.0 / 255.0, green: 0.0 / 255.0, blue: 0.0 / 255.0, alpha: 0.26)
            backgroundView.layer.masksToBounds = true
            backgroundView.layer.cornerRadius = 13
            self.view.addSubview(backgroundView)
            //            Label
            let label = UILabel.init()
            label.numberOfLines = 0
            label.text = "No STB installed\non your local network !"
            label.font = UIFont.init(name: "SF UI Text", size: 17)
            label.textAlignment = .center
            label.sizeToFit()
            label.textColor = UIColor.white
            let label_x = (kScreenWidth - label.frame.size.width) / 2
            let label_y = CGFloat(222.0 / 665.0) * kScreenHeight
            label.frame = CGRect.init(x: label_x, y: label_y, width: label.frame.size.width, height: label.frame.size.height)
            self.view.addSubview(label)
            
            install.layer.masksToBounds = true
            install.layer.cornerRadius = install.frame.size.height / 2
            install.isHidden = false
            
            nextButton.backgroundColor = UIColor.clear
            nextButton.layer.borderWidth = 1.0
            nextButton.layer.borderColor = UIColor.init(white: 1.0, alpha: 0.25).cgColor
            nextButton.layer.masksToBounds = true
            nextButton.layer.cornerRadius = nextButton.frame.size.height / 2
            nextButton.setTitle("Skip", for: .normal)
            nextButton.setTitle("Skip", for: .highlighted)
            nextButton.isHidden = false
        }
    }
    
    func scanStop() {
        if timer != nil {
            timer.invalidate()
            timer = nil
        }
    }
    
    func otherDisplay() {
        self.on.isHidden = true
        self.subTitle.isHidden = true
        self.stb.isHidden = true
        
        self.topic.text = "Software update"
        self.content.text = "The Software of your STB\nis being updated,\nit will take less than 1 minute"
        self.getSoftware()
    }
    
    func getSoftware() {
        let bodyString = "{\"query\":\"{\\n  viewer {\\n    configOne(filter: {type: \\\"file-upload\\\", name: \\\"sig_app_upgrade.hi-global.bin\\\"}, sort: VERSION_DESC) {\\n      name\\n      version\\n      url\\n    }\\n  }\\n}\\n\"}"
        RequestUtil.hIG_PostRequest(bodyString: bodyString) { (data, response, error) in
            if data != nil {
                let dicT = try? JSONSerialization.jsonObject(with: data!, options: .mutableContainers) as! [AnyHashable : Any]
                let datas = dicT!["data"]as! [AnyHashable : Any]
                let viewer = datas["viewer"]as! [AnyHashable : Any]
                let configOne = viewer["configOne"]
                print(configOne!)
            }
            self.topic.text = "Channels list update"
            self.content.text = "The channels list is being\nupdated"
            self.getDatabase()
        }
    }
    
    
    
    func getDatabase() {
        let bodyString = "{\"query\":\"{\\n  viewer {\\n    configOne(filter: {type: \\\"file-upload\\\", name: \\\"channel_database.xml\\\"}, sort: VERSION_DESC) {\\n      name\\n      version\\n      url\\n    }\\n  }\\n}\\n\"}"
        RequestUtil.hIG_PostRequest(bodyString: bodyString) { (data, response, error) in
            if data != nil {
                let dicT = try? JSONSerialization.jsonObject(with: data!, options: .mutableContainers) as! [AnyHashable : Any]
                let datas = dicT!["data"]as! [AnyHashable : Any]
                let viewer = datas["viewer"]as! [AnyHashable : Any]
                let configOne = viewer["configOne"]as! [AnyHashable : Any]
                let url = configOne["url"] as! String
                self.dataParsing(url: url)
            }else {
                self.dataParsingLocal()
            }
        }
    }
    
    func dataParsing(url: String) {
        Api.shared().hIG_ParseXMLLastInJson(withPath: url, callback: { (jsonString) in
            self.getSTBConfigure()
        })
    }
    
    func dataParsingLocal() {
        Api.shared().hIG_ParseXMLLastInJson(withPath: Bundle.main.path(forResource: "channel_database-1", ofType: "xml"), callback: { (jsonString) in
            self.getSTBConfigure()
        })
    }
    
    func getSTBConfigure() {
        Api.shared().hIG_GetSTBConfigureAndCallback({ (model) in
            Api.shared().hIG_SetSTBConfigure(with: model, callback: { (bool, error) in
                if bool == true {
                    if self.isFirst {
                        if self.isSetting {
                            self.content.text = ""
                            self.loadingView.stopAnimating()
                            
                            self.antenaView = AntenaView.init()
                            
                            self.view.addSubview(self.antenaView)
                            
                            if sysVersion! < 11 {
                                self.antenaView.transform = CGAffineTransform.init(scaleX: 0.01, y: 0.01)
                                UIView.animate(withDuration: self.duration) {
                                    self.antenaView.transform = CGAffineTransform.identity
                                }
                            }else {
                                self.antenaView.alpha = 0.0
                                UIView.animate(withDuration: self.duration) {
                                    self.antenaView.alpha = 1.0
                                }
                            }
                            self.bottomLabel.isHidden = false
                            
                            self.nextButton.layer.masksToBounds = true
                            self.nextButton.layer.cornerRadius = self.nextButton.frame.size.height / 2
                            self.nextButton.setTitle("Next", for: .normal)
                            self.nextButton.setTitle("Next", for: .highlighted)
                            self.nextButton.isHidden = false
                        }else {
                            DispatchQueue.main.async {
                                goToReactNative()
                            }
                        }
                    }else {
                        DispatchQueue.main.async {
                            if self.isPop {
                                self.navigationController?.popViewController(animated: true)
                            }else {
                                self.dismiss(animated: true, completion: nil)
                            }
                        }
                    }
                }
            })
        })
        
    }
    
    @IBAction func nextButtonAction(_ sender: UIButton) {
        if sender.titleLabel?.text == "Skip" {
            DispatchQueue.main.async {
                goToReactNative()
            }
        }else {
            UIView.animate(withDuration: self.duration, animations: {
                self.antenaView.alpha = 0.0
            }) { (bool) in
                if bool == true {
                    self.antenaView.removeFromSuperview()
                    self.antenaView = nil
                }
            }
            self.bottomLabel.isHidden = true
            self.nextButton.isHidden = true
            
            self.topic.text = "Create PIN Code"
            passwordView = PasswordView.init()
            passwordView.alpha = 0.0
            self.view.addSubview(passwordView)
            passwordView.passwordViewDelegate = self
            
            UIView.animate(withDuration: self.duration) {
                self.passwordView.alpha = 1.0
            }
        }
    }
    
    @IBAction func installButtonAction(_ sender: UIButton) {
        DispatchQueue.main.async {
            self.navigationController?.pushViewController(WifiConnectViewController(), animated: true)
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return UIStatusBarStyle.lightContent
    }
}

extension SoftwareUpdateController: ConnectViewDelegate {
    
    func connectSuccess(isSave: Bool) {
        loadingView.startAnimating()
        if isSetting {
            self.on.isHidden = false
            self.subTitle.isHidden = false
            self.stb.isHidden = false
            subTitle.text = "Few more steps !"
            DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + time) {
                self.otherDisplay()
            }
        }else {
            otherDisplay()
        }
    }
    
    func connectFail(error: String) {
        
    }
}

extension SoftwareUpdateController: PasswordViewDelegate {
    
    func setPasswordSuccess() {
        DispatchQueue.main.async {
            goToReactNative()
        }
    }
    
    func setPasswordFail(error: String) {
        passwordView.reset()
    }
}
