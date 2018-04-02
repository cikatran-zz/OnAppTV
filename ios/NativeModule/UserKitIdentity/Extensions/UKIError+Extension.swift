//
//  UKIError+Extension.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKitIdentity

public extension UKIError {
    public func toJson() -> [String: Any] {
        return [
            "message": message as Any,
            "http_code": httpCode as Any,
            "error_code": errorCode as Any
        ]
    }
}
