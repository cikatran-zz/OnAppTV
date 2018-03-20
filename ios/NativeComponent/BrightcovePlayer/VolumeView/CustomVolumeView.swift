//
//  CustomVolumeView.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit

class CustomVolumeView: UIView {
    
    // MARK: - Outlets
    @IBOutlet weak var volumeSlider: SliderMPVolumeView!
    @IBOutlet weak var quieterIcon: UIImageView!
    @IBOutlet weak var louderIcon: UIImageView!
    @IBOutlet var contentView: UIView!
    
    // MARK: - Constructors
    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    convenience init() {
        self.init(frame: .zero)
    }
    
    func commonInit() {
        Bundle.main.loadNibNamed("CustomVolumeView", owner: self, options: nil)
        self.addSubview(contentView)
        contentView.frame = self.bounds
        contentView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
    }
}
