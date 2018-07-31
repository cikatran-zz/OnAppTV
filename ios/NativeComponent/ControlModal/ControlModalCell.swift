//
//  ControlModalCell.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/7/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import Kingfisher
import STBAPI

class ControlModalCell: UICollectionViewCell {
    
    @IBOutlet var cellContentView: UIView!
    @IBOutlet weak var volumeView: UIView!
    @IBOutlet weak var gestureView: UIView!
    @IBOutlet weak var volumeSlider: UISlider!
    @IBOutlet weak var progressView: UIView!
    @IBOutlet weak var progressWidth: NSLayoutConstraint!
    @IBOutlet weak var playbackButton: UIButton!
    @IBOutlet var onTVButtonView: UIView!
    
    @IBOutlet weak var blurImage: UIImageView!
    @IBOutlet weak var progressImage: UIImageView!
    @IBOutlet weak var channelImage: UIImageView!
    @IBOutlet weak var startTimeLabel: UILabel!
    @IBOutlet weak var endTimeLabel: UILabel!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var genresLabel: UILabel!
    @IBOutlet weak var orientationButton: UIButton!
    @IBOutlet weak var redBar: UIView!
    @IBOutlet weak var playOverButton: UIButton!
    @IBOutlet weak var rewindButton: UIButton!
    @IBOutlet weak var fastforwardButton: UIButton!
    @IBOutlet weak var onTVLabel: UILabel!
    @IBOutlet weak var bookmarkButton: UIButton!
    @IBOutlet weak var captionButton: UIButton!
    
    // Contraints need to set
    @IBOutlet weak var dismissButtonTop: NSLayoutConstraint!
    @IBOutlet weak var infoButtonBottom: NSLayoutConstraint!
    
    @IBOutlet weak var redBarWidth: NSLayoutConstraint!
    @IBOutlet weak var redBarLeading: NSLayoutConstraint!
    
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
    
    public var onClosePress = {}
    public var onDetailPress = {}
    public var onVolumeChanged: ((Float)->Void)? = nil
    public var onPlayMedia: (()->Void)? = nil
    public var onAlert: ((String)->Void)? = nil
    public var onShare: (()->Void)? = nil
    public var onBookmark: (()->Void)? = nil
    public var onFavorite: (()->Void)? = nil
    public var playNext: (()->Void)? = nil
    public var onProgress: ((Double)->Void)? = nil
    weak var data: ControlModalData?
    var onTVLabelColor: UIColor = .white
    var onTVDarkerLabelColor: UIColor = .darkGray
    
    var needUpdateAll = true
    var isDragging = false
    
    public var isSTBConnected: Bool = true {
        didSet {
            updateSTBConnectedState()
        }
    }
    
    public func configWithData(_ data: ControlModalData) {
        
        self.data = data
        if let imageURL = URL(string: data.imageURL) {
            blurImage.kf.setImage(with: imageURL, placeholder: UIImage(named: "logo") )
            progressImage.kf.setImage(with: imageURL, placeholder: UIImage(named: "logo") )
            //blurImage.kf.setImage(with: imageURL)
            //progressImage.kf.setImage(with: imageURL)
        }
        
        titleLabel.text = data.title
        genresLabel.text = data.genres
        
        if let logoUrl = URL(string: data.logoImage) {
            channelImage.kf.setImage(with: logoUrl, placeholder: UIImage(named: "logo"))
        } else {
            channelImage.kf.setImage(with: nil)
        }
        
        self.data?.delegate = self
        self.progressChanged(controlModalData: data)
        needUpdateAll = false
        self.playStateChanged(controlModalData: data)
        needUpdateAll = true
        showHideComponents()
    }
    
    func commonInit() {
        Bundle.main.loadNibNamed("ControlModalCell", owner: self, options: nil)
        self.contentView.addSubview(cellContentView)
        cellContentView.frame = self.bounds
        cellContentView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        
        setUpVolumeSlider()
        
        onTVButtonView.layer.cornerRadius = 21
        onTVButtonView.clipsToBounds = true
        onTVLabelColor = onTVLabel.textColor
        blurImage.clipsToBounds = true
        progressImage.clipsToBounds = true
        if (UIScreen.main.bounds.height == 812 && UIScreen.main.bounds.width == 375) {
            dismissButtonTop.constant += 20
            infoButtonBottom.constant -= 34
        }
        
        let playState = (data?.playState ?? .notPlayed)
        if (playState == .currentPlaying || playState == .pause) {
            redBar.isHidden = false
        } else {
            redBar.isHidden = true
        }
    }
    
    func setUpVolumeSlider() {
        
        volumeSlider.setThumbImage(UIImage(named: "ic_thumb_slider")?.imageWithInsets(insets: UIEdgeInsetsMake(3, 0, 0, 0)), for: .normal)
        let tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.sliderTapped(gestureRecognizer:)))
        self.volumeSlider.addGestureRecognizer(tapGestureRecognizer)
    }
    
}

// MARK: - UI changes
extension ControlModalCell {
    
    func showHideComponents() {
        if (data?.isLive ?? false) {
            // Show logo channel + red line
            channelImage.isHidden = false
            // Hide orientation button
            orientationButton.isHidden = true
        } else {
            // Show orientation button
            orientationButton.isHidden = false
            // Hide logo channel + red line
            channelImage.isHidden = true
            redBar.isHidden = true
        }
    }
    
    func updateLabelsWith(_ newCurrentTime: Double) {
        
        let formatter = DateComponentsFormatter()
        formatter.zeroFormattingBehavior = .pad
        var totalTime: Double = 0
        if (data?.isLive ?? false) {
            formatter.allowedUnits = [.hour, .minute]
            let startTimeInterval = (data?.startTime.timeIntervalSince1970 ?? 0)
            let endTimeInterval = (data?.endTime.timeIntervalSince1970 ?? 0)
            totalTime = endTimeInterval - startTimeInterval
        } else {
            totalTime = data?.durationInSeconds ?? 0
            if totalTime > 3600 {
                formatter.allowedUnits = [.hour, .minute, .second]
            } else {
                formatter.allowedUnits = [.minute, .second]
            }
        }
        startTimeLabel.text = formatter.string(from: newCurrentTime)
        endTimeLabel.text = "-\(formatter.string(from: totalTime - newCurrentTime) ?? "")"
    }
    
    func updateSTBConnectedState() {
        if (!isSTBConnected) {
            data?.playState = .disconnect
        }
    }
}

// MARK: - Life cycle of player
extension ControlModalCell {
    
    func seekTo(_ currentTime: Double, callback:@escaping (Bool)-> Void) {
        Api.shared().hIG_PlayMediaSetPosition(withPosition: Int32(currentTime)) { (isSuccess, error) in
            if (!isSuccess) {
                print(error ?? "")
            }
            callback(isSuccess)
        }
    }
    
    func shiftTo(_ currentTime: Double, callback:@escaping (Bool)-> Void) {
        let timeshiftInfo = TimeshiftInfo.sharedInstance
        timeshiftInfo.offset = Double(self.progressWidth.constant / self.progressImage.frame.width) - (getCurrentTime().timeIntervalSince1970-self.data!.startTime.timeIntervalSince1970)/(self.data!.endTime.timeIntervalSince1970 - self.data!.startTime.timeIntervalSince1970)
        playTimeshift(playPosition: Int32((currentTime.isNaN || currentTime.isInfinite) ? 0 : currentTime)) { (isSuccess) in
            callback(isSuccess)
        }
    }
}

// MARK: - Gestures
extension ControlModalCell {
    
    func sliderTapped(gestureRecognizer: UIGestureRecognizer) {
        
        let pointTapped: CGPoint = gestureRecognizer.location(in: self.volumeView)
        
        let positionOfSlider: CGPoint = volumeSlider.frame.origin
        let widthOfSlider: CGFloat = volumeSlider.frame.size.width
        let newValue = ((pointTapped.x - positionOfSlider.x) * CGFloat(volumeSlider.maximumValue) / widthOfSlider)
        
        volumeSlider.setValue(Float(newValue), animated: true)
        self.volumeSliderChanged(volumeSlider)
    }
    
    public func changeProgressView(_ sender: UIPanGestureRecognizer) {
        let translation = sender.translation(in: progressView)
        let newWidth = translation.x + progressWidth.constant
        if (data?.isLive ?? false) {
            let timeshiftInfo = TimeshiftInfo.sharedInstance
            if (timeshiftInfo.getModel().lCN != data!.lcn) {
                return
            }
            let SAFE_ZONE_OFFSET: CGFloat = 1   // A workaround to prevent user from seeking to unplayable position of timeshift record.
            let playState = (data?.playState ?? .notPlayed)
            if (newWidth >= (redBarLeading.constant)
                && newWidth <= (redBarLeading.constant + redBarWidth.constant - SAFE_ZONE_OFFSET)
                &&  (playState == .currentPlaying || playState == .pause)) {
                progressWidth.constant = progressWidth.constant + translation.x
                let durationInSeconds = (data?.endTime.timeIntervalSince1970 ?? 0) - (data?.startTime.timeIntervalSince1970 ?? 0)
                let progress = progressWidth.constant / progressView.frame.width
                let currentTime = Double(progress) * durationInSeconds
                updateLabelsWith(currentTime)
            }
        } else {
            let playState = (data?.playState ?? .notPlayed)
            if (newWidth >= 0 && newWidth <= progressView.frame.width &&  (playState == .currentPlaying || playState == .pause)) {
                progressWidth.constant = progressWidth.constant + translation.x
                let durationInSeconds = data?.durationInSeconds ?? 0
                let progress = progressWidth.constant / progressView.frame.width
                let currentTime = Double(progress) * durationInSeconds
                updateLabelsWith(currentTime)
            }
        }
        isDragging = true
        sender.setTranslation(.zero, in: self)
    }
    
    public func doneDraggingProgressView() {
        if (data?.isLive ?? false) {
            let timeshiftInfo = TimeshiftInfo.sharedInstance
            if (timeshiftInfo.getModel().lCN != data!.lcn) {
                return
            }
            let channelDuration = self.data!.endTime.timeIntervalSince1970 - self.data!.startTime.timeIntervalSince1970
            let recordDuration = (getCurrentTime().timeIntervalSince1970 - self.data!.startTime.timeIntervalSince1970) - (self.data!.redBarStartPoint * channelDuration)
            let progress = (progressWidth.constant - redBarLeading.constant) / redBarWidth.constant
            let currentTime = Double(progress) * recordDuration
            self.shiftTo(currentTime) { (isSuccess) in
                if (isSuccess) {
                    self.data?.playState = .currentPlaying
                    timeshiftInfo.isPvrPlaying = true
                } else {
                    self.data?.playState = .notPlayed
                    timeshiftInfo.isPvrPlaying = false
                }
            }
        } else {
            let durationInSeconds = data?.durationInSeconds ?? 0
            let progress = progressWidth.constant / progressImage.frame.width
            let currentTime = Double(progress) * durationInSeconds
            self.seekTo(currentTime) { (isSuccess) in
                if (isSuccess) {
                    self.data?.currentProgress = currentTime/(self.data?.durationInSeconds ?? 1)
                }
            }
        }
        isDragging = false
    }
    
    public func changeVolume(_ sender: UIPanGestureRecognizer) {
        let translation = sender.translation(in: progressView)
        let newVolume = (translation.x + volumeSlider.frame.width * CGFloat(volumeSlider.value)) / (volumeSlider.frame.width)
        if (newVolume >= 0 && newVolume <= 1) {
            volumeSlider.value = Float(newVolume)
            self.volumeSliderChanged(volumeSlider)
        }
        sender.setTranslation(.zero, in: self)
    }
}

// MARK: - ControlModalDataDelegate
extension ControlModalCell: ControlModalDataDelegate {
    
    func progressChanged(controlModalData: ControlModalData) {
        // Update progress view
        if (isDragging) {
            return
        }
        redBarWidth.constant = CGFloat(((data?.redBarProgress ?? 0) - (data?.redBarStartPoint ?? 0)))*self.progressImage.frame.width
        redBarLeading.constant = CGFloat((data?.redBarStartPoint ?? 0))*self.progressImage.frame.width
        if (data?.playState != .pause) {
            progressWidth.constant = CGFloat((data?.currentProgress ?? 0))*self.progressImage.frame.width
        } else if (progressWidth.constant < redBarLeading.constant && redBar.isHidden == false) {
            progressWidth.constant = redBarLeading.constant
        }
        
        // Update label
        if (data?.isLive ?? false) {
            let startTimeInterval = (data?.startTime.timeIntervalSince1970 ?? 0)
            let endTimeInterval = (data?.endTime.timeIntervalSince1970 ?? 0)
            let totalTime = endTimeInterval - startTimeInterval
            updateLabelsWith((data?.currentProgress ?? 0) * totalTime)
        } else {
            let totalTime = data?.durationInSeconds ?? 0
            updateLabelsWith((data?.currentProgress ?? 0) * totalTime)
            onProgress?((data?.currentProgress ?? 0) * totalTime)
        }
    }
    
    func playReachEnd(controlModalData: ControlModalData) {
        data?.playState = .pause
        currentPlaying = nil
        playNext?()
    }
    
    func playStateChanged(controlModalData: ControlModalData) {
        onTVButtonView.isHidden = true
        if (data?.isLive ?? false) {
            //playbackButton.setImage(nil, for: .normal)
            // display redBar
            let timeshiftInfo = TimeshiftInfo.sharedInstance
            if (timeshiftInfo.getModel().lCN == Int32(self.data!.lcn) && timeshiftInfo.getModel().lCN != -1) {
                redBar.isHidden = false
            } else {
                redBar.isHidden = true
            }
            let playState = data?.playState ?? .notPlayed
            if (playState ==  .pause) {
                self.playbackButton.setImage(UIImage(named: "ic_play_with_border"), for: .normal)
                playOverButton.isEnabled = true
                rewindButton.isEnabled = true
                fastforwardButton.isEnabled = true
            } else if (playState == .notPlayed) {
                // normal color
                //onTVLabel.textColor = onTVLabelColor
                self.playbackButton.setImage(UIImage(named: "ic_play_with_border"), for: .normal)
                redBar.isHidden = true
            } else if (playState == .currentPlaying) {
                // more dark color
                //onTVLabel.textColor = onTVDarkerLabelColor
                self.playbackButton.setImage(UIImage(named: "ic_pause"), for: .normal)
                if (needUpdateAll) {
                    self.onPlayMedia?()
                }
            } else {
                //onTVLabel.textColor = onTVDarkerLabelColor
                playOverButton.isEnabled = false
                rewindButton.isEnabled = false
                fastforwardButton.isEnabled = false
                playbackButton.isEnabled = false
                bookmarkButton.isEnabled = false
                captionButton.isEnabled = false
            }
        } else {
            let playState = data?.playState ?? .notPlayed
            if (playState ==  .pause) {
                self.playbackButton.setImage(UIImage(named: "ic_play_with_border"), for: .normal)
                playOverButton.isEnabled = true
                rewindButton.isEnabled = true
                fastforwardButton.isEnabled = true
            } else if (playState == .notPlayed) {
                self.playbackButton.setImage(UIImage(named: "ic_play_with_border"), for: .normal)
                playOverButton.isEnabled = false
                rewindButton.isEnabled = false
                fastforwardButton.isEnabled = false
            } else if (playState == .currentPlaying) {
                self.playbackButton.setImage(UIImage(named: "ic_pause"), for: .normal)
                if (needUpdateAll) {
                    self.onPlayMedia?()
                }
                playOverButton.isEnabled = true
                rewindButton.isEnabled = true
                fastforwardButton.isEnabled = true
            } else {
                playOverButton.isEnabled = false
                rewindButton.isEnabled = false
                fastforwardButton.isEnabled = false
                playbackButton.isEnabled = false
                bookmarkButton.isEnabled = false
                captionButton.isEnabled = false
                volumeSlider.isEnabled = false
            }
        }
    }
}

// MARK: - Actions
extension ControlModalCell {
    
    @IBAction func dismissButtonTouched(_ sender: UIButton) {
        self.data?.updateDataToServer()
        onClosePress()
    }
    
    @IBAction func changeOrientationTouched(_ sender: UIButton) {
        onAlert?("Rotate your device to watch on the phone!")
    }
    
    @IBAction func onShareTouched(_ sender: UIButton) {
        onShare?()
    }
    
    @IBAction func onRewindTouched(_ sender: UIButton) {
        if (data?.isLive ?? false) {
            // TODO: - Rewind for live
        } else {
            var currentTime = (data?.currentProgress ?? 0) * (data?.durationInSeconds ?? 0)
            currentTime = max(currentTime-10,0)
            self.seekTo(currentTime) { (isSuccess) in
                if (isSuccess) {
                    self.data?.currentProgress = currentTime/(self.data?.durationInSeconds ?? 1)
                }
            }
        }
    }
    
    @IBAction func onFastForwardTouched(_ sender: UIButton) {
        if (data?.isLive ?? false) {
            // TODO: - Fastforward for live
        } else {
            let durationInSeconds = self.data?.durationInSeconds ?? 0
            var currentTime = (self.data?.currentProgress ?? 0) * durationInSeconds
            currentTime = min(currentTime+10,durationInSeconds)
            self.seekTo(currentTime) { (isSuccess) in
                if (isSuccess) {
                    self.data?.currentProgress = currentTime/(self.data?.durationInSeconds ?? 1)
                }
            }
        }
    }
    
    @IBAction func onPlayOverTouched(_ sender: UIButton) {
        
        data?.getVideoUrl(callback: { (url) in
            Api.shared().hIG_PlayMediaStart(withPlayPosition: 0, uRL: url, metaData: self.data?.contentId ?? "") { (isSuccess, error) in
                if !isSuccess {
                    print(error ?? "")
                } else {
                    self.data?.currentProgress = 0
                }
            }
        })
    }
    
    @IBAction func infoButtonTouched(_ sender: UIButton) {
        self.data?.updateDataToServer()
        onDetailPress()
    }
    
    @IBAction func bookmarkButtonTouched(_ sender: UIButton) {
       onBookmark?()
    }
    
    @IBAction func favoriteButtonTouched(_ sender: UIButton) {
        onFavorite?()
    }
    
    @IBAction func volumeSliderChanged(_ sender: UISlider) {
        Api.shared().hIG_SetVolume(Int32(sender.value * 100)) { (isSuccess, message) in
            if (!isSuccess) {
                print(message ?? "")
            }
        }
        self.onVolumeChanged?(sender.value)
    }
    
    @IBAction func playBackButtonTouched(_ sender: UIButton) {
        
        if (data?.isLive ?? false) {
            let timeshiftInfo = TimeshiftInfo.sharedInstance
            let playState = data?.playState ?? .notPlayed
            if (playState == .pause || playState == .notPlayed) {
                // play timeshift
                if (Int32(data!.lcn) == timeshiftInfo.getModel().lCN) {
                    if (timeshiftInfo.isPvrPlaying == false) {
                        self.shiftTo(0) { (playSuccess) in
                            if (playSuccess) {
                                self.data?.playState = .currentPlaying
                                timeshiftInfo.isPvrPlaying = true
                            } else {
                                self.data?.playState = .notPlayed
                                timeshiftInfo.isPvrPlaying = false
                            }
                        }
                    } else {
                        Api.shared().hIG_PlayPvrResume { (resumeSuccess, error) in
                            if (resumeSuccess) {
                                self.data?.playState = .currentPlaying
                                timeshiftInfo.isPvrPlaying = true
                            }
                        }
                    }
                } else {
                    Api.shared().hIG_SetZap(withLCN: Int32(self.data?.lcn ?? 0)) { (isSuccess, message) in
                        if (!isSuccess) {
                            print(message ?? "")
                        } else {
                            // Stop & delete timeshift after zapped to another channel.
                            cleanTimeshift()
                            self.data?.playState = .currentPlaying
                            timeshiftInfo.isPvrPlaying = false
                        }
                    }
                }
            } else if (playState == .currentPlaying) {
                if (redBar.isHidden == true) {
                    // start record timeshift
                    let channel = Int32(data!.lcn)
                    
                    timeshiftInfo.setModel(lcn: channel, startTime: Date.init())
                    recordTimeshift(model: timeshiftInfo.getModel()) { (recordSuccess, error) in
                        if (recordSuccess) {
                            timeshiftInfo.isPvrPlaying = false
                        } else {
                            self.onAlert?(error)
                        }
                    }
                    self.data?.updateLiveProgress()
                    self.data?.redBarStartPoint = self.data?.currentProgress ?? 0
                    timeshiftInfo.redBarCheckPoint = data!.redBarStartPoint
                } else {
                    Api.shared().hIG_PlayPvrPause { (pauseSuccess, _) in
                    }
                }
                self.data?.playState = .pause
            }
        } else {
            // Stop & delete timeshift when played a media.
            cleanTimeshift()
            let playState = data?.playState ?? .notPlayed
            if (playState ==  .pause) {
                Api.shared().hIG_PlayMediaResume { (isSuccess, error) in
                    if !isSuccess {
                        print(error ?? "")
                    } else {
                        self.data?.playState = .currentPlaying
                    }
                }
            } else if (playState == .notPlayed) {
                data?.getVideoUrl(callback: { (url) in
                    let contentId = self.data?.contentId ?? ""
                    let playPosition = self.data?.playPosition ?? 0
                    //WatchingHistory.sharedInstance.getConsumedLength(id: contentId, completion: { (consumedLength) in
                        Api.shared().hIG_PlayMediaStart(withPlayPosition: Int32(playPosition), uRL: url, metaData: contentId) { (isSuccess, error) in
                            if !isSuccess {
                                print(error ?? "")
                            } else {
                                self.data?.playState = .currentPlaying
                            }
                        }
                    //});
                    
                })
            } else {
                Api.shared().hIG_PlayMediaPause({ (isSuccess, error) in
                    if !isSuccess {
                        print(error ?? "")
                    } else {
                        self.data?.playState = .pause
                    }
                })
            }
        }
        
    }
}
