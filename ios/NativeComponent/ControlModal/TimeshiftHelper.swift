//
//  TimeshiftHelper.swift
//  OnAppTV
//
//  Created by Simon Pham on 7/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import STBAPI

let TIMESHIFT_FILE_NAME = "timeshift"

func recordTimeshift(model: RecordModel, callback:@escaping (Bool)-> Void) {
    Api.shared().hIG_RecordPvrStop { (stopSuccess, stopError) in
        Api.shared().hIG_DeletePvr(withRecordName: TIMESHIFT_FILE_NAME, callback: { (deleteSuccess, deleteError) in
            Api.shared()?.hIG_GetUSBDisks({ (usbDiskArray) in
                if usbDiskArray?.count != 0 {
                    let disk = usbDiskArray?.lastObject as! DiskModel;
                    let partiton = disk.partitionArr.lastObject as! PartitonModel;
                    Api.shared().hIG_SetPvrPath(withPartition: partiton, callback: { (setPathSuccess, setPathError) in
                        if setPathSuccess == true {
                            let recordMetaData = "\(model.lCN),\(model.startTime)"
                            Api.shared().hIG_RecordPvrStart(withRecordParameter: model, metaData: recordMetaData, callback: { (recordSuccess, recordError) in
                                callback(recordSuccess)
                            })
                        }
                    })
                }
            })
        })
    }
}

func stopRecordTimeshift(callback:@escaping (Bool)-> Void) {
    print("STOP RECORDING")
    Api.shared().hIG_RecordPvrStop { (isSuccess, error) in
        callback(isSuccess)
    }
}

func deleteTimeshiftRecord() {
    print("DELETE EXISTING TIMESHIFT RECORD")
    Api.shared().hIG_DeletePvr(withRecordName: TIMESHIFT_FILE_NAME) { (isSuccess, error) in
        // nothing to do
    }
}

func playTimeshift(playPosition: Int32, callback:@escaping (Bool)-> Void) {
    print("PLAYING TIMESHIFT at position: " + String(playPosition))
    Api.shared().hIG_PlayPvrStart(
        withRecordName: TIMESHIFT_FILE_NAME,
        playPosition: playPosition,
        callback: { (isSuccess, error) in
            callback(isSuccess)
    })
}

func cleanTimeshift() {
    let timeshiftInfo = TimeshiftInfo.sharedInstance
    stopRecordTimeshift(callback: { (stopSuccess) in
        deleteTimeshiftRecord()
        timeshiftInfo.clear()
    })
}
