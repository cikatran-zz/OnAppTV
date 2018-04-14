//
//  CustomControlsView.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit
import BrightcovePlayerSDK
import Kingfisher

class CustomControlsView: UIView {
    // MARK: - Outlets
    @IBOutlet var contentView: UIView!
    @IBOutlet weak var progressView: UIView!
    @IBOutlet weak var progressWidth: NSLayoutConstraint!
    @IBOutlet weak var currentTimeLabel: UILabel!
    @IBOutlet weak var playbackButton: UIButton!
    @IBOutlet weak var etrTimeLabel: UILabel!
    @IBOutlet weak var captionButton: UIButton!
    @IBOutlet weak var startOverButton: UIButton!
    
    // MARK: - Properties
    public var currentTime: TimeInterval = 0
    public var videoDuration: TimeInterval = 0
    var isDragging: Bool = false
    var isPlaying: Bool = false
    var isFadedIn: Bool = true
    var isPlayingBeforePan: Bool = true
    var lastTimeInteraction: TimeInterval = Date().timeIntervalSince1970
    
    // MARK: - Blocks
    public var pauseBlock: () -> Void = {}
    public var playBlock: () -> Void = {}
    public var openCaptionBlock: () -> Void = {}
    public var seekingBlock: (_ seekTime: TimeInterval) -> Void = { seekTime in }
    public var bufferingBlock: (_ buffering: Bool) -> Void = { buffering in }
    public var fastforwardAnimationBlock: ()-> Void = {}
    public var rewindAnimationBlock: () -> Void = {}
    public var filmStripImage: ((_ second: Double) -> ImageResource?)?
    
    // MARK: - Constructors
    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    convenience init() {
        self.init(frame: .zero)
    }
    
    func commonInit() {
        Bundle.main.loadNibNamed("CustomControlsView", owner: self, options: nil)
        self.addSubview(contentView)
        contentView.frame = self.bounds
        contentView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        autoHideControls()
        initPanGesture()
    }
    
    fileprivate func setLabelTime(_ time: TimeInterval) {
        let formatter = DateComponentsFormatter()
        if videoDuration > 3600 {
            formatter.allowedUnits = [.hour, .minute, .second]
        } else {
            formatter.allowedUnits = [.minute, .second]
        }
        formatter.zeroFormattingBehavior = .pad
        currentTimeLabel.text = formatter.string(from: time)
        etrTimeLabel.text = "-\(formatter.string(from: videoDuration - time) ?? "")"
    }
    
    
}

// MARK: - Show/ hide controls, animations
extension CustomControlsView {
    
    public func interact() {
        self.lastTimeInteraction = Date().timeIntervalSince1970
    }
    
    fileprivate func autoHideControls() {
        DispatchQueue.global(qos: DispatchQoS.default.qosClass).async {
            while true {
                Thread.sleep(forTimeInterval: 1.0)
                if Date().timeIntervalSince1970 - self.lastTimeInteraction > 2.0 && self.isFadedIn {
                    DispatchQueue.main.async {
                        self.hideControls()
                    }
                }
            }
        }
    }
    
    func hideControls() {
        if (self.isFadedIn) {
            UIView.animate(withDuration: 0.5, delay: 0.0, options: .curveEaseOut, animations: {
                self.alpha = 0.0
            }, completion: nil)
        }
        self.isFadedIn = false
    }
    
    func showControls() {
        if (!self.isFadedIn) {
            UIView.animate(withDuration: 0.5, delay: 0.0, options: .curveEaseOut, animations: {
                self.alpha = 1.0
            }, completion: nil)
        }
        self.isFadedIn = true
    }
}

// MARK: - Gestures
extension CustomControlsView {
    
    fileprivate func initPanGesture() {
        let panGesture = UIPanGestureRecognizer(target: self, action: #selector(self.handlePanGesture(_:)))
        self.addGestureRecognizer(panGesture)
    }
    
    func handlePanGesture(_ sender: UIPanGestureRecognizer) {
        
        if !isFadedIn {
            return
        }
        
        if sender.state == .began {
            pauseBlock()
            let tapLocation = sender.location(in: self)
            let playheadRegion = CGRect(x: 0, y: progressView.frame.minY + progressView.frame.size.height / 4 - 20, width: self.frame.width, height: progressView.frame.size.height / 2 + 40)
            if  playheadRegion.contains(tapLocation) {
                isDragging = true
                isPlayingBeforePan = isPlaying
            }
        }
        
        if isDragging {
            let tapLocation = sender.location(in: self)
            
            if tapLocation.x >= 0 && tapLocation.x <= self.frame.width {
                let translation = sender.translation(in: self)
                progressWidth.constant = progressWidth.constant + translation.x
                let seekingTime = videoDuration * Double(progressWidth.constant / self.frame.width)
                setLabelTime(seekingTime)
                if (sender.state == .ended) {
                    seekingBlock(seekingTime)
                }
                sender.setTranslation(.zero, in: self)
            } else {
                sender.setValue(UIGestureRecognizerState.ended, forKey: "state")
            }
            interact()
        }
        
        if sender.state == .ended {
            if isPlayingBeforePan {
                playBlock()
            }
            isDragging = false
        }
    }
    
    public func singleTap(at location: CGPoint) {
        if isFadedIn && self.isInProgressRegion(tapLocation: location) {
            let progress: Double = Double(location.x / self.frame.width)
            seekingBlock(videoDuration * progress)
        } else {
            interact()
            if isFadedIn {
                hideControls()
            } else {
                showControls()
            }
        }
    }
    
    public func doubleTap(at location: CGPoint) {
        if (isFastforwardRegion(tapLocation: location)) {
            fastforwardAnimationBlock()
            seekingBlock(currentTime + 10 > videoDuration ? videoDuration : currentTime + 10)
        } else if (isRewindRegion(tapLocation: location)) {
            rewindAnimationBlock()
            seekingBlock(currentTime - 10)
        }
    }
    
    func isInProgressRegion(tapLocation: CGPoint) -> Bool {
        let progressRect = CGRect(x: 0, y: progressView.frame.height * 0.25, width: self.frame.width, height: progressView.frame.height * 0.5)
        return progressRect.contains(tapLocation)
    }
    
    func isFastforwardRegion(tapLocation: CGPoint) -> Bool {
        let fastforwardRect = CGRect(x: self.frame.width * 0.75, y: self.frame.height * 0.25, width: self.frame.width * 0.25, height: self.frame.height * 0.5)
        return fastforwardRect.contains(tapLocation)
    }
    
    func isRewindRegion(tapLocation: CGPoint) -> Bool {
        let rewindRect = CGRect(x: 0, y: self.frame.height * 0.25, width: self.frame.width * 0.25, height: self.frame.height * 0.5)
        return rewindRect.contains(tapLocation)
    }
}

// MARK: - Actions
extension CustomControlsView {
    
    @IBAction func playButtonTapped(_ sender: UIButton) {
        if (isPlaying) {
            pauseBlock()
        } else {
            playBlock()
        }
    }
    
    @IBAction func captionButtonTapped(_ sender: UIButton) {
        openCaptionBlock()
    }
    
    @IBAction func startOverButtonTapped(_ sender: UIButton) {
        seekingBlock(0)
    }
}

// MARK: - Delegation
extension CustomControlsView: BCOVPlaybackControllerDelegate {
    
    func playbackController(_ controller: BCOVPlaybackController!, playbackSession session: BCOVPlaybackSession!, didProgressTo progress: TimeInterval) {
        currentTime = (progress != Double.infinity && progress != -Double.infinity) ? progress : currentTime
        if !isDragging {
            progressWidth.constant = CGFloat(Double(self.frame.size.width) * (currentTime / (videoDuration != 0 ? videoDuration : 1)))
            setLabelTime(currentTime)
        }
    }
    
    func playbackController(_ controller: BCOVPlaybackController!, playbackSession session: BCOVPlaybackSession!, didReceive lifecycleEvent: BCOVPlaybackSessionLifecycleEvent!) {
        if lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlay {
            isPlaying = true
            playbackButton.setImage(UIImage(named: "pause") , for: .normal)
        }
        
        if lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPause {
            isPlaying = false
            playbackButton.setImage(UIImage(named: "play") , for: .normal)
        }
        
        if lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackBufferEmpty {
            bufferingBlock(true)
        }
        
        if lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackLikelyToKeepUp {
            bufferingBlock(false)
        }
        
        if lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventFail {
            bufferingBlock(false)
        }
        
        if lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventTerminate {
            bufferingBlock(false)
        }
    }
}
