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
    @IBOutlet weak var installBtn: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loadUI()
        loadData()
    }
    
    func loadUI() -> Void {
        searchBtn.layer.borderWidth = 1
        searchBtn.layer.borderColor = UIColor.init(red: 132/255.0, green: 132/255.0, blue: 132/255.0, alpha: 0.25).cgColor
        searchBtn.backgroundColor = UIColor.clear
        searchBtn.layer.cornerRadius = CGFloat(232.2 / 375.0) * kScreenWidth * CGFloat(33.35 / 232.2) / 2
        installBtn.layer.borderWidth = 1
        installBtn.layer.borderColor = UIColor.init(red: 132/255.0, green: 132/255.0, blue: 132/255.0, alpha: 0.25).cgColor
        installBtn.backgroundColor = UIColor.clear
        installBtn.layer.cornerRadius = CGFloat(232.2 / 375.0) * kScreenWidth * CGFloat(33.35 / 232.2) / 2
    }
    
    func loadData() {
        let swiperData = NSMutableArray.init()
        let titles = ["Step 1", "Step 2", "Step 3"];
        let contents = ["Press on the WPS key of your Wifi router\nuntil the LED flashes !", "Press on the WPS key of your STB until the LED \nflashes !", "When connected, the LED of your STB become \nblue !"];
        for i in 0 ..< titles.count {
            let swiperModel = SwiperModel()
            swiperModel.imageView = ""
            swiperModel.isShowImageView = false
            swiperModel.title = titles[i]
            swiperModel.content = contents[i]
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
        if currentIndex == 2 {
            searchBtn.backgroundColor = UIColor.init(red: 253/255.0, green: 53/255.0, blue: 91/255.0, alpha: 1)
            searchBtn.setTitleColor(UIColor.white, for: .normal)
            searchBtn.setTitleColor(UIColor.lightText, for: .highlighted)
        }
    }
     func swiperToLastPage() {
        
    }
    
    @IBAction func installInManual(_ sender: UIButton) {
        let vc = WlanAPViewController();
        self.navigationController?.pushViewController(vc, animated: true)
    }
    
    @IBAction func searchSTB(_ sender: UIButton) {
        let vc = SoftwareUpdateController();
        vc.isFirst = true
        self.navigationController?.pushViewController(vc, animated: true)
    }
}
