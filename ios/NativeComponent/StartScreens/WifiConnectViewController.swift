//
//  WifiConnectViewController.swift
//  STB
//
//  Created by willa on 2018/5/3.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit

class WifiConnectViewController: UIViewController,SwiperDelegate {
    @IBOutlet weak var searchBtn: UIButton!
    @IBOutlet weak var installBtn: UIButton!
    @IBOutlet weak var bottomView: UIView!
//    var swiperView: SwiperView!
    @IBOutlet weak var swiperView: SwiperView!
    var isPop: Bool!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let swiperData = NSMutableArray.init()
        let swiperModel = SwiperModel()
        swiperModel.imageView = ""
        swiperModel.isShowImageView = false
        swiperModel.title = "Select your Wifi connection mode"
        swiperModel.content = "Does your Wifi router have a WPS key ?"
        swiperData.add(swiperModel)
        swiperView.swiperDelegate = self
        swiperView.datas = swiperData
        loadUI()
        
        if isPop == nil {
            isPop = false;
        }
    }
    
    @IBAction func comeBack(_ sender: UIButton) {
        if isPop {
            self.navigationController?.popViewController(animated: true)
        } else {
            self.dismiss(animated: true, completion: nil)
        }
    }
    
    func loadUI() -> Void {
        searchBtn.backgroundColor = UIColor.init(red: 253/255.0, green: 53/255.0, blue: 91/255.0, alpha: 1)
        searchBtn.titleLabel?.textColor = UIColor.white
        searchBtn.layer.cornerRadius = CGFloat(232.2 / 375.0) * kScreenWidth * CGFloat(33.35 / 232.2) / 2
        
        installBtn.layer.borderWidth = 1
        installBtn.layer.borderColor = UIColor.init(red: 132/255.0, green: 132/255.0, blue: 132/255.0, alpha: 0.25).cgColor
        installBtn.backgroundColor = UIColor.clear
        installBtn.layer.cornerRadius = CGFloat(232.2 / 375.0) * kScreenWidth * CGFloat(33.35 / 232.2) / 2
    }
    @IBAction func connectToWlan(_ sender: UIButton) {
        self.navigationController?.pushViewController(WlanWPSViewController(), animated: true)
    }
    @IBAction func installAction(_ sender: UIButton) {
        let vc = WlanAPViewController()
        vc.isPop = isPop
        self.navigationController?.pushViewController(vc, animated: true)
    }
    func swiperToPage(currentIndex: Int) {
        
    }
    func swiperToLastPage() {
        
    }
    
    func swiperButtonInClicked(currentIndex: Int) {
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
