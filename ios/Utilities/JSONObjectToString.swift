//
//  JSONObjectToString.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 4/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

func asJSONString(_ json: [String: Any]) -> String? {
    do {
        let jsonData = try JSONSerialization.data(withJSONObject: json, options: [])
        return String(data: jsonData, encoding: .utf8)
    } catch {
        print(error.localizedDescription)
    }
    return nil
}
