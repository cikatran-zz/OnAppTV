//
//  PasswordView.swift
//  STB
//
//  Created by 沈凯 on 2018/5/4.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit
import STBAPI

protocol PasswordViewDelegate: NSObjectProtocol {
    func setPasswordSuccess()
    func setPasswordFail(error: String)
}

class PasswordView: UIView {

    var passwordViewLabel: UILabel!
    var password: String!
    var passwordConfirm: String!
    var isConfirm: Bool!
    weak var passwordViewDelegate: PasswordViewDelegate!
    
    init() {
        super.init(frame: CGRect.init(x: 0, y: 0, width: screenWidth, height: screenHeight))
        setupSubViews()
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
//    MARK: - Setup SubViews
    func setupSubViews() {
//        Password View
        let passwordView_width = CGFloat(282.0 / 375.0) * kScreenWidth
        let passwordView_height = passwordView_width / CGFloat(282.0 / 118.0)
        let passwordView_y = CGFloat(197.0 / 664.9) * kScreenHeight
        let passwordView_x = (kScreenWidth - passwordView_width) / 2
        let passwordView = UIView.init(frame: CGRect.init(x: passwordView_x, y: passwordView_y, width: passwordView_width, height: passwordView_height))
        passwordView.layer.masksToBounds = true
        passwordView.layer.cornerRadius = 13.0
        addSubview(passwordView)
//        Password View Background
        let passwordViewBackground = UIView.init(frame: CGRect.init(x: 0, y: 0, width: passwordView_width, height: passwordView_height))
        passwordViewBackground.backgroundColor = UIColor.init(red: 101.0 / 255.0, green: 100.0 / 255.0, blue: 102.0 / 255.0, alpha: 0.28)
        passwordView.addSubview(passwordViewBackground)
//        Password View Label
        passwordViewLabel = UILabel.init()
        passwordViewLabel.font = UIFont.init(name: "SF UI Text", size: 15)
        passwordViewLabel.text = "Confirm PIN Code"
        passwordViewLabel.sizeToFit()
        passwordViewLabel.text = "Enter PIN Code"
        passwordViewLabel.textColor = UIColor.white
        
        let passwordViewCircleView_width = CGFloat(68.0)
        let passwordViewCircleView_height = CGFloat(14.0)
        
        let passwordViewLabel_x = (passwordView_width - (passwordViewLabel.frame.size.width + passwordViewCircleView_width + CGFloat(11.0 / 282.0) * passwordView_width)) / 2
        let passwordViewLabel_y = (passwordView_height - passwordViewLabel.frame.size.height) / 2
        passwordViewLabel.frame = CGRect.init(x: passwordViewLabel_x, y: passwordViewLabel_y, width: passwordViewLabel.frame.size.width, height: passwordViewLabel.frame.size.height)
        passwordView.addSubview(passwordViewLabel)
//        Password View Circle View
        let passwordViewCircleView_y = (passwordView_height - passwordViewCircleView_height) / 2
        let passwordViewCircleView_x = CGFloat(11.0 / 282.0) * passwordView_width + passwordViewLabel_x + passwordViewLabel.frame.size.width
        let passwordViewCircleView = UIView.init(frame: CGRect.init(x: passwordViewCircleView_x, y: passwordViewCircleView_y, width: passwordViewCircleView_width, height: passwordViewCircleView_height))
        passwordView.addSubview(passwordViewCircleView)
//        Circle Image
        for i in 0...3 {
            let circle = UIImageView.init(image: UIImage.init(named: "password-base"))
            circle.sizeToFit()
            let circle_space = (passwordViewCircleView_width - 4 * circle.frame.size.width) / 3
            let circle_x = CGFloat(i) * (circle_space + circle.frame.size.width)
            let circle_y = (passwordViewCircleView_height - circle.frame.size.height) / 2
            circle.frame = CGRect.init(x: circle_x, y: circle_y, width: circle.frame.size.width, height: circle.frame.size.height)
            circle.tag = 10 + i
            passwordViewCircleView.addSubview(circle)
        }
//        Button View
        let buttonView_y = CGFloat(448.0 / 664.0) * kScreenHeight
        let buttonView_height = (1 - CGFloat(448.0 / 664.0)) * kScreenHeight
        let buttonView = UIView.init(frame: CGRect.init(x: 0, y: buttonView_y, width: kScreenWidth, height: buttonView_height))
        addSubview(buttonView)
//        Button
        let button_horizontalSpace1 = CGFloat(5.0 / 375) * kScreenWidth
        let button_horizontalSpace2 = CGFloat(7.0 / 375) * kScreenWidth
        let button_verticalSpace = CGFloat(6.0 / 216.0) * buttonView_height
        let button_width = (kScreenWidth - 2 * (button_horizontalSpace1 + button_horizontalSpace2)) / 3
        let button_height = (buttonView_height - 5 * button_verticalSpace) / 4
        for i in 0...11 {
            if i == 9 {
                continue
            }
            let button_x = button_horizontalSpace1 + CGFloat(i % 3) * (button_width + button_horizontalSpace2)
            let button_y = CGFloat(i / 3) * (button_height + button_verticalSpace) + button_verticalSpace
            let button = UIButton.init(frame: CGRect.init(x: button_x, y: button_y, width: button_width, height: button_height))
            button.titleLabel?.font = UIFont.init(name: "SF Pro Display", size: 25)
            if i != 11 {
                button.setBackgroundImage(image(with: UIColor.init(white: 1.0, alpha: 0.14)), for: .normal)
                var button_string = String.init(i + 1)
                if i == 10 {
                    button_string = String.init(0)
                }
                button.setTitle(button_string, for: .normal)
                button.setTitleColor(UIColor.white, for: .normal)
                button.setTitleColor(UIColor.lightGray, for: .highlighted)
            }else {
                button.setImage(UIImage.init(named: "password-delete"), for: .normal)
            }
            button.layer.masksToBounds = true
            button.layer.cornerRadius = 4
            button.tag = 20 + i
            button.addTarget(self, action: #selector(buttonAction(sender:)), for: .touchUpInside)
            buttonView.addSubview(button)
        }
    }
//    MARK: - Common Init
    func commonInit() {
        password = ""
        passwordConfirm = ""
        isConfirm = false
    }
//    MARK: - Button Action
    func buttonAction(sender: UIButton) {
        if !isConfirm {
            password = passwordAction(sender: sender, string: password)
            if password.count == 4 {
                let image = UIImage.init(named: "password-base");
                DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.1) {
                    self.isConfirm = true
                    self.passwordViewLabel.text = "Confirm PIN Code"
                    for i in 0...3 {
                        let circle = self.viewWithTag(10 + i) as! UIImageView
                        circle.image = image;
                    }
                }
            }
        }else {
            passwordConfirm = passwordAction(sender: sender, string: passwordConfirm)
            if passwordConfirm.count == 4 {
                if passwordConfirm == password {
                    Api.shared().hIG_ResetSTBPIN(withOldPIN: Api.shared().hIG_GetSTBPIN(), newPIN: passwordConfirm) { (bool, error) in
                        if bool == true {
                            if self.passwordViewDelegate != nil {
                                self.passwordViewDelegate.setPasswordSuccess()
                            }
                        }else {
                            if error == "New PIN cannot be the same as the old PIN" {
                                if self.passwordViewDelegate != nil {
                                    self.passwordViewDelegate.setPasswordSuccess()
                                }
                            }else {
                                if self.passwordViewDelegate != nil {
                                    self.passwordViewDelegate.setPasswordFail(error: error!)
                                }
                            }
                        }
                    }
                }else {
                    DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.1) {
                        self.reset()
                    }
                }
            }
        }
    }
    
    func passwordAction(sender: UIButton, string: String) -> String{
        var mutableString = string
        var tag = 10 + mutableString.count - 1;
        if sender.tag == 31 {
            let image = UIImage.init(named: "password-base");
            if mutableString.count != 0 {
                let circle = viewWithTag(tag) as! UIImageView
                circle.image = image;
            }else if mutableString.count == 0 && isConfirm {
                isConfirm = false
                password = ""
                passwordViewLabel.text = "Enter PIN Code"
            }
            //            Remove the last character
            if mutableString.count > 0 {
                mutableString.remove(at: mutableString.index(before: mutableString.endIndex));
            }
        }else {
            if mutableString.count < 4 {
                mutableString = mutableString + (sender.titleLabel?.text)!
                tag = 10 + mutableString.count - 1;
                let image = UIImage.init(named: "password-top");
                let circle = viewWithTag(tag) as! UIImageView
                circle.image = image;
            }
        }
        return mutableString
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
//    MARK: - Reset
    func reset() {
        password = ""
        passwordConfirm = ""
        isConfirm = false
        passwordViewLabel.text = "Enter PIN Code"
        let image = UIImage.init(named: "password-base");
        for i in 0...3 {
            let circle = self.viewWithTag(10 + i) as! UIImageView
            circle.image = image;
        }
    }
}
