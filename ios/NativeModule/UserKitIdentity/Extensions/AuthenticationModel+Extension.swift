//
//  AuthenticationModel+Extension.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKitIdentity

public extension AutheticationModel {
    
    public func toJson() -> [String: Any] {
        return [
            "token": (authToken ?? "") as Any,
            "refresh_token": (refreshToken ?? "") as Any,
            "profiles": (listProfiles ?? []).flatMap{ $0.toJson() } as Any,
            "new": (isNewAccount ?? false) as Any,
            "subscribed": (subscribed ?? false) as Any,
            "affiliate_id": (affiliateID ?? "") as Any,
            "affiliate_name": (affiliateName ?? "") as Any,
            "createdAt": (createdAt ?? "") as Any
        ]
    }
    
    public func toString() -> String? {
        return asJSONString(self.toJson())
    }
}
