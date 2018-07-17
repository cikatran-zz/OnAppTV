//
//  PageControl.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 7/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
let dotSize = CGFloat(15.67)
let magrin = CGFloat(5.43)

class PageControl: UIPageControl {
    
    override func layoutSubviews() {
        super.layoutSubviews()
        let marginX = dotSize + magrin;
        let newW = CGFloat(subviews.count - 1) * marginX + dotSize
        frame = CGRect(x: (kScreenWidth - newW) / 2, y: frame.origin.y, width: newW, height: frame.size.height)
        for i in 0..<subviews.count {
            let dot = subviews[i]
            if i == currentPage {
                dot.frame = CGRect(x: CGFloat(i) * marginX, y: (frame.size.height - dotSize) / 2, width: dotSize, height: dotSize)
            }
            else {
                dot.frame = CGRect(x: CGFloat(i) * marginX, y: (frame.size.height - dotSize) / 2, width: dotSize, height: dotSize)
            }
            dot.layer.cornerRadius = dotSize / 2
        }
    }
}
