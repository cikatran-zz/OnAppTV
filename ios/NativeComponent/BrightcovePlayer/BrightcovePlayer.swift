//
//  BrightcovePlayer.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit
import BrightcovePlayerSDK
import WebKit
import Lottie
import Kingfisher
import UserKit

public class BrightcovePlayer: UIView, BCOVPUIPlayerViewDelegate {
    
    // MARK: - Properties
    public var videoId: String? = nil {
        didSet {
            self.requestVideo()
        }
    }
    public var accountId: String? = nil {
        didSet {
            if let _ = policyKey, let _ = accountId {
                self.playbackService = BCOVPlaybackService(accountId: accountId!, policyKey: policyKey!)
                self.requestVideo()
            }
        }
    }
    public var policyKey: String? = nil {
        didSet {
            if let _ = policyKey, let _ = accountId {
                self.playbackService = BCOVPlaybackService(accountId: accountId!, policyKey: policyKey!)
                self.requestVideo()
            }
        }
    }
    public var metaData: [String: Any]? = nil {
        didSet {
            if let _ = metaData, let item = SpecificRequiredItem.createItemFromMetaData(metadata: metaData!) {
                self.controlsView.playbackRecorder = OnDemandPlaybackEventRecorder(specificRequiredItem: item)
            }
        }
    }
    
    public var onFinished: RCTDirectEventBlock = { event in }
    public var updateConsumedLength: (NSNumber)->Void = { consumed in }
    public var onDone: ()->Void = {}
    
    
    fileprivate var playbackService: BCOVPlaybackService?
    fileprivate var playbackController: BCOVPlaybackController?
    fileprivate var playerView: BCOVPUIPlayerView?
    fileprivate var controlsView: CustomControlsView = CustomControlsView()
    fileprivate var spinnerWebView: WKWebView = WKWebView()
    fileprivate var fastforwardAnimationView: LOTAnimationView = LOTAnimationView(contentsOf: URL(string: "https://www.lottiefiles.com/storage/datafiles/rT1xFybxaeBO4Qf/data.json")! )
    fileprivate var rewindAnimationView: LOTAnimationView = LOTAnimationView(contentsOf: URL(string: "https://www.lottiefiles.com/storage/datafiles/rT1xFybxaeBO4Qf/data.json")! )
    
    fileprivate var filmstrip: [Double: ImageResource] = [Double: ImageResource]()
    public var playPosition: NSNumber = 0
    fileprivate var isStopped: Bool = false
    
    // MARK: - Life cycle
    public override init(frame: CGRect) {
        super.init(frame: frame)
        self.setup()
    }
    
    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.setup()
    }
    
    convenience init() {
        self.init(frame: .zero)
    }
    
    deinit {
        self.stop()
        BrightcovePlayerManagager.sharedInstance.removePlayer()
    }
    
    public override func removeFromSuperview() {
//        self.stop()
//        BrightcovePlayerManagager.sharedInstance.removePlayer()
        super.removeFromSuperview()
    }
    
    // MARK: - Methods
    
    func setup() {
        
        // Set up playback controller
        if !Thread.isMainThread {
            DispatchQueue.main.async {
                self.playbackController = BCOVPlayerSDKManager.shared().createPlaybackController()
                self.playbackController?.delegate = self.controlsView
                self.playbackController?.isAutoAdvance = true
                self.playbackController?.isAutoPlay = false
                
                // Set up player view
                self.playerView = BCOVPUIPlayerView(playbackController: self.playbackController!, options: nil, controlsView: BCOVPUIBasicControlView.withVODLayout())
                self.playerView?.frame = self.bounds
                self.playerView?.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                self.playerView?.delegate = self
                self.playerView?.playbackController = self.playbackController
                self.playerView?.controlsView.alpha = 0
                
                self.addSubview(self.playerView!)
                
                self.initControlsView()
                self.initSpinner()
                self.initRippleAnimation()
                self.initTapGestures()
            }
        } else {
            self.playbackController = BCOVPlayerSDKManager.shared().createPlaybackController()
            self.playbackController?.delegate = self.controlsView
            self.playbackController?.isAutoAdvance = true
            self.playbackController?.isAutoPlay = true
            
            // Set up player view
            self.playerView = BCOVPUIPlayerView(playbackController: self.playbackController!, options: nil, controlsView: BCOVPUIBasicControlView.withVODLayout())
            self.playerView?.frame = self.bounds
            self.playerView?.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            self.playerView?.delegate = self
            self.playerView?.playbackController = self.playbackController
            self.playerView?.controlsView.alpha = 0
            
            self.addSubview(self.playerView!)
            
            self.initControlsView()
            self.initSpinner()
            self.initRippleAnimation()
            self.initTapGestures()
        }
        
        weak var weakSelf = self
        BrightcovePlayerManagager.sharedInstance.addPlayer(weakSelf)
        
        
        // Set up control blocks
        controlsView.pauseBlock = {
            self.playbackController?.pause()
        }
        
        controlsView.playBlock = {
            self.playbackController?.play()
        }
        
        controlsView.openCaptionBlock = {
            self.playerView?.controlsView.closedCaptionButton.sendActions(for: .touchUpInside)
        }
        
        controlsView.seekingBlock = { seekTime in
            self.playbackController?.seek(to: CMTimeMakeWithSeconds(seekTime, 1), completionHandler: { _ in })
        }
        
        controlsView.bufferingBlock = { buffering in
            self.spinnerWebView.isHidden = !buffering
        }
        
        controlsView.fastforwardAnimationBlock = {
            self.playAnimationInRect(animationView: self.fastforwardAnimationView, region: CGRect(x: self.playerView!.controlsContainerView.frame.width - 400, y: -500, width: self.playerView!.controlsContainerView.frame.height + 600, height: self.playerView!.controlsContainerView.frame.height + 1000))
        }
        
        controlsView.continueWatchingBlock = {
            self.continueWatching()
        }
        
        controlsView.filmStripImage = { second in
            let roundedSecond = second.rounded()
            let image: ImageResource? = self.filmstrip[roundedSecond]
            return image
        }
        
        controlsView.stopBlock = {
            self.isStopped = true
            self.onFinished([:])
            self.onDone()
        }
        
        controlsView.rewindAnimationBlock = {
            self.playAnimationInRect(animationView: self.rewindAnimationView, region: CGRect(x: -self.playerView!.controlsContainerView.frame.height - 200, y: -500, width: self.playerView!.controlsContainerView.frame.height + 600, height: self.playerView!.controlsContainerView.frame.height + 1000) )
        }
        
        
    }
}

// MARK: - Lottie animation
extension BrightcovePlayer {
    
    fileprivate func initRippleAnimation() {
        
        fastforwardAnimationView.translatesAutoresizingMaskIntoConstraints = true
        fastforwardAnimationView.animationSpeed = 2.0
        playerView?.controlsContainerView.addSubview(fastforwardAnimationView)
        
        rewindAnimationView.translatesAutoresizingMaskIntoConstraints = true
        rewindAnimationView.animationSpeed = 2.0
        playerView?.controlsContainerView.addSubview(rewindAnimationView)
    }
    
    fileprivate func playAnimationInRect(animationView: LOTAnimationView, region: CGRect) {
        animationView.stop()
        animationView.alpha = 0.5
        animationView.frame = region
        animationView.play { (isFinished) in
            UIView.animate(withDuration: 0.2, animations: {
                animationView.alpha = 0
            }, completion: { (finished) in
                animationView.frame = .zero
            })
        }
    }
}

// MARK: - Gestures
extension BrightcovePlayer {
    
    fileprivate func initTapGestures() {
        
        let singleTapGesture = UITapGestureRecognizer(target: self, action: #selector(self.handleTapGesture(_:)))
        singleTapGesture.numberOfTapsRequired = 1
        let doubleTapGesture = UITapGestureRecognizer(target: self, action: #selector(self.handleDoubleGesture(_:)))
        doubleTapGesture.numberOfTapsRequired = 2
        singleTapGesture.require(toFail: doubleTapGesture)
        
        playerView?.controlsContainerView.addGestureRecognizer(singleTapGesture)
        playerView?.controlsContainerView.addGestureRecognizer(doubleTapGesture)
    }
    
    @objc
    fileprivate func handleTapGesture(_ sender: UITapGestureRecognizer) {
        if sender.state == .recognized {
            controlsView.singleTap(at: sender.location(in: controlsView))
        }
    }
    
    @objc
    fileprivate func handleDoubleGesture(_ sender: UITapGestureRecognizer) {
        if sender.state == .recognized {
            controlsView.doubleTap(at: sender.location(in: controlsView))
        }
    }
}

// MARK: - Video manager
extension BrightcovePlayer {
    
    fileprivate func continueWatching() {
        
        self.playbackController?.pause()
        self.playbackController?.seek(to: CMTimeMakeWithSeconds(self.playPosition.doubleValue, 1) , completionHandler: { isCompleted in
            self.playbackController?.play()
        })
    }
    
    /// Store current video info to UserKit props for continue watching
    ///
    /// - Parameters:
    ///   - videoLength: video length in seconds
    ///   - currentSeconds: current playhead position in seconds
    private func storeVideoToUserKit() {
        
        //if controlsView.videoDuration - controlsView.currentTime >= 20 {
            var movieJSON = [String: Any]()
            movieJSON[UserKitKeys.StopPosition.rawValue] = controlsView.currentTime as Any
            movieJSON[UserKitKeys.Id.rawValue] = self.videoId as Any
            let properties: [String: Any] = [ UserKitKeys.ContinueWatching.rawValue: movieJSON as Any]
        updateConsumedLength(NSNumber(value: controlsView.currentTime))
            //WatchingHistory.sharedInstance.updateWatchingHistory(id: self.videoId ?? "", properties: properties, completion: nil, errorBlock: nil)
//        } else {
//            WatchingHistory.sharedInstance.remove(id: self.videoId ?? "", completion: nil, errorBlock: nil)
//        }
    }
    
    public func stop() {
        playbackController?.pause()
        playbackController?.setVideos(NSArray())
        controlsView.stop()
        self.onDone()
        self.isStopped = true
        storeVideoToUserKit()
    }
    
    fileprivate func requestVideo() {
        if let playbackService = self.playbackService, let videoId = self.videoId {
            playbackService.findVideo(withVideoID: videoId, parameters: [:], completion: { (video, jsonResponse, error) in
//                if (self.isStopped) {
//                    return
//                }
                if let v = video {
                    if let cuePoints = video?.cuePoints.array() as? [BCOVCuePoint] {
                        self.setUpCuePoints(cuePoints: cuePoints)
                    }
                    self.playbackController?.setVideos([v] as NSArray)
                    self.controlsView.videoDuration = (v.properties["duration"] as? Double ?? 0) / 1000
//                    WatchingHistory.sharedInstance.getConsumedLength(id: videoId, completion: { (consumedLength) in
//                        if (self.lastPosition == 0) {
//                            self.lastPosition = consumedLength
//                        }
                        self.continueWatching()
//                    })
                } else {
                    print("Error retrieving video: \(error?.localizedDescription ?? "unknown error")")
                }
            })
        }
    }
}

// MARK: - Video filmstrip
extension BrightcovePlayer {
    
    fileprivate func setUpCuePoints(cuePoints: [BCOVCuePoint]) {
        
        // Get url and cache images
        for cuePoint in cuePoints {
            if let urlString = cuePoint.properties["metadata"] as? String, let url = URL(string: urlString) {
                filmstrip[cuePoint.position.seconds] = ImageResource(downloadURL: url)
            }
        }
    }
}

// MARK: - Set up UI
extension BrightcovePlayer: WKUIDelegate {
    
    fileprivate func initSpinner() {
        
        spinnerWebView.load(URLRequest(url: URL(fileURLWithPath: Bundle.main.path(forResource: "spinner", ofType: "html")!) ) )
        spinnerWebView.translatesAutoresizingMaskIntoConstraints = false
        spinnerWebView.backgroundColor = .clear
        spinnerWebView.isOpaque = false
        spinnerWebView.scrollView.backgroundColor = .clear
        spinnerWebView.isUserInteractionEnabled = false
        playerView?.controlsContainerView.addSubview(spinnerWebView)
        playerView?.controlsContainerView.addConstraint(NSLayoutConstraint(item: spinnerWebView,
                                                                           attribute: .centerX,
                                                                           relatedBy: .equal,
                                                                           toItem: playerView!.controlsContainerView,
                                                                           attribute: .centerX,
                                                                           multiplier: 1.0,
                                                                           constant: 0) )
        playerView?.controlsContainerView.addConstraint(NSLayoutConstraint(item: spinnerWebView,
                                                                           attribute: .centerY,
                                                                           relatedBy: .equal,
                                                                           toItem: playerView!.controlsContainerView,
                                                                           attribute: .centerY,
                                                                           multiplier: 1.0,
                                                                           constant: 0) )
        spinnerWebView.addConstraint(NSLayoutConstraint(item: spinnerWebView,
                                                        attribute: .width,
                                                        relatedBy: .equal,
                                                        toItem: nil,
                                                        attribute: .notAnAttribute,
                                                        multiplier: 1.0,
                                                        constant: 300) )
        spinnerWebView.addConstraint(NSLayoutConstraint(item: spinnerWebView,
                                                        attribute: .height,
                                                        relatedBy: .equal,
                                                        toItem: nil,
                                                        attribute: .notAnAttribute,
                                                        multiplier: 1.0,
                                                        constant: 100) )
    }
    
    fileprivate func initControlsView() {
        
        controlsView.translatesAutoresizingMaskIntoConstraints = false
        playerView?.controlsContainerView.addSubview(controlsView)
        playerView?.controlsContainerView.addConstraint(NSLayoutConstraint(item: controlsView,
                                                                           attribute: .leading,
                                                                           relatedBy: .equal,
                                                                           toItem: playerView!.controlsContainerView,
                                                                           attribute: .leading,
                                                                           multiplier: 1.0,
                                                                           constant: 0) )
        playerView?.controlsContainerView.addConstraint(NSLayoutConstraint(item: controlsView,
                                                                           attribute: .bottom,
                                                                           relatedBy: .equal,
                                                                           toItem: playerView!.controlsContainerView,
                                                                           attribute: .bottom,
                                                                           multiplier: 1.0,
                                                                           constant: 0) )
        playerView?.controlsContainerView.addConstraint(NSLayoutConstraint(item: controlsView,
                                                                           attribute: .top,
                                                                           relatedBy: .equal,
                                                                           toItem: playerView!.controlsContainerView,
                                                                           attribute: .top,
                                                                           multiplier: 1.0,
                                                                           constant: 0) )
        playerView?.controlsContainerView.addConstraint(NSLayoutConstraint(item: controlsView,
                                                                           attribute: .trailing,
                                                                           relatedBy: .equal,
                                                                           toItem: playerView!.controlsContainerView,
                                                                           attribute: .trailing,
                                                                           multiplier: 1.0,
                                                                           constant: 0) )
    }
}


