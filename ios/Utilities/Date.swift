//
//  Date.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/9/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

let timeDistance = Date().timeIntervalSince1970 - 1525136400

func getCurrentTime() -> Date {
    return Date()
    //return Date(timeIntervalSince1970: Date().timeIntervalSince1970 - timeDistance)
}
