//
//  ControlModalData.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import STBAPI
let controlModalQueue = DispatchQueue(label: "com.onapptv.controlModal", attributes: .concurrent)

enum PlayState {
    case currentPlaying
    case notPlayed
    case pause
    case disconnect
}

protocol ControlModalDataDelegate {
    func progressChanged(controlModalData: ControlModalData)
    func playStateChanged(controlModalData: ControlModalData)
}

class ControlModalData {
    
    struct JSONKeys {
        static let originalImages = "originalImages"
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
            currentProgress = (getCurrentTime().timeIntervalSince1970-startTime.timeIntervalSince1970)/(endTime.timeIntervalSince1970 - startTime.timeIntervalSince1970)
        }
    }
    public var endTime: Date = getCurrentTime() {
        didSet {
            currentProgress = (getCurrentTime().timeIntervalSince1970-startTime.timeIntervalSince1970)/(endTime.timeIntervalSince1970 - startTime.timeIntervalSince1970)
        }
    }
    public var logoImage: String = ""
    public var lcn: Int = 0
    
    // For playing
    public var playState: PlayState = PlayState.notPlayed {
        didSet {
            if (!self.isLive) {
                controlModalQueue.async {
                    while true {
                        Thread.sleep(forTimeInterval: 1.0)
                        if (self.playState == .currentPlaying) {
                            Api.shared().hIG_PlayMediaGetPosition({ (isSuccess, currentSeconds) in
                                if (isSuccess) {
                                    self.currentProgress = Double(currentSeconds)/self.durationInSeconds
                                }
                            })
                        } else {
                            break
                        }
                    }
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
            
        }
    }
    public var redBarStartPoint: Double = 0         // 0.0 - 1.0
    public var redBarEndPoint: Double = 0           // 0.0 - 1.0
    
    public var isLive = false
    
    var delegate: ControlModalDataDelegate? = nil
    
    public init(json: [String: Any]) {
        
        if let videoData = json[JSONKeys.videoData] as? [String: Any] {
            // LIVE
            isLive = true
            
            self.imageURL = getImageFromArr(name: JSONKeys.portrait, arr: asJsonArr(videoData[JSONKeys.originalImages]))
            self.title = (videoData[JSONKeys.title] as? String) ?? ""
            parseGenres(asJsonArr(videoData[JSONKeys.genresData]))
            
            let dateFormatter = DateFormatter()
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
            self.logoImage = getImageFromArr(name: JSONKeys.logo, arr: asJsonArr(channelData[JSONKeys.originalImages]))
            
            controlModalQueue.async {
                while true {
                    Thread.sleep(forTimeInterval: 60.0)
                    self.currentProgress = (getCurrentTime().timeIntervalSince1970-self.startTime.timeIntervalSince1970)/(self.endTime.timeIntervalSince1970 - self.startTime.timeIntervalSince1970)
                }
            }
        } else {
            // VOD
            isLive = false
            self.imageURL = getImageFromArr(name: JSONKeys.portrait, arr: asJsonArr(json[JSONKeys.originalImages]))
            self.durationInSeconds = (json[JSONKeys.durationInSeconds] as? Double) ?? 0
            self.title = (json[JSONKeys.title] as? String) ?? ""
            parseGenres(asJsonArr(json[JSONKeys.genresData]))
            let contentId = json[JSONKeys.contentId] as? String ?? ""
            BrightcoveRequestVideo.shared.getMP4URLOf(contentId: contentId) { (sourceUrl) in
                self.videoUrl = sourceUrl ?? ""
            }
        }
        
        
    }
    
    func getImageFromArr(name: String, arr: JSONArr) -> String {
        
        for i in 0..<arr.count {
            let image = arr[i]
            if let name = asJsonObj(image)[JSONKeys.name] as? String, name == name {
                return (asJsonObj(image)[JSONKeys.url] as? String) ?? ""
            }
        }
        return (asJsonObj(arr.first)[JSONKeys.url] as? String) ?? ""
    }
    
    func parseGenres(_ jsonArr: JSONArr) {
        
        jsonArr.forEach{ genre in
            if genres != "" {
                genres += ", "
            }
            genres += (asJsonObj(genre)[JSONKeys.name] as? String) ?? ""
        }
    }
    
}
