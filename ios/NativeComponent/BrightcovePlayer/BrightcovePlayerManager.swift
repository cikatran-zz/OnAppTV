//
//  BrightcovePlayerManager.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/3/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

@objc(BrightcovePlayerManager)
class BrightcovePlayerManagager: NSObject {
    
    public static let sharedInstance = BrightcovePlayerManagager()
    
    private var players = [BrightcovePlayer?]()
    
    private override init() {
        super.init()
    }
    
    public func addPlayer(_ player: BrightcovePlayer?) {
        players.forEach{ player in
            player?.stop()
        }
        players.append(player)
    }
    
    public func removePlayer() {
        players.forEach{ player in
            player?.stop()
        }
    }
    
    public func setUpInfo(videoId: String, accountId: String, policyKey: String, metaData: [String: Any], onDone: @escaping ()-> Void) {
        players.forEach{ player in
            player?.videoId = videoId
            player?.accountId = accountId
            player?.policyKey = policyKey
            player?.metaData = metaData
            player?.onDone = onDone
        }
    }
}
