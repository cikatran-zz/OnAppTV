//
//  STBConnectionView.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/9/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import STBAPI
import WebViewJavascriptBridge
import UserKitIdentity

class STBConnectionView: UIView {
    
    // MARK: - Outlets
    @IBOutlet var contentView: UIView!
    @IBOutlet weak var webView: UIWebView!
    @IBOutlet weak var startUpView: UIView!
    
    // MARK: - Properties
    var bridge: WebViewJavascriptBridge!
    var rctBridge: RCTBridge? = nil
    
    public var onFinished: RCTDirectEventBlock = { event in }
    
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
    
    convenience init(rctBridge: RCTBridge) {
        self.init(frame: .zero)
        self.rctBridge = rctBridge
    }
    
    func commonInit() {
        Bundle.main.loadNibNamed("STBConnectionView", owner: self, options: nil)
        self.addSubview(contentView)
        contentView.frame = self.bounds
        contentView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        setupJavascriptBridge()
    }
    
    func setupJavascriptBridge() {
        
        //        Whether it's the first time to start an APP
        let isStarted = true
        
        //        The HTML file name of the webView
        var webViewName = "" ;
        //        Determine whether the APP is first started
        if UserKitIdentity.mainInstance().accountManager.isLoggedIn() {
            //            Not for the first time
            webViewName = "Revolution";
        }else {
            //            Start the APP for the first time
//            UserDefaults.standard.set(true, forKey: "isStarted");
            webViewName = "Login";
        }
        //        Antional\Login\WifiConnection\SignIn\ChannelList\Revolution
        
        self.webView.scrollView.showsVerticalScrollIndicator = false;
        self.webView.scrollView.showsHorizontalScrollIndicator = false;
        self.webView.scrollView.bounces = false;
        self.bridge = WebViewJavascriptBridge(forWebView: self.webView)
        self.bridge.setWebViewDelegate(self);
        
        self.bridge.registerHandler("HIG_GetSTBList") { (data, responseCallback) in
            Api.shared().hIG_GetMobileWifiInfo({ (dic) in
                if (dic?.keys.contains("SSID"))! {
                    let ssid = dic?["SSID"] as! String;
                    if !ssid.hasPrefix("STB") {
                        Api.shared().hIG_UdpOperation();
                        Api.shared().hIG_UdpReceiveMessage(inJson: { (jsonString) in
                            self.bridge.callHandler("HIG_GetSTBList", data: jsonString);
                        });
                        Api.shared().hIG_UndiscoveredSTBList(inJson: { (str) in
                            self.bridge.callHandler("HIG_UndiscoveredSTBList", data: str);
                        })
                    }
                }
            })
        };
        
        
        self.bridge.registerHandler("HIG_ConnectSTB") { (data, responseCallback) in
            let str = data as! String;
            //json文件
            let jsonData = str.data(using: String.Encoding.utf8)!
            
            let jsonDict = try!JSONSerialization.jsonObject(with: jsonData, options: .mutableContainers) as! NSMutableDictionary
            
            jsonDict.setValue("Test", forKey: "userName");
            
            let json = try!JSONSerialization.data(withJSONObject: jsonDict, options: [])
            
            let jsonStr = NSString(data:json as Data,encoding:String.Encoding.utf8.rawValue)
            
            Api.shared().hIG_ConnectSTB(withJsonString: jsonStr! as String, callback: { (jsonString) in
                //解析Json
                let jsonData = (jsonString?.data(using: .utf8))!
                let dict = try! JSONSerialization.jsonObject(with: jsonData, options: .mutableContainers) as! NSDictionary
                let string = jsonString;
                let returnStr = dict.object(forKey: "return") as! String;
                if (returnStr == "1") {
                    Api.shared().hIG_ParseXMLLastInJson(withPath: Bundle.main.path(forResource: "database _IBC_2017-2", ofType: "xml"), callback: { (jsonString) in
                        self.bridge .callHandler("HIG_ConnectSTB", data: string);
                        Api.shared().hIG_GetSTBConfigureAndCallback({ (model) in
                            if isStarted != true
                            {
                                Api.shared().hIG_SetSTBConfigure(with: model, callback: nil)
                            }
                        })
                    })
                }else {
                    self.bridge .callHandler("HIG_ConnectSTB",data:string);
                }
            })
        }
        
        self.bridge.registerHandler("Search") { (data, responseCallback) in
            Api.shared().hIG_GetSatelliteList(inJson: { (jsonString) in
                self.bridge.callHandler("HIG_GetSatelliteList",data:jsonString);
            });
        }
        self.bridge.registerHandler("HIG_SetSatelliteParam") { (data, responseCallback) in
            let str = data as! String;
            Api.shared().hIG_SetSatellite(withJsonString: str, callback: nil)
        }
        
        self.bridge.registerHandler("HIG_TuneTransporter") { (data, responseCallback) in
            let str = data as! String;
            Api.shared().hIG_GetSignalAfterSetFeTun(withJsonString: str, callback: { (jsonString) in
                self.bridge.callHandler("HIG_GetSignal", data: jsonString)
            })
        }
        self.bridge.registerHandler("HIG_GetParentalGuideRating") { (data, responseCallback) in
            Api.shared().hIG_GetSTBConfigure(inJson: { (jsonString) in
                self.bridge.callHandler("HIG_GetParentalGuideRating", data: jsonString)
            })
        }
        self.bridge.registerHandler("HIG_SetParantalGuideRating") { (data, responseCallback) in
            let str = data as! String;
            Api.shared().hIG_SetParentalGuideRating(withJsonString: str, callback: nil)
        }
        
        self.bridge.registerHandler("HIG_CheckSTBPIN") { (data,responseCallback ) in
            
            let jsonData:Data = ((data as AnyObject).data(using: String.Encoding.utf8.rawValue))!
            let dict = try! JSONSerialization.jsonObject(with: jsonData, options: .mutableContainers) as! NSDictionary
            Api.shared().hIG_ResetSTBPIN(withOldPIN: Api.shared().hIG_GetSTBPIN(), newPIN: dict.object(forKey: "newPIN") as! String, callback: { (bool, error) in
                if(bool){
                    self.bridge.callHandler("HIG_CheckSTBPINCallback",data:bool)
                }
                else{
                    self.bridge.callHandler("HIG_CheckSTBPINCallback",data:error)
                    
                }
                
            })
        }
        self.bridge.registerHandler("HIG_STBConnectStatus") { (data, responseCallback) in
            let str = data as! String;
            let jsonData = str.data(using:.utf8);
            let dic = try?JSONSerialization.jsonObject(with: jsonData!, options:.mutableContainers) as! NSDictionary;
            let connectState = dic!["connectState"] as! Bool;
            if connectState {
                // TODO: - Notify event to React Native
                self.onFinished([:])
            }
        }
        self.bridge.registerHandler("HIG_GetMobileWifiInfo") { (data, responseCallback) in
            Api.shared().hIG_GetMobileWifiInfo(inJson: { (jsonString) in
                
                self.bridge.callHandler("HIG_GetMobileWifiInfo",data:jsonString)
            })
        }
        self.bridge.registerHandler("HIG_STBWlanAP") { (data, responseCallback) in
            let str = data as! String;
            Api.shared().hIG_STBWlanAP(withJsonString: str, callback: { (jsonString) in
                self.bridge.callHandler("HIG_STBWlanAP",data:jsonString)
            })
        }
        
        // Additional javascript bridge
        self.bridge.registerHandler("HIG_AllowNotification") { (data, callback) in
            NotificationCenter.shared.requestPermission(successBlock: nil, errorBlock: nil)
        }
        
        self.webView.loadRequest(NSURLRequest.init(url: URL.init(fileURLWithPath: Bundle.main.path(forResource: webViewName, ofType: "html")!)) as URLRequest);
    }
}

extension STBConnectionView: UIWebViewDelegate {
    
    func webViewDidFinishLoad(_ webView: UIWebView) {
        //        To avoid excessive memory footprint
        UserDefaults.standard.set(0, forKey: "WebKitCacheModelPreferenceKey");
        
        if self.startUpView.alpha == 1.0 {
            UIView.animate(withDuration: 0.5, animations: {
                self.startUpView.alpha = 0.0;
            }, completion: { (bool) in
                self.startUpView.isHidden = true;
            })
        }
    }
    
    func webView(_ webView: UIWebView, didFailLoadWithError error: Error) {
        
    }
}
