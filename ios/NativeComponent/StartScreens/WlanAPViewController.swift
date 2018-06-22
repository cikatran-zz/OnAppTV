//
//  WlanAPViewController.swift
//  STB
//
//  Created by willa on 2018/5/7.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit
import STBAPI
import Foundation

class WlanAPViewController: UIViewController, SwiperDelegate, UITextViewDelegate {
    
    @IBOutlet weak var swiperView: SwiperView!
    @IBOutlet weak var bottomView: UIView!
    @IBOutlet weak var searchBtn: UIButton!
    @IBOutlet weak var installBtn: UIButton!
    @IBOutlet weak var wifiTitle: UILabel!
    @IBOutlet weak var wlanView: UIView!
    @IBOutlet weak var wifiName: UITextField!
    @IBOutlet weak var wlanPwd: UITextField!
    @IBOutlet weak var connectWlan: UIButton!
    @IBOutlet weak var changeBtn: UIButton!
    @IBOutlet weak var showPwd: UIButton!
    @IBOutlet weak var textFiledBg1: UIView!
    @IBOutlet weak var textFiledBg2: UIView!
    var timer: Timer!
    var isPop: Bool!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loadUI()
        loadData()
    }
    
    func loadUI() -> Void {
        searchBtn.layer.borderWidth = 1
        searchBtn.layer.borderColor = UIColor.init(red: 132/255.0, green: 132/255.0, blue: 132/255.0, alpha: 0.25).cgColor
        searchBtn.backgroundColor = UIColor.clear
        searchBtn.layer.cornerRadius = CGFloat(232.2 / 375.0) * kScreenWidth * CGFloat(33.35 / 232.2) / 2
        
        installBtn.layer.borderWidth = 1
        installBtn.layer.borderColor = UIColor.init(red: 132/255.0, green: 132/255.0, blue: 132/255.0, alpha: 0.25).cgColor
        installBtn.backgroundColor = UIColor.clear
        installBtn.layer.cornerRadius = CGFloat(232.2 / 375.0) * kScreenWidth * CGFloat(33.35 / 232.2) / 2
        
        showPwd.contentHorizontalAlignment = UIControlContentHorizontalAlignment.left
        showPwd.titleEdgeInsets = UIEdgeInsets.init(top: 0, left: 20, bottom: 0, right: 0)
        showPwd.imageEdgeInsets = UIEdgeInsets.init(top: 0, left: 10, bottom: 0, right: 0)
        
        textFiledBg1.layer.masksToBounds = true
        textFiledBg2.layer.masksToBounds = true
        textFiledBg1.layer.cornerRadius = CGFloat(335.0 / 375.0) * kScreenWidth * CGFloat(41.0 / 335.0) / 2
        textFiledBg2.layer.cornerRadius = CGFloat(335.0 / 375.0) * kScreenWidth * CGFloat(41.0 / 335.0) / 2
        textFiledBg1.layer.borderWidth = 1.0
        textFiledBg2.layer.borderWidth = 1.0
        textFiledBg1.layer.borderColor = UIColor.init(red: 231.0 / 255.0, green: 231.0 / 255.0, blue: 231.0 / 255.0, alpha: 1.0).cgColor
        textFiledBg2.layer.borderColor = UIColor.init(red: 231.0 / 255.0, green: 231.0 / 255.0, blue: 231.0 / 255.0, alpha: 1.0).cgColor
        
        let swiperGesture = UISwipeGestureRecognizer.init(target: self, action:#selector(panAction(gesture:)) )
        swiperGesture.direction = UISwipeGestureRecognizerDirection.right
        wlanView.addGestureRecognizer(swiperGesture)
        
        wifiName.delegate = self
        wlanPwd.delegate = self
    }
    
    func loadData() -> Void {
        timer = Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(searchWlan), userInfo: nil, repeats: true);
        RunLoop.current.add(timer, forMode: .commonModes)
        
        let swiperData = NSMutableArray.init()
        let imageViews = ["", "start-settings.png", ""];
        let isShowImages = [false, true, false];
        let titles = ["Step 1", "Step 2", ""];
        let contents = ["Press on CH+ key of your STB during 3s\nuntil the LED flashes", "Open the Setting Menu of your device\nselect the WiFi Menu", ""];
        
        for i in 0 ..< titles.count {
            let swiperModel = SwiperModel()
            swiperModel.imageView = imageViews[i]
            swiperModel.isShowImageView = isShowImages[i]
            swiperModel.title = titles[i]
            swiperModel.content = contents[i]
            swiperData.add(swiperModel)
        }
        
        swiperView.swiperDelegate = self
        swiperView.datas = swiperData
        
        NotificationCenter.default.addObserver(self, selector: #selector(transformView(aNSNotification:)), name: .UIKeyboardWillChangeFrame, object: nil)
//        NotificationCenter.default.addObserver(self, selector: #selector(self.transformView), name: .UIKeyboardWillChangeFrame, object: nil)
    }
    
    func test() {
        print("test")
    }
    
    func panAction(gesture: UIGestureRecognizer) -> Void {
        wlanView.alpha = 0
        swiperView.alpha = 1.0
        bottomView.alpha = 1.0
        swiperView.scrollViewToPosition()
    }
    
    func searchWlan() -> Void {
        Api.shared().hIG_GetMobileWifiInfo({ (dics) in
            if (dics?.keys.contains("SSID"))! {
                let ssid = dics?["SSID"] as! String;
                if ssid.hasPrefix("STB") {
                    let index = ssid.index(ssid.startIndex, offsetBy: 4)
                    let result = ssid.substring(from: index)
                    self.wifiTitle.text = "WIFI" + " " + result
                }else {
                    self.wifiTitle.text = "WIFI"
                }
            }else {
                self.wifiTitle.text = "WIFI"
            }
        })
    }
    
    @IBAction func searchAction(_ sender: UIButton) {
        
    }
    
    @IBAction func installWPS(_ sender: UIButton) {
        let vc = WlanWPSViewController();
        self.navigationController?.pushViewController(vc, animated: true)
    }
    
    @IBAction func comeBack(_ sender: UIButton) {
        self.navigationController?.popViewController(animated: true)
    }
    
    func swiperToPage(currentIndex: Int) {
        if currentIndex == 1 {
            searchBtn.setTitle("Press here to continue", for: .normal)
        } else if (currentIndex == 0) {
            searchBtn.setTitle("Search your STB", for: .normal)
        }
    }
    func swiperToLastPage() {
        // 隐藏 swiperView 和 bottomView
        swiperView.alpha = 0
        bottomView.alpha = 0
        wlanView.alpha = 1.0

        let placeholderWifiName = NSMutableAttributedString.init(string: "wifi")
        placeholderWifiName.addAttribute(NSFontAttributeName, value: UIFont.init(name: "SF UI Text", size: 14)!, range: NSRange.init(location: 0, length: placeholderWifiName.length))
        placeholderWifiName.addAttribute(NSForegroundColorAttributeName, value: UIColor.black, range: NSRange.init(location: 0, length: placeholderWifiName.length))
        
    
        let placeholderPassword = NSMutableAttributedString.init(string: "Password")
        placeholderPassword.addAttribute(NSFontAttributeName, value: UIFont.init(name: "SF UI Text", size: 14)!, range: NSRange.init(location: 0, length: placeholderPassword.length))
        placeholderPassword.addAttribute(NSForegroundColorAttributeName, value: UIColor.black, range: NSRange.init(location: 0, length: placeholderPassword.length))
        
        if sysVersion! < 11 {
            placeholderWifiName.addAttributes([NSBaselineOffsetAttributeName:-1], range: NSRange.init(location: 0, length: placeholderWifiName.length))
            placeholderPassword.addAttributes([NSBaselineOffsetAttributeName:-1], range: NSRange.init(location: 0, length: placeholderPassword.length))
        }
        
        wifiName.attributedPlaceholder = placeholderWifiName
        wlanPwd.attributedPlaceholder = placeholderPassword
        
        connectWlan.backgroundColor = UIColor.init(red: 253/255.0, green: 53/255.0, blue: 91/255.0, alpha: 1.0)
        connectWlan.layer.cornerRadius = CGFloat(227.0 / 375.0) * kScreenWidth * CGFloat(34.0 / 227.0) / 2
        
        changeBtn.layer.borderWidth = 1
        changeBtn.layer.borderColor = UIColor.init(red: 227/255.0, green: 227/255.0, blue: 227/255.0, alpha: 1).cgColor
        changeBtn.layer.cornerRadius = CGFloat(227.0 / 375.0) * kScreenWidth * CGFloat(34.0 / 227.0) / 2
    }
    
    func swiperButtonInClicked(currentIndex: Int) {
        if currentIndex == 1 {
            OpenSystemWiFiInterface()
        }
    }
    
    func OpenSystemWiFiInterface() {
        JumpToSystem.hIG_JumpSystem(cmd: .WIFI) { (isSuccess) in
            
        }
    }
    
    @IBAction func connectWlanAP(_ sender: UIButton) {
        if (wifiName.text?.count)! > 0 && (wlanPwd.text?.count)! > 0 {
            Api.shared().hIG_STBWlanAP(withSSID: wifiName.text, password: wlanPwd.text) { (bool, error) in
                if bool == true {
                    let vc = SoftwareUpdateController();
                    vc.isFirst = true
                    vc.timerMax = 40
                    vc.isSetting = true
                    vc.isPop = self.isPop
                    self.navigationController?.pushViewController(vc, animated: true)
                }
            }
        }
    }
    
    @IBAction func showPwd(_ sender: UIButton) {
        sender.isSelected = !sender.isSelected
        wlanPwd.isSecureTextEntry = sender.isSelected ? false:true
    }
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        wlanView.endEditing(true)
    }
}

extension WlanAPViewController: UITextFieldDelegate {
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == wifiName {
            wlanPwd.becomeFirstResponder()
        }else {
            wlanView.endEditing(true)
        }
        return true
    }
    
    func transformView(aNSNotification: NSNotification) {
        
        let y = CGFloat(490.0 / 667.0) * kScreenHeight

        let keyBoardBeginBounds = aNSNotification.userInfo![UIKeyboardFrameBeginUserInfoKey] as! NSValue
        let beginRect = keyBoardBeginBounds.cgRectValue
        
        let keyBoardEndBounds = aNSNotification.userInfo![UIKeyboardFrameEndUserInfoKey] as! NSValue
        let endRect = keyBoardEndBounds.cgRectValue
        
        if endRect.origin.y - beginRect.origin.y < 0 {
            if endRect.origin.y < y {
                let deltaY = endRect.origin.y - y
                UIView.animate(withDuration: 0.1) {
                    self.wlanView.transform = CGAffineTransform.init(translationX: 0, y: deltaY)
                }
            }
        }else if endRect.origin.y - beginRect.origin.y > 0 {
            UIView.animate(withDuration: 0.1) {
                self.wlanView.transform = CGAffineTransform.identity
            }
        }else {
            
        }
    }
}


