//
//  ImageUpload+Extension.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKitIdentity

public extension ImageUpload {
    public func toJson() -> [String: Any] {
        return [
            "url": self.urlString as Any,
            "width": self.width as Any,
            "height": self.height as Any,
            "style": self.style as Any
        ]
    }
}
