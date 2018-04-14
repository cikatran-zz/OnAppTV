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
    
    fileprivate var playbackService: BCOVPlaybackService?
    fileprivate var playbackController: BCOVPlaybackController?
    fileprivate var playerView: BCOVPUIPlayerView?
    fileprivate var controlsView: CustomControlsView = CustomControlsView()
    fileprivate var spinnerWebView: WKWebView = WKWebView()
    fileprivate var fastforwardAnimationView: LOTAnimationView = LOTAnimationView(contentsOf: URL(string: "https://www.lottiefiles.com/storage/datafiles/rT1xFybxaeBO4Qf/data.json")! )
    fileprivate var rewindAnimationView: LOTAnimationView = LOTAnimationView(contentsOf: URL(string: "https://www.lottiefiles.com/storage/datafiles/rT1xFybxaeBO4Qf/data.json")! )
    
    fileprivate var filmstrip: [Double: ImageResource] = [Double: ImageResource]()
    
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
    }
    
    public override func removeFromSuperview() {
        self.stop()
        super.removeFromSuperview()
    }
    
    // MARK: - Methods
    
    func setup() {
        
        // Set up playback controller
        playbackController = BCOVPlayerSDKManager.shared().createPlaybackController()
        playbackController?.delegate = controlsView
        playbackController?.isAutoAdvance = true
        playbackController?.isAutoPlay = true
        
        // Set up player view
        playerView = BCOVPUIPlayerView(playbackController: playbackController!, options: nil, controlsView: BCOVPUIBasicControlView.withVODLayout())
        playerView?.frame = self.bounds
        playerView?.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        playerView?.delegate = self
        playerView?.playbackController = playbackController
        playerView?.controlsView.alpha = 0
        
        self.addSubview(playerView!)
        
        self.initControlsView()
        self.initSpinner()
        self.initRippleAnimation()
        self.initTapGestures()
        
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
        
        controlsView.filmStripImage = { second in
            let roundedSecond = second.rounded()
            var image: ImageResource? = self.filmstrip[roundedSecond]
            return image
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
    
    fileprivate func stop() {
        playbackController?.pause()
        playbackController?.setVideos(NSArray())
    }
    
    fileprivate func requestVideo() {
        if let playbackService = self.playbackService, let videoId = self.videoId {
            playbackService.findVideo(withVideoID: videoId, parameters: [:], completion: { (video, jsonResponse, error) in
                if let v = video {
                    if let cuePoints = video?.cuePoints.array() as? [BCOVCuePoint] {
                        self.setUpCuePoints(cuePoints: cuePoints)
                    }
                    self.playbackController?.setVideos([v] as NSArray)
                    self.controlsView.videoDuration = (v.properties["duration"] as? Double ?? 0) / 1000
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
