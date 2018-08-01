//
//  SwiperView.swift
//  STB
//
//  Created by willa on 2018/5/4.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

protocol SwiperDelegate: NSObjectProtocol {
    func swiperToPage(currentIndex: Int)
    func swiperToLastPage()
    func swiperButtonInClicked(currentIndex: Int)
}

class SwiperView: UIView, UIScrollViewDelegate {
    
//    滚动视图对象
    var scrollView: UIScrollView!
//    视图中的小圆点
    var pageControl: PageControl!
//    动态数组对象
    var _datas:NSMutableArray!
//    var datas: NSMutableArray!
    var datas: NSMutableArray? {
        get{
            if _datas == nil {
                _datas = NSMutableArray.init()
            }
            return _datas
        }
        set{
            _datas = newValue
            setUpScrollView()
        }
    }
    weak var swiperDelegate: SwiperDelegate!
    
    init(frame: CGRect, data:NSMutableArray) {
        super.init(frame: frame)
        self.datas = data
        setUI()
    }
    
    func setUI() -> Void {
        
        var frame = self.frame
        frame.size.height = kScreenHeight
        frame.size.width = kScreenWidth
        self.frame = frame
        
        if scrollView == nil {
//            scrollView的可视范围
            scrollView = UIScrollView.init(frame: CGRect.init(x: 0, y: 0, width: self.frame.size.width, height: self.frame.size.height))
            self.addSubview(scrollView)
//            设置委托
            self.scrollView.delegate = self
//            设置背景颜色
            self.scrollView.backgroundColor = UIColor.clear
//            隐藏水平和垂直滚动条
            self.scrollView.showsVerticalScrollIndicator = false
            self.scrollView.showsHorizontalScrollIndicator = false
//            去掉弹簧效果
            self.scrollView.bounces = false
//            分页效果
            self.scrollView.isPagingEnabled = true
        }
        
        if pageControl == nil {
            let pageControl_y = CGFloat(554.53 / 667.0) * self.frame.size.height
            pageControl = PageControl.init(frame: CGRect.init(x: self.frame.origin.x, y: pageControl_y, width: self.frame.size.width, height: 15.67))
            pageControl.center.x = screenWidth / 2
            pageControl.pageIndicatorTintColor = UIColor.init(red: 241/255.0, green: 241/255.0, blue: 241/255.0, alpha: 1)
            pageControl.currentPageIndicatorTintColor = UIColor.init(red: 252/255.0, green: 53/255.0, blue: 91/255.0, alpha: 1)
            pageControl.currentPage = 0
            addSubview(pageControl)
        }
        
        if datas != nil {
            if datas?.count == 1 {
                pageControl.alpha = 0
            } else {
                pageControl.numberOfPages = (datas?.count)!
            }
        }else {
            pageControl.alpha = 0
        }
    }
    
    func setUpScrollView() -> Void {
//        设置 scrollView的滚动范围（内容大小）
        let scrollViewContentWidth = self.scrollView.frame.size.width * CGFloat(self._datas.count)
        self.scrollView.contentSize = CGSize.init(width: scrollViewContentWidth, height: self.scrollView.frame.size.height)
        
        if datas != nil {
            if datas?.count == 1 {
                pageControl.alpha = 0
            } else {
                pageControl.numberOfPages = (datas?.count)!
            }
        }else {
            pageControl.alpha = 0
        }
        
        if self._datas.count > 0 {
            for i in 0...self._datas.count - 1 {
                let contentView = UIView.init(frame: CGRect.init(x: self.frame.size.width * CGFloat(i), y: 0, width: self.frame.size.width, height: self.frame.size.height))
                
                contentView.isUserInteractionEnabled = true
                scrollView.addSubview(contentView)
                
                let titleLable = UILabel.init()
                let titleLable_y = CGFloat(140.0 / 667.0) * self.frame.size.height
                titleLable.textAlignment = NSTextAlignment.center
                titleLable.font = UIFont.init(name: "SF UI Text", size: 17)
                titleLable.text = " "
                titleLable.sizeToFit()
                titleLable.frame = CGRect.init(x: 0, y: titleLable_y , width: self.frame.size.width, height: titleLable.frame.size.height)
                titleLable.textColor = UIColor.init(red: 252/255.0, green: 53/255.0, blue: 91/255.0, alpha: 1.0)
                contentView.addSubview(titleLable)
                
                let imageViewSize = CGFloat(95 / 375.0) *  self.frame.size.width
                let imageView_x = (self.frame.size.width - imageViewSize) / 2
                let imageView_y = CGFloat(277.0 / 667.0) * self.frame.size.height
                let imageView = UIButton.init(frame: CGRect.init(x:imageView_x, y: imageView_y, width: imageViewSize, height: imageViewSize))
                imageView.tag = i
                imageView.addTarget(self, action: #selector(buttonAction(sender:)), for: UIControlEvents.touchUpInside)
                contentView.addSubview(imageView)
                
                let contentLable_y = CGFloat(170.0 / 667.0) * self.frame.size.height
                let contentLable = UILabel.init(frame: CGRect.init(x: 0, y: contentLable_y, width: contentView.frame.size.width, height: self.frame.size.height - contentLable_y))
                contentLable.font = UIFont.init(name:"SF UI Text" , size: 17)
                contentLable.textAlignment = NSTextAlignment.center
                contentLable.textColor = UIColor.init(red: 57/255.0, green: 57/255.0, blue: 57/255.0, alpha: 0.57)
                contentLable.numberOfLines = 0
                contentView.addSubview(contentLable)
                
                let subscription_y = CGFloat(382.0 / 667.0) * self.frame.size.height
                let subscription = UILabel.init(frame: CGRect.init(x: 0, y: subscription_y, width: contentView.frame.size.width, height: self.frame.size.height - subscription_y))
                subscription.font = UIFont.init(name:"SF UI Text" , size: 13)
                subscription.textAlignment = NSTextAlignment.center
                subscription.textColor = UIColor.init(red: 57/255.0, green: 57/255.0, blue: 57/255.0, alpha: 0.57)
                subscription.numberOfLines = 0
                contentView.addSubview(subscription)
                
                let swiperModel = _datas[i] as! SwiperModel
                if swiperModel.isShowImageView {
                    imageView.setImage(UIImage.init(named: swiperModel.imageView), for: .normal)
                } else {
                    imageView.alpha = 0.0
                }
                titleLable.text = swiperModel.title
                //                contentLable.text = swiperModel.content
                let paragraphStyle = NSMutableParagraphStyle()
                paragraphStyle.lineSpacing = 0.4
                paragraphStyle.alignment = NSTextAlignment.center
                var setStr = NSMutableAttributedString.init(string:swiperModel.content)
                setStr.addAttribute(NSParagraphStyleAttributeName, value: paragraphStyle, range: NSRange.init(location: 0, length: swiperModel.content.count))
                contentLable.attributedText = setStr
                var size = CGRect.init(x: contentLable.frame.origin.x, y: contentLable.frame.origin.y, width: contentLable.frame.size.width, height: 100)
                let contentLableSize = contentLable.textRect(forBounds: size, limitedToNumberOfLines: 4)
                contentLable.frame = contentLableSize
                contentLable.center.x = contentView.bounds.size.width / 2
                
                if swiperModel.isContentTextCenter {
                    contentLable.textAlignment = NSTextAlignment.left
                }
                
                if swiperModel.subscription != nil {
                    subscription.text = swiperModel.subscription
                    
                    setStr = NSMutableAttributedString.init(string:swiperModel.subscription)
                    setStr.addAttribute(NSParagraphStyleAttributeName, value: paragraphStyle, range: NSRange.init(location: 0, length: swiperModel.subscription.count))
                    subscription.attributedText = setStr
                    size = CGRect.init(x: subscription.frame.origin.x, y: subscription.frame.origin.y, width: subscription.frame.size.width, height: 100)
                    let subscriptionSize = subscription.textRect(forBounds: size, limitedToNumberOfLines: 4)
                    subscription.frame = subscriptionSize
                    subscription.center.x = contentView.bounds.size.width / 2
                }
                self.scrollView.addSubview(contentView)
            }
        }
    }
    
    func buttonAction(sender: UIButton) {
        if swiperDelegate != nil {
            swiperDelegate.swiperButtonInClicked(currentIndex: sender.tag)
        }
    }
    
    func scrollViewToPosition() -> Void {
        scrollView.contentOffset = CGPoint.init(x: screenWidth * CGFloat((datas?.count)! - 2), y: 0)
        pageControl.currentPage = (datas?.count)! - 2
    }
    
    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        let point = scrollView.contentOffset
        let page = point.x / scrollView.frame.size.width
        //        print("滑动的页数\(page)")
        self.pageControl.currentPage = Int(abs(page))
        if swiperDelegate != nil {
            swiperDelegate.swiperToPage(currentIndex: self.pageControl.currentPage)
        }
        if self.pageControl.currentPage == (datas?.count)! - 1 {
            if swiperDelegate != nil {
                swiperDelegate.swiperToLastPage()
            }
        }
    }
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setUI()
    }
}
