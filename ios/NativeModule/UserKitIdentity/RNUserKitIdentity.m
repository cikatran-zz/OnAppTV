//
//  RNUserKitIdentity.m
//  OnAppTV
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNUserKitIdentity.h"
#import "OnAppTV-Swift.h"

@implementation RNUserKitIdentity

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(signOut) {
    [[UserKitIdentityModule sharedInstance] signOut];
}

RCT_EXPORT_METHOD(signUpWithEmail: (NSString *)email
                  password: (NSString *)password
                  customProperties: (NSDictionary *)customProperties
                  callback: (RCTResponseSenderBlock)callback) {
    
    [[UserKitIdentityModule sharedInstance] signUpWithEmail:email
                                                   password:password
                                           customProperties:customProperties
                                               successBlock:^(NSString* authenModel) {
                                                   callback(@[[NSNull null], authenModel]);
                                               } errorBlock:^(NSString* error) {
                                                   callback(@[error]);
                                               }];
}

RCT_EXPORT_METHOD(signInWithFacebookAccount:(NSString *)facebookAuthToken
                  setUserToken:(BOOL)setUserToken
                  callback: (RCTResponseSenderBlock)callback) {
    
    [[UserKitIdentityModule sharedInstance] signInWithFacebookAccount:facebookAuthToken
                                                        successBlock:^(NSString* authenModel) {
                                                            callback(@[[NSNull null], authenModel]);
                                                        } errorBlock:^(NSString* error) {
                                                            callback(@[error]);
                                                        }];
}

RCT_EXPORT_METHOD(signInWithEmail: (NSString *)email
                  password: (NSString *)password
                  customProperties: (NSDictionary *)customProperties
                  callback: (RCTResponseSenderBlock)callback) {
    
    [[UserKitIdentityModule sharedInstance] signInWithEmail:email
                                                   password:password
                                               successBlock:^(NSString* authenModel) {
                                                   callback(@[[NSNull null], authenModel]);
                                               } errorBlock:^(NSString* error) {
                                                   callback(@[error]);
                                               }];
}





@end
