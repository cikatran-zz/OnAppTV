//
//  AntenaView.swift
//  STB
//
//  Created by 沈凯 on 2018/5/3.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit
import STBAPI

let antenaView_ProportionHeight = CGFloat(396.0 / 665.0)
let antenaView_ProportionWidth = CGFloat(282.0 / 375.0)
let antenaView_AspectRatio = CGFloat(282.0 / 396.0)
let antenaView_Width = kScreenWidth * antenaView_ProportionWidth
let antenaView_Height = antenaView_Width / antenaView_AspectRatio

class AntenaView: UIView {
    
    var backgroundView: UIView!
    var tableView: UITableView!
    var strength: UIView!
    var quality: UIView!
    var timer: Timer!
    
    var dataSource: [AntenaModel]!
    
    let titles = ["DiSeqC1.0", "DiSepC 1.1", "LNB Type", "22 Khz", "Transponder"]
    let diSeqC10s = ["None", "LNB1", "LNB2", "LNB3", "LNB4"]
    lazy var diSeqC11s: [String] = {
        () -> [String] in
        var dataSource = [String].init();
        dataSource.append("None")
        for index in 1 ... 16 {
            let string = "LNB" + String(index);
            dataSource.append(string)
        }
        return dataSource;
    }()
    let lNBValue = ["OFF", "ON", "AUTO"]
    var lowLOF = ["5150", "5750", "9750"]
    var highLOF = ["10600", "10750", "11300", "11475"]
    
    var satellite: DatabaseSatelliteModel!
    
    init() {
        super.init(frame: CGRect.init(x: (kScreenWidth - antenaView_Width) / 2, y: CGFloat(99.0 / 665.0) * kScreenHeight, width: antenaView_Width, height: antenaView_Height))
        setupSubViews()
        loadData()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
//    MARK: - Setup SubViews
    func setupSubViews() {
        self.layer.masksToBounds = true
        self.layer.cornerRadius = 13
//        Background
        let blur = UIBlurEffect.init(style: .light)
        let effectView = UIVisualEffectView.init(effect: blur)
        effectView.frame = CGRect.init(x: 0, y: 0, width: connectView_Width, height: connectView_Height)
        effectView.contentView.backgroundColor = UIColor.init(red: 36.0 / 255.0, green: 36.0 / 255.0, blue: 39.0 / 255.0, alpha: 0.26)
        addSubview(effectView)
//        TableView
        let tableView_y = CGFloat(29.0 / 396.0) * antenaView_Height
        let tableView_height = CGFloat(44 * 5 / 396.0) * antenaView_Height
        tableView = UITableView.init(frame: CGRect.init(x: 0, y: tableView_y, width: antenaView_Width, height: tableView_height))
        tableView.showsVerticalScrollIndicator = false
        tableView.showsHorizontalScrollIndicator = false
        tableView.bounces = false
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = UIColor.clear
        tableView.separatorStyle = .none
        tableView.rowHeight = CGFloat(44.0 / 396.0) * antenaView_Height
        addSubview(tableView)
//        Signal Strength Label
        let strengthLabel = UILabel.init()
        strengthLabel.font = UIFont.init(name: "Helvetica Neue", size: 13)
        strengthLabel.text = "Signal Strength"
        strengthLabel.textColor = UIColor.white
        strengthLabel.sizeToFit()
        let strengthLabel_x = CGFloat(23.0 / 282.0) * antenaView_Width
        let strengthLabel_y = CGFloat(283.0 / 396.0) * antenaView_Height
        strengthLabel.frame = CGRect.init(x: strengthLabel_x, y: strengthLabel_y, width: strengthLabel.frame.size.width, height: strengthLabel.frame.size.height)
        addSubview(strengthLabel)
//        Signal Strength BackgroundView
        let strengthBackgroundView_x = strengthLabel_x
        let strengthBackgroundView_y = CGFloat(307.5 / 396.0) * antenaView_Height
        let strengthBackgroundView_width = CGFloat((282.0 - 23 * 2) / 282.0) * antenaView_Width
        let strengthBackgroundView_height = CGFloat(3.72 / 396.0) * antenaView_Width
        let strengthBackgroundView = UIView.init(frame: CGRect.init(x: strengthBackgroundView_x, y: strengthBackgroundView_y, width: strengthBackgroundView_width, height: strengthBackgroundView_height))
        strengthBackgroundView.backgroundColor = UIColor.black
        strengthBackgroundView.alpha = 0.09
        strengthBackgroundView.layer.masksToBounds = true
        strengthBackgroundView.layer.cornerRadius = CGFloat(3.72 / 4.0) * strengthBackgroundView_height
        addSubview(strengthBackgroundView)
//        Signal Quality Label
        let qualityLabel = UILabel.init()
        qualityLabel.font = UIFont.init(name: "Helvetica Neue", size: 13)
        qualityLabel.text = "Signal Quality"
        qualityLabel.textColor = UIColor.white
        qualityLabel.sizeToFit()
        let qualityLabel_x = CGFloat(23.0 / 282.0) * antenaView_Width
        let qualityLabel_y = CGFloat(325.0 / 396.0) * antenaView_Height
        qualityLabel.frame = CGRect.init(x: qualityLabel_x, y: qualityLabel_y, width: qualityLabel.frame.size.width, height: qualityLabel.frame.size.height)
        addSubview(qualityLabel)
//        Signal Quality BackgroundView
        let qualityBackgroundView_y = CGFloat(349.5 / 396.0) * antenaView_Height
        let qualityBackgroundView = UIView.init(frame: CGRect.init(x: strengthLabel_x, y: qualityBackgroundView_y, width: strengthBackgroundView_width, height: strengthBackgroundView_height))
        qualityBackgroundView.backgroundColor = UIColor.black
        qualityBackgroundView.alpha = strengthBackgroundView.alpha
        qualityBackgroundView.layer.masksToBounds = true
        qualityBackgroundView.layer.cornerRadius = strengthBackgroundView.layer.cornerRadius
        addSubview(qualityBackgroundView)
//        Strength View
        strength = UIView.init(frame: CGRect.init(x: strengthBackgroundView_x, y: strengthBackgroundView_y, width: 0, height: strengthBackgroundView_height))
        strength.backgroundColor = UIColor.init(red: 252.0 / 255.0, green: 53.0 / 255.0, blue: 91.0 / 255.0, alpha: 1.0)
        strength.layer.masksToBounds = true
        strength.layer.cornerRadius = strengthBackgroundView.layer.cornerRadius
        addSubview(strength)
//        Quality View
        quality = UIView.init(frame: CGRect.init(x: strengthBackgroundView_x, y: qualityBackgroundView_y, width: 0, height: strengthBackgroundView_height))
        quality.backgroundColor = UIColor.init(red: 252.0 / 255.0, green: 53.0 / 255.0, blue: 91.0 / 255.0, alpha: 1.0)
        quality.layer.masksToBounds = true
        quality.layer.cornerRadius = strengthBackgroundView.layer.cornerRadius
        addSubview(quality)
    }
//    MARK: - Load Data
    func loadData() {
        
        dataSource = [AntenaModel]()
        
        for i in 0 ..< titles.count {
            let model = AntenaModel.init()
            model.title = titles[i]
            model.arrayType = .none
            
            if Api.shared().hIG_IsConnect() {
                satellite = Api.shared().currentDatabaseModel.satelliteArr.lastObject as! DatabaseSatelliteModel
                model.transponderArray = satellite.transponderModelArr as! [DatabaseTransponderModel]?
                
                if i == 0 {
                    model.arrayType = .single
                    model.sigleArray = diSeqC10s
                    model.index = Int(satellite.diSEqC10)
                }else if i == 1 {
                    model.arrayType = .single
                    model.sigleArray = diSeqC11s
                    model.index = Int(satellite.diSEqC11)
                }else if i == 2 {
                    model.arrayType = .mixture
                    
                    if !lowLOF.contains(String.init(format: "%d", satellite.lowLOF)) {
                        lowLOF.append(String.init(format: "%d", satellite.lowLOF))
                    }
                    let i = lowLOF.index(of: String.init(format: "%d", satellite.lowLOF))!
                    
                    if !highLOF.contains(String.init(format: "%d", satellite.highLOF)) {
                        highLOF.append(String.init(format: "%d", satellite.highLOF))
                    }
                    let j = highLOF.index(of: String.init(format: "%d", satellite.highLOF))!
                    
                    model.index = i * highLOF.count + j
                }else if i == 3 {
                    model.arrayType = .single
                    model.sigleArray = lNBValue
                    model.index = Int(satellite.lNBValue)
                }else if i == 4 {
                    model.arrayType = .transponder
                    model.index = model.transponderArray.count - 1
                    
                    let transponder = satellite.transponderModelArr[model.index] as! DatabaseTransponderModel
                    Api.shared().hIG_SetFeTun(withCarrierID: transponder.carrierID, callback: nil)
                    
                    startTimer()
                }
            }else {
                model.transponderArray = nil
                if i == 0 {
                    model.arrayType = .single
                    model.sigleArray = diSeqC10s
                }else if i == 1 {
                    model.arrayType = .single
                    model.sigleArray = diSeqC11s
                }else if i == 2 {
                    model.arrayType = .mixture
                }else if i == 3 {
                    model.arrayType = .single
                    model.sigleArray = lNBValue
                }else if i == 4 {
                    model.arrayType = .transponder
                }
                model.index = 0
            }
            model.mixtureArray1 = lowLOF
            model.mixtureArray2 = highLOF
            dataSource.append(model)
        }
        tableView.reloadData()
    }
//    MARK: - Set Database
    func setDatabase() {
        let diseqC10 = dataSource.first?.index
        let diseqC11 = dataSource[1].index
        satellite.diSEqC10 = Int32(diseqC10!)
        satellite.diSEqC11 = Int32(diseqC11!)
        if diseqC10 == 0 && diseqC11 == 0 {
            satellite.diSEqCLevel = 0;
        }else if diseqC10 != 0 && diseqC11 == 0 {
            satellite.diSEqCLevel = 1;
        }else if diseqC10 == 0 && diseqC11 != 0 {
            satellite.diSEqCLevel = 2;
        }else {
            satellite.diSEqCLevel = 5;
        }
        satellite.lNBValue = Int32(dataSource[3].index)
        
        satellite.lowLOF = Int32(lowLOF[dataSource[2].index / highLOF.count])!
        satellite.highLOF = Int32(highLOF[dataSource[2].index % highLOF.count])!
        
        Api.shared().hIG_SetSatellite(with: satellite, callback: nil)
        
        let transponder = satellite.transponderModelArr[dataSource[4].index] as! DatabaseTransponderModel
        Api.shared().hIG_SetFeTun(withCarrierID: transponder.carrierID, callback: nil)
        
        startTimer()
    }
    
//    MARK: - Get Signal
    func getSignal() {
        Api.shared().hIG_GetSignalCallback { (bool, error, carrierID, signal, quality) in
            if bool == true {
                var strengthFrame = self.strength.frame
                strengthFrame.size.width = CGFloat(CGFloat(signal) / 100.0) * CGFloat((282.0 - 23 * 2) / 282.0) * antenaView_Width

                var qualityFrame = self.quality.frame
                qualityFrame.size.width = CGFloat(CGFloat(quality) / 100.0) * CGFloat((282.0 - 23 * 2) / 282.0) * antenaView_Width
                
                UIView.animate(withDuration: 0.1, animations: {
                    self.strength.frame = strengthFrame
                    self.quality.frame = qualityFrame
                })
            }
        }
    }
//    MARK: - Start Timer
    func startTimer() {
        stopTimer()
        timer = Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(getSignal), userInfo: nil, repeats: true);
        RunLoop.current.add(timer, forMode: .commonModes)
    }
//    MARK: - Stop Timer
    func stopTimer() {
        if timer != nil {
            timer.invalidate()
            timer = nil
        }
    }
//    MARK: - Rewrite removeFromSuperview
    override func removeFromSuperview() {
        super.removeFromSuperview()
        stopTimer()
    }
}
//    MARK: - TableView Delegate
extension AntenaView: UITableViewDelegate, UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return dataSource.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let identifier = "AntenaViewCell"
        var cell = tableView.dequeueReusableCell(withIdentifier: identifier) as? AntenaViewCell
        if cell == nil {
            cell = AntenaViewCell.init(style: UITableViewCellStyle.default, reuseIdentifier: identifier)
        }
        cell?.selectionStyle = .none
        cell?.backgroundColor = UIColor.clear
        cell?.model = dataSource[indexPath.row]
        cell?.leftButton.tag = indexPath.row * 10 + 1
        cell?.rightButton.tag = indexPath.row * 10 + 2
        cell?.leftButton.addTarget(self, action: #selector(buttonAction(sender:)), for: .touchUpInside)
        cell?.rightButton.addTarget(self, action: #selector(buttonAction(sender:)), for: .touchUpInside)
        
        return cell!
    }
//    MARK: - Button Action
    func buttonAction(sender: UIButton) {
        
        let index = sender.tag / 10
        let isLeft = sender.tag % 10 == 1 ? true : false
        let model = dataSource[index]
        
        if index == 0 || index == 1 || index == 3 {
            if isLeft {
                if model.index == 0 {
                    model.index = model.sigleArray.count - 1
                }else {
                    model.index = model.index - 1
                }
            }else {
                if model.index == model.sigleArray.count - 1 {
                    model.index = 0
                }else {
                    model.index = model.index + 1
                }
            }
        }else if index == 4 {
            if model.transponderArray != nil {
                if isLeft {
                    if model.index == 0 {
                        model.index = model.transponderArray.count - 1
                    }else {
                        model.index = model.index - 1
                    }
                }else {
                    if model.index == model.transponderArray.count - 1 {
                        model.index = 0
                    }else {
                        model.index = model.index + 1
                    }
                }
            }
        }else if index == 2 {
            let indexMax = model.mixtureArray1.count * model.mixtureArray2.count - 1
            if isLeft {
                if model.index == 0 {
                    model.index = indexMax
                }else {
                    model.index = model.index - 1
                }
            }else {
                if model.index == indexMax {
                    model.index = 0
                }else {
                    model.index = model.index + 1
                }
            }
        }
        tableView.reloadData()
        setDatabase()
    }
}
