//
//  SliderMPVolumeView.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import MediaPlayer

class SliderMPVolumeView: MPVolumeView {
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.commonInit()
    }
    
    convenience init() {
        self.init(frame: .zero)
    }
    
    func commonInit() {
        self.showsRouteButton = false
        self.showsVolumeSlider = true
        for view in self.subviews {
            if view.isKind(of: UISlider.self) {
                let slider = view as? UISlider
                slider?.minimumTrackTintColor = UIColor(red: 1.0, green: 45.0/255, blue: 85.0/255, alpha: 1.0)
                slider?.maximumTrackTintColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.3)
            }
        }
        
        self.setVolumeThumbImage(UIImage(named: "thumbImage")?.imageWithInsets(insets: UIEdgeInsetsMake(3, 0, 0, 0)) , for: .normal)
    }
    
    override func volumeSliderRect(forBounds bounds: CGRect) -> CGRect {
        return self.bounds
    }
}
