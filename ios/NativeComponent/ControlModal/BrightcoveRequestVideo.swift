//
//  BrightcoveRequestVideo.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import BrightcovePlayerSDK

class BrightcoveRequestVideo {
    public static let shared = BrightcoveRequestVideo()
    let playbackService = BCOVPlaybackService(accountId: "5706818955001", policyKey: "BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I")
    
    private init() {
        
    }
    
    func getMP4URLOf(contentId: String, completion: @escaping (String?)->Void) {
        self.playbackService?.findVideo(withVideoID: contentId, parameters: [:], completion: { (video, jsonResponse, error) in
            if let v = video {
                var result: String? = nil
                var width = 0.0
                var height = 0.0
                v.sources.forEach{ any in
                    if let source = any as? BCOVSource {
                        if (source.deliveryMethod == "video/mp4") {
                            let sourceW = source.properties["width"] as? Double ?? 0
                            let sourceH = source.properties["height"] as? Double ?? 0
                            if (sourceW * sourceH > width * height) {
                                width = sourceW
                                height = sourceH
                                result = source.url.absoluteString
                            }
                        }
                    }
                }
                completion(result)
            } else {
                completion(nil)
            }
        })
    }
}
