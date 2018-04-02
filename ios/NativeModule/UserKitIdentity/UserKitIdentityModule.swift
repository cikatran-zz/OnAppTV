//
//  UserKitIdentityModule.swift
//  OnAppTV
//
//  Created by Chuong Huynh on 3/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import UserKitIdentity

@objc(UserKitIdentityModule)
class UserKitIdentityModule: NSObject {
    
    public static let sharedInstance = UserKitIdentityModule()
    
    private var module: UserKitIdentityInstance! = nil
    
    private override init() {
        super.init()
    }
    
    @objc func initialize(token: String) {
        UserKitIdentity.initialize(token: token)
         module = UserKitIdentity.mainInstance()
        #if DEBUG
            module.loggingEnabled = true
        #endif
    }
    
    @objc func signOut() {
        module.signOut()
    }
    
    @objc func signUp(email: String, password: String, customProperties: [String: Any], successBlock: @escaping ([String: Any]?) -> Void, errorBlock: @escaping ([String: Any]?)->Void) {
        module.signUp(email, password: password, customProperties: customProperties, successBlock: { (authenModel) in
            successBlock(authenModel?.toJson())
        }) { (error) in
            errorBlock(error?.toJson())
        }
    }
    
    @objc func loginWithFacebookAccount(_ facebookAuthToken: String, setUserToken: Bool, successBlock:  @escaping ([String: Any]?) -> Void, errorBlock: @escaping ([String: Any]?)->Void) {
        module.loginWithFacebookAccount(facebookAuthToken, setUserToken: setUserToken, successBlock: { (authenModel) in
            successBlock(authenModel?.toJson())
        }) { (error) in
            errorBlock(error?.toJson())
        }
    }
}
