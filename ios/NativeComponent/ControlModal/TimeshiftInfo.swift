//
//  TimeshiftInfo.swift
//  OnAppTV
//
//  Created by Simon Pham on 7/25/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import STBAPI

@objc(TimeshiftInfo)
class TimeshiftInfo: NSObject {
    
    public static let sharedInstance = TimeshiftInfo()
    private let model = RecordModel()
    
    private override init() {
        super.init()
    }
    
    @objc public func getModel() -> RecordModel {
        return model
    }
    
    @objc public func setModel(lcn: Int32, startTime: Date) {
        model.lCN = lcn
        model.startTime = startTime
    }
}
