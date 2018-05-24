//
//  ControlModal.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 5/7/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import STBAPI

enum DraggingState {
    case none
    case page
    case progress
    case volume
}
var isShowedPopUp = false
class ControlModal: UIView {
    
    @IBOutlet var contentView: UIView!
    @IBOutlet weak var collectionView: UICollectionView!
    var draggingState: DraggingState = .none
    var onceOnly = false
    var autoScroll = false
    
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
    
    public var index: NSNumber = NSNumber(integerLiteral: 0) {
        didSet {
            if (index.intValue < 0) {
                index = NSNumber(integerLiteral: 0)
            }
        }
    }
    public var isLive: Bool = false {
        didSet {
            collectionView.reloadData()
        }
    }
    public var items: JSONArr = [] {
        didSet {
            videosData = items.map{ ControlModalData(json: asJsonObj($0))}
            collectionView.reloadData()
        }
    }
    
    public var onClose: RCTDirectEventBlock = { event in }
    public var onDetail: RCTDirectEventBlock = { event in }
    public var onAlert: RCTDirectEventBlock = { event in }
    public var onShare: RCTDirectEventBlock = { event in }
    public var onIndexChanged: RCTDirectEventBlock = { event in }
    public var onBookmark: RCTDirectEventBlock = { event in }
    public var onFavorite: RCTDirectEventBlock = { event in }
    public var onProgress: RCTDirectEventBlock = { event in }
    // Datasource
    var videosData: [ControlModalData] = []
    
    // Default UI
    var volumeValue: Float = Float(Api.shared().hIG_GetVolume()) / 100
    
    var isSTBConnected: Bool {
        get {
            let result = Api.shared().hIG_IsConnect()
            if !result && isShowedPopUp == false {
                onAlert(["message": "Disconnect from STB"])
                isShowedPopUp = true
            }
            return result
        }
        set {
            
        }
    }
    
    
    func commonInit() {
        Bundle.main.loadNibNamed("ControlModal", owner: self, options: nil)
        self.addSubview(contentView)
        contentView.frame = self.bounds
        contentView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        self.collectionView.delegate = self
        self.collectionView.dataSource = self
        self.collectionView.register(ControlModalCell.self, forCellWithReuseIdentifier: "ControlModal")
        
        let panGesture = UIPanGestureRecognizer(target: self, action: #selector(self.handlePanGesture(_:)))
        self.collectionView?.addGestureRecognizer(panGesture)
        self.collectionView?.panGestureRecognizer.isEnabled = false
    }
    
    func handlePanGesture(_ sender: UIPanGestureRecognizer) {
        if sender.state == .began {
            let tapLocation = sender.location(in: (collectionView.visibleCells.first as? ControlModalCell)?.gestureView)
            let minYPage = CGFloat(0)
            let maxYPage = (collectionView.visibleCells.first as? ControlModalCell)?.gestureView.frame.size.height ?? 200
            if (tapLocation.y > minYPage && tapLocation.y < maxYPage) {
                draggingState = .page
            } else if (tapLocation.y < 0) {
                draggingState = .progress
            } else if (tapLocation.y >= maxYPage) {
                draggingState = .volume
            } else {
                draggingState = .none
            }
        }
        
        if (draggingState == .page) {
            let translation = sender.translation(in: self)
            var contentOffset = self.collectionView?.contentOffset ?? .zero
            contentOffset.x = contentOffset.x - translation.x
            if (contentOffset.x >= 0 && contentOffset.x + self.frame.width <= collectionView.contentSize.width) {
                UIView.animate(withDuration: 0.1) {
                    self.collectionView?.contentOffset = contentOffset
                }
            }
            
            sender.setTranslation(.zero, in: self)
        }
        
        if (draggingState == .progress) {
            (collectionView.visibleCells.first as? ControlModalCell)?.changeProgressView(sender)
        }
        
        if (draggingState == .volume) {
            (collectionView.visibleCells.first as? ControlModalCell)?.changeVolume(sender)
        }
        
        if sender.state == .ended {
            if (draggingState == .page) {
                let contentOffsetX = self.collectionView.contentOffset.x
                let page = round(contentOffsetX/self.frame.width)
                self.collectionView.scrollToItem(at: IndexPath(item: Int(page), section: 0) , at: UICollectionViewScrollPosition.centeredHorizontally, animated: true)
            } else if (draggingState == .progress) {
                (collectionView.visibleCells.first as? ControlModalCell)?.doneDraggingProgressView()
            }
            draggingState = .none
        }
    }
    
    
    
}

extension ControlModal: UICollectionViewDataSource {
    
    func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return videosData.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "ControlModal", for: indexPath) as! ControlModalCell
        let data = videosData[indexPath.item]
        cell.configWithData(data)
        cell.onDetailPress = {
            self.onDetail([:])
        }
        cell.onClosePress = {
            self.onClose([:])
        }
        cell.onVolumeChanged = { newVal in
            self.volumeValue = newVal
            collectionView.reloadData()
        }
        cell.onPlayMedia = {
            for i in 0..<self.videosData.count {
                if (i != indexPath.item) {
                    self.videosData[i].playState = .notPlayed
                    if (!self.isLive) {
                        self.videosData[i].currentProgress = 0.0
                    }
                }
            }
            //collectionView.reloadData()
        }
        cell.playNext = {
            let itemIndex = min(indexPath.item + 1, self.videosData.count - 1)
            
            if (itemIndex != indexPath.item) {
                let indexToScrollTo = IndexPath(item: itemIndex, section: 0)
                
                self.collectionView.scrollToItem(at: indexToScrollTo, at: .centeredHorizontally, animated: true)
                self.autoScroll = true
            }
        }
        cell.onAlert = { message in
            self.onAlert(["message":message])
        }
        cell.onShare = {
            self.onShare(["title":data.title, "message":data.genres, "url": data.imageURL])
        }
        cell.onBookmark = {
            self.onBookmark([:])
        }
        cell.onFavorite = {
            self.onFavorite([:])
        }
        cell.onProgress = { currentTime in
            self.onProgress(["current": currentTime])
        }
        cell.volumeSlider.value = self.volumeValue
        cell.isSTBConnected = self.isSTBConnected
        return cell
    }
}

extension ControlModal: UICollectionViewDelegateFlowLayout, UICollectionViewDelegate {
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        
        return UIScreen.main.bounds.size
    }
    
    func collectionView(_ collectionView: UICollectionView, willDisplay cell: UICollectionViewCell, forItemAt indexPath: IndexPath) {
        if !onceOnly {
            let indexToScrollTo = IndexPath(item: index.intValue, section: 0)
            self.collectionView.scrollToItem(at: indexToScrollTo, at: .centeredHorizontally, animated: false)
            onIndexChanged(["index": index.intValue])
            // Zap or play media
            if (isSTBConnected) {
                if (self.videosData[index.intValue].isLive) {
                    Api.shared().hIG_SetZap(withLCN: Int32(self.videosData[index.intValue].lcn)) { (isSuccess, error) in
                        if !isSuccess {
                            print(error ?? "")
                        } else {
                            self.videosData[self.index.intValue].playState = .currentPlaying
                        }
                    }
                } else {
                    self.videosData[index.intValue].getVideoUrl { (url) in
                        WatchingHistory.sharedInstance.getConsumedLength(id: self.videosData[self.index.intValue].contentId, completion: { (consumedLength) in
                            Api.shared().hIG_PlayMediaStart(withPlayPosition: Int32(consumedLength), uRL: url) { (isSuccess, error) in
                                if !isSuccess {
                                    print(error ?? "")
                                } else {
                                    self.videosData[self.index.intValue].playState = .currentPlaying
                                }
                            }
                        });
                    }
                    
                }
            }
            onceOnly = true
        }
        if (autoScroll) {
            autoScroll = false
            (cell as? ControlModalCell)?.playBackButtonTouched(UIButton())
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, didEndDisplaying cell: UICollectionViewCell, forItemAt indexPath: IndexPath) {
        var visibleIndex = index.intValue
        if (collectionView.visibleCells.count > 0) {
            visibleIndex = collectionView.indexPath(for: collectionView.visibleCells.first!)!.item
        }
        onIndexChanged(["index": visibleIndex])
    }
    
    
}
