//
//  AntenaViewCell.swift
//  STB
//
//  Created by 沈凯 on 2018/5/3.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

class AntenaViewCell: UITableViewCell {

    var title: UILabel!
    var content: UILabel!
    var leftButton: UIButton!
    var rightButton: UIButton!
    
    var model: AntenaModel {
        set {
            
            if newValue.title != nil {
                title.text  = newValue.title
            }else {
                title.text  = " "
            }
            
            if newValue.index == nil {
                newValue.index = 0
            }
            
            switch newValue.arrayType {
            case .none:
                content.text = ""
                break
            case .single:
                content.text = newValue.sigleArray[newValue.index]
                break
            case .transponder:
                if newValue.transponderArray != nil {
                    content.text = String.init(format: "%d", newValue.transponderArray[newValue.index].frequency) + "/" + String.init(format: "%d", newValue.transponderArray[newValue.index].symbolRate)
                }else {
                    content.text = "0/0"
                }
                break
            case .mixture:
                let mix1 = newValue.index / newValue.mixtureArray2.count
                let mix2 = newValue.index % newValue.mixtureArray2.count
                content.text = newValue.mixtureArray1[mix1] + "/" + newValue.mixtureArray2[mix2]
                break
            default:
                content.text = ""
            }
        }
        get {
            return self.model
        }
    }
    
    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        self.frame = CGRect.init(x: 0, y: 0, width: antenaView_Width, height: CGFloat(44.0 / 396.0) * antenaView_Height)
        setupSubViews()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func setupSubViews() {
//        Bottom Line
        let bottomLine_x = CGFloat(23.0 / 282.0) * self.frame.size.width
        let bottomLine_y = self.frame.size.height - 1
        let bottomLine_width = CGFloat((282.0 - 23.0 * 2) / 282.0) * self.frame.size.width
        let bottomLine = UIView.init(frame: CGRect.init(x: bottomLine_x, y: bottomLine_y, width: bottomLine_width, height: 1))
        bottomLine.backgroundColor = UIColor.white
        bottomLine.alpha = 0.07
        addSubview(bottomLine)
//        Left Button
        let leftButton_width = CGFloat(16.05 / 282.0) * self.frame.size.width
        let leftButton_height = CGFloat(13.0 / 396.0) * antenaView_Height
        let leftButton_x = CGFloat(130.77 / 282.0) * self.frame.size.width
        let leftButton_y = (self.frame.size.height - leftButton_height) / 2
        leftButton = UIButton.init()
        leftButton.setImage(UIImage.init(named: "leftArrow"), for: .normal)
        leftButton.frame = CGRect.init(x: leftButton_x, y: leftButton_y, width: leftButton_width, height: leftButton_height)
        addSubview(leftButton)
//        Right Button
        let rightButton_width = CGFloat(16.05 / 282.0) * self.frame.size.width
        let rightButton_height = CGFloat(13.0 / 396.0) * antenaView_Height
        let rightButton_x = CGFloat(240.77 / 282.0) * self.frame.size.width
        let rightButton_y = (self.frame.size.height - leftButton_height) / 2
        rightButton = UIButton.init()
        rightButton.setImage(UIImage.init(named: "rightArrow"), for: .normal)
        rightButton.frame = CGRect.init(x: rightButton_x, y: rightButton_y, width: rightButton_width, height: rightButton_height)
        addSubview(rightButton)
//        Title
        title = UILabel.init()
        title.font = UIFont.init(name: "SF UI Text", size: 15)
        title.text = " "
        title.sizeToFit()
        let title_x = CGFloat(23.0 / 282.0) * self.frame.size.width
        let title_y = (self.frame.size.height - title.frame.size.height ) / 2
        let title_width = (leftButton_x - title_x) * 0.98
        title.frame = CGRect.init(x: title_x, y: title_y, width: title_width, height: title.frame.size.height)
        title.textColor = UIColor.white
        addSubview(title)
//        Content
        content = UILabel.init()
        content.font = UIFont.init(name: "SF UI Text", size: 13)
        content.text = " "
        content.sizeToFit()
        let content_x = leftButton_x + leftButton_width
        let content_y = (self.frame.size.height - content.frame.size.height ) / 2
        let content_width = rightButton_x - content_x
        content.frame = CGRect.init(x: content_x, y: content_y, width: content_width, height: content.frame.size.height)
        content.textColor = UIColor.white
        content.textAlignment = .center
        addSubview(content)
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
