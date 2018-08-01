//
//  ConnectView.swift
//  STB
//
//  Created by 沈凯 on 2018/4/24.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit
import STBAPI

let kScreenHeight = UIScreen.main.bounds.size.height
let kScreenWidth = UIScreen.main.bounds.size.width
let sysVersion = Int(UIDevice.current.systemVersion.components(separatedBy: ".").first!)

let connectView_ProportionHeight = CGFloat(490.0 / 665.0)
let connectView_ProportionWidth = CGFloat(282.0 / 375.0)
let connectView_AspectRatio = CGFloat(282.0 / 490.0)
let connectView_Width = kScreenWidth * connectView_ProportionWidth
let connectView_Height = connectView_Width / connectView_AspectRatio
let tabbarHeight = kScreenHeight * 0.08

protocol ConnectViewDelegate: NSObjectProtocol {
    func connectSuccess(isSave: Bool)
    func connectFail(error: String)
}

class ConnectView: UIView {
    
    var dataSource: [ConnectModel]!
    var tableView: UITableView!
    var timer: Timer!
    var backgroundView: UIVisualEffectView!
    var confirm: UIButton!
    var add: UIButton!
    var isTabbar: Bool {
        set {
            var currentframe = self.frame
            var y: CGFloat!
            if newValue == false {
                y = CGFloat(87.0 / 664.0) * kScreenHeight
            }else {
                y = (kScreenHeight - tabbarHeight - connectView_Height) / 2
            }
            currentframe.origin.y = y
            self.frame = currentframe
        }
        get {
            return self.isTabbar
        }
    }
    weak var connectViewDelegate: ConnectViewDelegate!
    var isOperation: Bool!
    
    init() {
        super.init(frame: CGRect.init(x: (kScreenWidth - connectView_Width) / 2, y: (kScreenHeight - tabbarHeight - connectView_Height) / 2, width: connectView_Width, height: connectView_Height))
        setupSubViews()
        loadData()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        fatalError("init(coder:) has not been implemented")
    }
    //    MARK: - Setup SubViews
    func setupSubViews() {
        
        self.layer.masksToBounds = true
        self.layer.cornerRadius = 13
        //        Background
        let blur = UIBlurEffect.init(style: .light)
        backgroundView = UIVisualEffectView.init(effect: blur)
        backgroundView.frame = CGRect.init(x: 0, y: 0, width: connectView_Width, height: connectView_Height)
        backgroundView.backgroundColor = UIColor.init(red: 36.0 / 255.0, green: 36.0 / 255.0, blue: 39.0 / 255.0, alpha: 0.26)
        addSubview(backgroundView)
        //        The title
        let title = UILabel()
        title.textColor = UIColor.white
        title.font = UIFont.init(name: "SF UI Text", size: 17)
        title.text = "Select STB"
        title.sizeToFit()
        let title_y = CGFloat(32.5 / 490) * connectView_Height
        let title_x = (connectView_Width - title.frame.size.width) / 2
        title.frame = CGRect.init(x: title_x, y: title_y, width: title.frame.size.width, height: title.frame.size.height)
        addSubview(title)
        //        Confirm Button
        let confirm_width = CGFloat(231.14 / 282) * connectView_Width
        let confirm_height = CGFloat(33.35 / 490) * connectView_Height
        let confirm_x = (connectView_Width - confirm_width) / 2
        let confirm_y = CGFloat(377.84 / 490) * connectView_Height
        confirm = UIButton.init(frame: CGRect.init(x: confirm_x, y: confirm_y, width: confirm_width, height: confirm_height))
        confirm.setBackgroundImage(image(with: UIColor.clear), for: .normal)
        confirm.isEnabled = false
        confirm.layer.masksToBounds = true
        confirm.layer.cornerRadius = confirm_height / 2
        confirm.layer.borderWidth = 1.0
        confirm.layer.borderColor = UIColor.init(white: 1.0, alpha: 0.26).cgColor
        confirm.setTitle("Confirm", for: .normal)
        confirm.setTitleColor(UIColor.white, for: .normal)
        confirm.setTitleColor(UIColor.gray, for: .highlighted)
        confirm.titleLabel?.font = UIFont.init(name: "SF UI Text", size: 17)
        confirm.addTarget(self, action: #selector(confirmAction), for: .touchUpInside)
        addSubview(confirm)
        //        Add Button
        let add_title = NSMutableAttributedString.init(string: "Add another STB")
        add_title.addAttribute(NSFontAttributeName, value: UIFont.init(name: "Helvetica Neue", size: 13)!, range: NSRange.init(location: 0, length: add_title.length))
        add_title.addAttribute(NSForegroundColorAttributeName, value: UIColor.white, range: NSRange.init(location: 0, length: add_title.length))
        add_title.addAttribute(NSUnderlineStyleAttributeName, value: NSNumber.init(value: Int8(NSUnderlineStyle.styleSingle.rawValue)), range: NSRange.init(location: 0, length: add_title.length))
        add = UIButton()
        add.setAttributedTitle(add_title, for: .normal)
        let add_title_highlighted = add_title.mutableCopy() as! NSMutableAttributedString
        add_title_highlighted.addAttribute(NSForegroundColorAttributeName, value: UIColor.lightText, range: NSRange.init(location: 0, length: add_title.length))
        add.setAttributedTitle(add_title_highlighted, for: .highlighted)
        add.sizeToFit()
        let add_x = (connectView_Width - add.frame.size.width) / 2
        let add_y = CGFloat(424.0 / 490.0) * connectView_Height
        add.alpha = 0.44
        add.frame = CGRect.init(x: add_x, y: add_y, width: add.frame.size.width, height: add.frame.size.height)
        addSubview(add)
        //        TableView
        let tableView_y = CGFloat(76.0 / 490.0) * connectView_Height
        let tableView_height = CGFloat(44 * 5 / 490.0) * connectView_Height
        tableView = UITableView.init(frame: CGRect.init(x: 0, y: tableView_y, width: connectView_Width, height: tableView_height))
        tableView.showsVerticalScrollIndicator = false
        tableView.showsHorizontalScrollIndicator = false
        tableView.bounces = false
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = UIColor.clear
        tableView.separatorStyle = .none
        tableView.rowHeight = CGFloat(44.0 / 490.0) * connectView_Height
        addSubview(tableView)
    }
    //    MARK: - Load Data
    func loadData() {
        
        dataSource = [ConnectModel]()
        isOperation = false
        
        timer = Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(scanStart), userInfo: nil, repeats: true);
        RunLoop.current.add(timer, forMode: .commonModes)
        
        Api.shared()?.hIG_UdpReceiveMessage({ (scans) in
            for temp in scans! {
                let scanInfo = temp as! ScanModel
                let connectModel = ConnectModel()
                connectModel.isOnline = true
                connectModel.isSelect = false
                connectModel.name = scanInfo.stb.sTBID
                connectModel.scanInfo = scanInfo
                var isSave = false
                for dataModel in self.dataSource {
                    if dataModel.name == connectModel.name {
                        if dataModel.isOnline == true {
                            isSave = true
                            connectModel.isSelect = dataModel.isSelect
                        }else {
                            let index = self.dataSource.index(of: dataModel)
                            self.dataSource.remove(at: index!)
                        }
                    }
                    
                    if Api.shared().hIG_IsConnect() && !self.isOperation {
                        if dataModel.name == Api.shared().currentSTBInfo.sTBID {
                            dataModel.isSelect = true
                        }else {
                            dataModel.isSelect = false
                        }
                    }
                }
                if isSave == false {
                    self.dataSource.insert(connectModel, at: 0)
                }
            }
            self.confirmIsEnabled(isEnabled: false)
            for dataModel in self.dataSource {
                if dataModel.isSelect {
                    self.confirmIsEnabled(isEnabled: true)
                }
            }
            self.tableView.reloadData()
        })
    }
    //    MARK: - Scan STB Start
    func scanStart() {
        if (TARGET_IPHONE_SIMULATOR == 1 && TARGET_OS_IPHONE == 1) {
            Api.shared().hIG_UdpOperation();
        }else{
            Api.shared().hIG_GetMobileWifiInfo({ (dic) in
                if (dic?.keys.contains("SSID"))! {
                    let ssid = dic?["SSID"] as! String;
                    if !ssid.hasPrefix("STB") {
                        Api.shared().hIG_UdpOperation();
                    }else {
                        self.dataSource.removeAll()
                        self.confirmIsEnabled(isEnabled: false)
                    }
                }else {
                    Api.shared().hIG_UdpOperationInWan()
                }
            })
        }
        
        Api.shared()?.hIG_UndiscoveredSTBList({ (stbs) in
            for temp in stbs! {
                let stbName = temp as! String
                let connectModel = ConnectModel()
                connectModel.isOnline = false
                connectModel.isSelect = false
                connectModel.name = stbName
                connectModel.scanInfo = nil
                var isSave = false
                for dataModel in self.dataSource {
                    if dataModel.name == connectModel.name {
                        if dataModel.isOnline == false {
                            isSave = true
                        }else {
                            let index = self.dataSource.index(of: dataModel)
                            self.dataSource.remove(at: index!)
                        }
                    }
                }
                if isSave == false {
                    self.dataSource.append(connectModel)
                }
            }
            self.tableView.reloadData()
        })
    }
    //    MARK: - Scan STB Stop
    func scanStop() {
        if timer != nil {
            timer.invalidate()
            timer = nil
        }
    }
    //    MARK: - Rewrite removeFromSuperview
    override func removeFromSuperview() {
        super.removeFromSuperview()
        scanStop()
    }
    //    MARK: - Confirm Button Action
    func confirmAction() {
        var isExist = false
        for model in self.dataSource {
            if model.isOnline && model.isSelect {
                isExist = true
                let isSave = (model.scanInfo.stb.sTBID == Api.shared().currentSTBInfo.sTBID) ? true : false
                Api.shared().hIG_ConnectSTB(with: model.scanInfo.stb, userName: model.scanInfo.userName, connectSuccessCallback: {
                    
                    UIView.animate(withDuration: 0.5, animations: {
                        if sysVersion! < 11 {
                            self.transform = CGAffineTransform.init(scaleX: 0.01, y: 0.01)
                        }else {
                            self.alpha = 0.0
                        }
                    }, completion: { (bool) in
                        if bool == true {
                            self.removeFromSuperview()
                            if self.connectViewDelegate != nil {
                                self.connectViewDelegate.connectSuccess(isSave: isSave)
                            }
                        }
                    })
                    
                }) { (error) in
                    if self.connectViewDelegate != nil {
                        self.connectViewDelegate.connectFail(error: error.debugDescription)
                    }
                }
            }
        }
        if isExist == false {
            if self.connectViewDelegate != nil {
                self.connectViewDelegate.connectFail(error: "Unselected equipment!")
            }
        }
    }
    
    //    MARK: - Customize the button to set the color click effect
    func image(with color: UIColor) -> UIImage {
        let rect = CGRect(x: 0.0, y: 0.0, width: 1.0, height: 1.0)
        UIGraphicsBeginImageContext(rect.size)
        let context = UIGraphicsGetCurrentContext()
        context?.setFillColor(color.cgColor)
        context?.fill(rect)
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return image ?? UIImage()
    }
}
extension ConnectView: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return dataSource.count
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let identifier = "ConnectViewCell"
        var cell = tableView.dequeueReusableCell(withIdentifier: identifier) as? ConnectViewCell
        if cell == nil {
            cell = ConnectViewCell.init(style: UITableViewCellStyle.default, reuseIdentifier: identifier)
        }
        cell?.selectionStyle = .none
        cell?.backgroundColor = UIColor.clear
        cell?.model = dataSource[indexPath.row]
        cell?.switchButton.tag = indexPath.row
        cell?.switchButton.addTarget(self, action: #selector(switchButtonAction(sender:)), for: .touchUpInside)
        return cell!
    }
    
    func switchButtonAction(sender: UISwitch) {
        isOperation = true
        for model in self.dataSource{
            if self.dataSource.index(of: model) == sender.tag {
                model.isSelect = sender.isOn;
            }else{
                model.isSelect = false;
            }
        }
        //        In order to save animation,delay 0.15s reload Data
        let time: TimeInterval = 0.15
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + time) {
            self.tableView.reloadData();
            self.confirmIsEnabled(isEnabled: sender.isOn)
        }
    }
    
    func confirmIsEnabled(isEnabled: Bool) {
        confirm.isEnabled = isEnabled
        if confirm.isEnabled {
            confirm.layer.borderWidth = 0.0
            confirm.setBackgroundImage(image(with: UIColor.init(red: 252 / 255.0, green: 53 / 255.0, blue: 91 / 255.0, alpha: 1.0)), for: .normal)
        }else {
            confirm.setBackgroundImage(image(with: UIColor.clear), for: .normal)
            confirm.layer.borderWidth = 1.0
            confirm.layer.borderColor = UIColor.init(white: 1.0, alpha: 0.26).cgColor
        }
    }
}
