//
//  ConnectViewCell.swift
//  STB
//
//  Created by 沈凯 on 2018/4/25.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

class ConnectViewCell: UITableViewCell {
    
    var dotImage: UIImageView!
    var name: UILabel!
    var switchBackground: UIView!
    var switchButton: UISwitch!
    
    var model: ConnectModel {
        set {
            if newValue.name != nil {
                name.text  = newValue.name
            }else {
                name.text  = " "
            }
            if newValue.isOnline {
                dotImage.image = UIImage.init(named: "connectView-dot_green")
                switchButton.isHidden = false
                switchBackground.isHidden = false
                name.alpha = 1.0
            }else {
                dotImage.image = UIImage.init(named: "connectView-dot_gray")
                switchButton.isHidden = true
                switchBackground.isHidden = true
                name.alpha = 0.56
            }
            switchButton.setOn(newValue.isSelect, animated: true);
        }
        get {
            return self.model
        }
    }
    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        self.frame = CGRect.init(x: 0, y: 0, width: connectView_Width, height: CGFloat(44.0 / 490.0) * connectView_Height)
        setupSubViews()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func setupSubViews() {
        //        Dot
        dotImage = UIImageView.init(image: UIImage.init(named: "connectView-dot_gray"))
        let dot_x = CGFloat(29.0 / 282.0) * self.frame.size.width
        let dot_y = (self.frame.size.height - dotImage.frame.size.height ) / 2
        dotImage.frame = CGRect.init(x: dot_x, y: dot_y, width: dotImage.frame.size.width, height: dotImage.frame.size.height)
        addSubview(dotImage)
        //        Label
        name = UILabel.init()
        name.font = UIFont.init(name: "SF UI Text", size: 15)
        name.text = "WWWWWWWW"
        name.sizeToFit()
        let name_x = CGFloat(53.0 / 282.0) * self.frame.size.width
        let name_y = (self.frame.size.height - name.frame.size.height ) / 2
        name.frame = CGRect.init(x: name_x, y: name_y, width: name.frame.size.width, height: name.frame.size.height)
        name.textColor = UIColor.white
        addSubview(name)
        //        Switch Button
        switchButton = UISwitch.init()
        let switchButton_x = CGFloat(214.0 / 282.0) * self.frame.size.width
        let switchButton_y = (self.frame.size.height - switchButton.frame.size.height * 0.85) / 2
        switchButton.transform = CGAffineTransform.init(scaleX: 0.85, y: 0.85)
        switchButton.frame = CGRect.init(x: switchButton_x, y: switchButton_y, width: switchButton.frame.size.width, height: switchButton.frame.size.height)
        switchButton.onTintColor = UIColor.init(red: 255.0 / 255.0, green: 45.0 / 255.0, blue: 85.0 / 255.0, alpha: 1.0)
        switchButton.tintColor = UIColor.clear
        addSubview(switchButton)
        //        Switch Background View
        switchBackground = UIView.init(frame: switchButton.frame)
        switchBackground.layer.masksToBounds = true
        switchBackground.layer.cornerRadius = switchButton.frame.height / 2
        switchBackground.transform = CGAffineTransform.init(scaleX: 0.85, y: 0.85)
        switchBackground.frame = CGRect.init(x: switchButton.frame.origin.x * 0.997, y: switchButton.frame.origin.y, width: switchBackground.frame.size.width, height: switchBackground.frame.size.height)
        switchBackground.alpha = 0.21
        switchBackground.backgroundColor = UIColor.white
        insertSubview(switchBackground, belowSubview: switchButton)
        //        Bottom Line
        let bottomLine_x = CGFloat(24.0 / 282.0) * self.frame.size.width
        let bottomLine_y = self.frame.size.height - 1
        let bottomLine_width = CGFloat(233.0 / 282.0) * self.frame.size.width
        let bottomLine = UIView.init(frame: CGRect.init(x: bottomLine_x, y: bottomLine_y, width: bottomLine_width, height: 1))
        bottomLine.backgroundColor = UIColor.white
        bottomLine.alpha = 0.13
        addSubview(bottomLine)
    }
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
    
}
