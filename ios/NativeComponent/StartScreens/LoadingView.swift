//
//  LoadingView.swift
//  STB
//
//  Created by willa on 2018/4/25.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit
import Foundation

class LoadingView: UIView{
    
    var indicatorColor: UIColor!
    var size: CGSize!
    var animation: CABasicAnimation!
    var replicatorLayer: CAReplicatorLayer!
    var doLayer: CALayer!
    init(frame: CGRect, tintColor: UIColor) {
        super.init(frame: frame)
        size = frame.size
        indicatorColor = tintColor
        self.backgroundColor = UIColor.clear
        drawCircles(view: self)
    }
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        let views = UIView.init(frame: CGRect.init(x: 0, y: 0, width: 60, height: 60))
        size = views.frame.size
        indicatorColor = UIColor.init(red: 98/255.0, green: 94/255.0, blue: 94/255.0, alpha: 1)
        views.backgroundColor = UIColor.clear
        self.addSubview(views)
        drawCircles(view: views)
    }
    
    func drawCircles(view: UIView) {
        let circlePadding = CGFloat(5.0)
        let circleSize = (size.width - 2 * circlePadding) / 3
        replicatorLayer = CAReplicatorLayer.init(layer: view.layer)
        replicatorLayer.bounds = CGRect.init(x: 0, y: 0, width: size.width, height:size.height)
        replicatorLayer.position = CGPoint.init(x: size.width / 2, y: size.height / 2)
        view.layer.addSublayer(replicatorLayer)
    
        doLayer = CALayer()
        doLayer.bounds = CGRect.init(x: 0, y: 0, width: circleSize, height: circleSize)
        doLayer.position = CGPoint.init(x: circleSize / 2 , y:size.height / 2 )
        doLayer.backgroundColor = indicatorColor.cgColor
        doLayer.cornerRadius = circleSize / 2
        doLayer.transform = CATransform3DMakeScale(0, 0, 0)
        replicatorLayer.addSublayer(doLayer)
        
        replicatorLayer.instanceCount = 3;
        replicatorLayer.instanceTransform = CATransform3DMakeTranslation(circleSize + circlePadding, 0, 0)
        replicatorLayer.instanceDelay = 1.0/3
        
        animation = CABasicAnimation.init(keyPath: "transform.scale")
        animation.duration = 1.0
        animation.fromValue = 1.0
        animation.toValue = 0
        animation.autoreverses = true
        animation.isRemovedOnCompletion = false
        animation.fillMode = kCAFillModeForwards
        animation.repeatCount = MAXFLOAT
        animation.timingFunction = CAMediaTimingFunction.init(name: kCAMediaTimingFunctionDefault)
    }
    
    func startAnimating() {
        if doLayer != nil {
            doLayer.removeAllAnimations()
            doLayer.add(animation, forKey: "scale")
        }
    }
    
    func stopAnimating() {
        if doLayer != nil {
            doLayer.removeAllAnimations()
        }
    }
}

