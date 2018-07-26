//
//  TimeshiftInfo.swift
//  OnAppTV
//
//  Created by Simon Pham on 7/25/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import STBAPI

class TimeshiftInfo {
    
    public static let sharedInstance = TimeshiftInfo()
    public var redBarCheckPoint: Double?
    public var isPvrPlayed: Bool = false
    private let model = RecordModel()
    
    private init() {
        model.duration = 0
        model.recordMode = 0
        model.recordName = TIMESHIFT_FILE_NAME
        clear()
    }
    
    public func getModel() -> RecordModel {
        return model
    }
    
    public func setModel(lcn: Int32, startTime: Date) {
        model.lCN = lcn
        model.startTime = startTime
    }
    
    public func setChannel(lcn: Int32) {
        model.lCN = lcn
    }
    
    public func clear() {
        model.lCN = -1
        model.startTime = nil
    }
}
