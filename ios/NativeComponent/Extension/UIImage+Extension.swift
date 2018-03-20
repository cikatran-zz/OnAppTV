//
//  UIImage+Extension.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/6/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit

extension UIImage {
  func imageWithInsets(insets: UIEdgeInsets) -> UIImage? {
    UIGraphicsBeginImageContextWithOptions(
      CGSize(width: self.size.width + insets.left + insets.right,
             height: self.size.height + insets.top + insets.bottom), false, self.scale)
    let _ = UIGraphicsGetCurrentContext()
    let origin = CGPoint(x: insets.left, y: insets.top)
    self.draw(at: origin)
    let imageWithInsets = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    return imageWithInsets
  }
}
