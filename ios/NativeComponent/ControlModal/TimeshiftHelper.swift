//
//  TimeshiftHelper.swift
//  OnAppTV
//
//  Created by Simon Pham on 7/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import STBAPI

let TIMESHIFT_FILE_NAME = "Timeshift"

func recordTimeshift(lcn: Int32, startTime: Date, duration: Int32) {
    stopRecordTimeshift()
    deleteTimeshiftRecord()

    let recordModel = RecordModel()
    recordModel.recordMode = 1
    recordModel.recordName = TIMESHIFT_FILE_NAME

    recordModel.lCN = lcn
    recordModel.startTime = startTime
    recordModel.duration = duration
    
    print("RECORDING TIMESHIFT")
    Api.shared().hIG_RecordPvrStart(
        withRecordParameter: recordModel,
        metaData: "",
        callback: { (isSuccess, error) in
            printError(isSuccess: isSuccess, error: error)
    })
}

func stopRecordTimeshift() {
    print("STOP RECORDING")
    Api.shared().hIG_RecordPvrStop { (isSuccess, error) in
        printError(isSuccess: isSuccess, error: error)
    }
}

func deleteTimeshiftRecord() {
    print("DELETE EXISTING TIMESHIFT RECORD")
    Api.shared().hIG_DeletePvr(withRecordName: TIMESHIFT_FILE_NAME) { (isSuccess, error) in
        printError(isSuccess: isSuccess, error: error)
    }
}

func playTimeshift(playPosition: Int32) {
    print("PLAYING TIMESHIFT at position: " + String(playPosition))
    Api.shared().hIG_PlayPvrStart(
        withRecordName: TIMESHIFT_FILE_NAME,
        playPosition: playPosition,
        callback: { (isSuccess, error) in
            printError(isSuccess: isSuccess, error: error)
    })
}

func printError(isSuccess: Bool, error: String?) {
    if (!isSuccess) {
        print(error ?? "")
    }
}
