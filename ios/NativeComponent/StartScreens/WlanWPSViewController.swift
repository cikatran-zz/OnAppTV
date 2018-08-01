//
//  WlanAPViewController.swift
//  STB
//
//  Created by willa on 2018/5/7.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

class WlanWPSViewController: UIViewController, SwiperDelegate {
    func swiperButtonInClicked(currentIndex: Int) {
        
    }
    
    @IBOutlet weak var swiperView: SwiperView!
    @IBOutlet weak var searchBtn: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loadUI()
        loadData()
    }
    
    func loadUI() -> Void {
        searchBtn.layer.cornerRadius = CGFloat(232.2 / 375.0) * kScreenWidth * CGFloat(33.35 / 232.2) / 2
    }
    
    func loadData() {
        let swiperData = NSMutableArray.init()
        let titles = ["Step 1", "Step 2", "Step 3"];
        let contents = ["Press on the WPS key of your Wifi router\nuntil the LED flashes !", "Press on the WPS key of your STB until\nthe LED flashes !", "Press on the WPS key of your STB until\nthe LED flashes !"];
        for i in 0 ..< titles.count {
            let swiperModel = SwiperModel()
            swiperModel.imageView = ""
            swiperModel.isShowImageView = false
            swiperModel.title = titles[i]
            swiperModel.content = contents[i]
            swiperModel.isContentTextCenter = false
            swiperData.add(swiperModel)
        }
        swiperView.swiperDelegate = self
        swiperView.datas = swiperData
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func comeBack(_ sender: Any) {
        self.navigationController?.popViewController(animated: true)
    }
    
    func swiperToPage(currentIndex: Int) {
        searchBtn.isHidden = currentIndex == 2 ? false : true
    }
     func swiperToLastPage() {
        
    }
    
    @IBAction func searchSTB(_ sender: UIButton) {
        let vc = SoftwareUpdateController();
        vc.isFirst = true
        self.navigationController?.pushViewController(vc, animated: true)
    }
}
