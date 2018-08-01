//
//  ControlModalData.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import STBAPI

enum PlayState {
    case currentPlaying
    case notPlayed
    case pause
    case disconnect
}

enum IMAGE_TYPE: String {
    case LOGO = "Logo"
    case PORTRAIT = "P"
    case LANDSCAPE = "L"
}

enum IMAGE_SIZE: String {
    case SMALL = "S"
    case MEDIUM = "M"
    case LARGE = "L"
}

protocol ControlModalDataDelegate {
    func progressChanged(controlModalData: ControlModalData)
    func playStateChanged(controlModalData: ControlModalData)
    func playReachEnd(controlModalData: ControlModalData)
}

class ControlModalData {
    
    struct JSONKeys {
        static let thumbnails = "thumbnails"
        static let url = "url"
        static let portrait = "portrait"
        static let logo = "logo"
        static let name = "name"
        static let durationInSeconds = "durationInSeconds"
        static let genresData = "genresData"
        static let title = "title"
        static let startTime = "startTime"
        static let endTime = "endTime"
        static let videoData = "videoData"
        static let channelData = "channelData"
        static let lcn = "lcn"
        static let contentId = "contentId"
    }
    
    // For VOD
    public var imageURL: String = ""
    public var durationInSeconds: Double = 0
    public var title: String = ""
    public var genres: String = ""
    public var videoUrl: String = ""
    
    // For Live
    public var startTime: Date = getCurrentTime() {
        didSet {
            currentProgress = (getCurrentTime().timeIntervalSince1970-startTime.timeIntervalSince1970)/(endTime.timeIntervalSince1970 - startTime.timeIntervalSince1970) + timeshiftOffset
        }
    }
    public var endTime: Date = getCurrentTime() {
        didSet {
            currentProgress = (getCurrentTime().timeIntervalSince1970-startTime.timeIntervalSince1970)/(endTime.timeIntervalSince1970 - startTime.timeIntervalSince1970) + timeshiftOffset
        }
    }
    public var logoImage: String = ""
    public var lcn: Int = 0
    
    // For playing
    public var playState: PlayState = PlayState.notPlayed {
        didSet {
            if (!self.isLive) {
                if (self.playState == .currentPlaying || self.playState == .pause) {
                    NotificationCenter.default.addObserver(self, selector: #selector(self.handleProgressMessage(_:)), name: NSNotification.Name("onapp.controlmodal.VODprogress"), object: nil)
                } else {
                    NotificationCenter.default.removeObserver(self, name: NSNotification.Name("onapp.controlmodal.VODprogress"), object: nil)
                }
                if (self.playState != .currentPlaying) {
                    self.updateDataToServer()
                }
            }
            DispatchQueue.main.async {
                if (oldValue != self.playState) {
                    self.delegate?.playStateChanged(controlModalData: self)
                }
            }
        }
    }
    public var currentProgress: Double = 0 { // 0.0 - 1.0
        didSet {
            DispatchQueue.main.async {
                self.delegate?.progressChanged(controlModalData: self)
            }
            if (!self.isLive) {
                controller?.updateWatchingHistory(["id": self.contentId, "stop_position": currentProgress * self.durationInSeconds])
//                var movieJSON = [String: Any]()
//                movieJSON[UserKitKeys.StopPosition.rawValue] = currentProgress * self.durationInSeconds
//                movieJSON[UserKitKeys.Id.rawValue] = self.contentId as Any
//                let properties: [String: Any] = [ UserKitKeys.ContinueWatching.rawValue: movieJSON as Any]
                //WatchingHistory.sharedInstance.updateWatchingHistory(id: self.contentId, properties: properties, completion: nil, errorBlock: nil)
            }
        }
    }
    public var redBarStartPoint: Double = 0         // 0.0 - 1.0
    public var redBarProgress: Double = 0           // 0.0 - 1.0
    public var timeshiftOffset: Double = 0
    
    public var isLive = false
    public var contentId = ""
    public var uniqueID = UUID().uuidString
    public var playPosition: Double = 0
    
    var delegate: ControlModalDataDelegate? = nil
    weak var controller: ControlModal? = nil
    
    @objc public func handleProgressMessage(_ notification: NSNotification) {
        if let dict = notification.object as? [String: Any], let isSuccess = dict["isSuccess"] as? NSNumber , let currentSeconds = dict["value"] as? NSNumber {
            print("PLAY: New seconds", currentSeconds)
            if (isSuccess.boolValue) {
                self.currentProgress = currentSeconds.doubleValue/self.durationInSeconds
            } else {
                DispatchQueue.main.async {
                    //WatchingHistory.sharedInstance.remove(id: self.contentId, completion: nil, errorBlock: nil)
                    self.delegate?.playReachEnd(controlModalData: self)
                }
            }
        }
    }
    
    public func updateDataToServer() {
        if (!self.isLive) {
            //WatchingHistory.sharedInstance.sync()
        }
    }
    
    public init(json: [String: Any]) {
        
        if let videoData = json[JSONKeys.videoData] as? [String: Any] {
            // LIVE
            isLive = true
            
            self.imageURL = getOnAppTVImage(thumbnails: asJsonObj(videoData[JSONKeys.thumbnails]) , type: IMAGE_TYPE.LANDSCAPE.rawValue, size: IMAGE_SIZE.LARGE.rawValue)
            self.title = (videoData[JSONKeys.title] as? String) ?? ""
            parseGenres(asJsonArr(videoData[JSONKeys.genresData]))
            
            let dateFormatter = DateFormatter()
            dateFormatter.timeZone = TimeZone(abbreviation: "UTC")
            dateFormatter.dateFormat = "YYYY-MM-dd'T'HH:mm:ss.SSS'Z"
            
            if let date = dateFormatter.date(from: json[JSONKeys.startTime] as? String ?? "") {
                startTime = date
            }
            
            if let date = dateFormatter.date(from: json[JSONKeys.endTime] as? String ?? "") {
                endTime = date
            }
            
            currentProgress = (getCurrentTime().timeIntervalSince1970-startTime.timeIntervalSince1970)/(endTime.timeIntervalSince1970 - startTime.timeIntervalSince1970)
            
            let channelData = asJsonObj(json[JSONKeys.channelData])
            self.lcn = channelData[JSONKeys.lcn] as? Int ?? 0
            self.logoImage = getOnAppTVImage(thumbnails: asJsonObj(channelData[JSONKeys.thumbnails]), type: IMAGE_TYPE.LOGO.rawValue, size: IMAGE_SIZE.LARGE.rawValue)
            
            
            NotificationCenter.default.addObserver(self, selector: #selector(updateLiveProgress), name: NSNotification.Name("onapp.controlmodal.progressUpdate"), object: nil)
        } else {
            // VOD
            isLive = false
            self.imageURL = getOnAppTVImage(thumbnails: asJsonObj(json[JSONKeys.thumbnails]), type: IMAGE_TYPE.LANDSCAPE.rawValue, size: IMAGE_SIZE.LARGE.rawValue)
            self.durationInSeconds = (json[JSONKeys.durationInSeconds] as? Double) ?? 0
            self.title = (json[JSONKeys.title] as? String) ?? ""
            parseGenres(asJsonArr(json[JSONKeys.genresData]))
            self.contentId = json[JSONKeys.contentId] as? String ?? ""
        }
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc func updateLiveProgress() {
        self.currentProgress = (getCurrentTime().timeIntervalSince1970-self.startTime.timeIntervalSince1970)/(self.endTime.timeIntervalSince1970 - self.startTime.timeIntervalSince1970) + timeshiftOffset
        self.redBarProgress = (getCurrentTime().timeIntervalSince1970-self.startTime.timeIntervalSince1970)/(self.endTime.timeIntervalSince1970 - self.startTime.timeIntervalSince1970)
    }
    
    
    func getOnAppTVImage(thumbnails: JSONObj, type: String, size: String) -> String {
        let scale = UIScreen.main.scale
        var sizeScale = "1x"
        if (scale < 2.0) {
            sizeScale = "1x"
        } else if(scale < 3.0) {
            sizeScale = "2x"
        } else {
            sizeScale = "3x"
        }
        return (asJsonObj(thumbnails["\(type)_\(size)_\(sizeScale)"])["url"] as? String) ?? ""
    }
    
    func parseGenres(_ jsonArr: JSONArr) {
        
        jsonArr.forEach{ genre in
            if genres != "" {
                genres += ", "
            }
            genres += (asJsonObj(genre)[JSONKeys.name] as? String) ?? ""
        }
    }
    
    func getVideoUrl(callback: @escaping (String)-> Void) {
        if (videoUrl != "") {
            callback(videoUrl)
        } else {
            BrightcoveRequestVideo.shared.getMP4URLOf(contentId: self.contentId) { (sourceUrl) in
                self.videoUrl = sourceUrl ?? ""
                callback(self.videoUrl)
            }
        }
    }
    
}
