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
                                                   NSMutableArray *result = [[NSMutableArray alloc] init];
                                                   if (authenModel == nil) {
                                                       [result addObject:[NSNull null]];
                                                   }
                                                   callback(@[[NSNull null], result]);
                                               } errorBlock:^(NSString* error) {
                                                   NSMutableString *result = [[NSMutableString alloc] init];
                                                   if (error == nil) {
                                                       [result setString: @"{\"error_message\": \"Unknown error\"}"];
                                                   }
                                                   callback(@[result, [NSNull null]]);
                                               }];
}

RCT_EXPORT_METHOD(signInWithFacebookAccount:(NSString *)facebookAuthToken
                  setUserToken:(BOOL)setUserToken
                  callback: (RCTResponseSenderBlock)callback) {
    
    [[UserKitIdentityModule sharedInstance] signInWithFacebookAccount:facebookAuthToken
                                                        successBlock:^(NSString* authenModel) {
                                                            NSMutableArray *result = [[NSMutableArray alloc] init];
                                                            if (authenModel == nil) {
                                                                [result addObject:[NSNull null]];
                                                            }
                                                            callback(@[[NSNull null], result]);
                                                        } errorBlock:^(NSString* error) {
                                                            NSMutableString *result = [[NSMutableString alloc] init];
                                                            if (error == nil) {
                                                                [result setString: @"{\"error_message\": \"Unknown error\"}"];
                                                            }
                                                            callback(@[result, [NSNull null]]);
                                                        }];
}

RCT_EXPORT_METHOD(signInWithEmail: (NSString *)email
                  password: (NSString *)password
                  callback: (RCTResponseSenderBlock)callback) {
    
    [[UserKitIdentityModule sharedInstance] signInWithEmail:email
                                                   password:password
                                               successBlock:^(NSString* authenModel) {
                                                   NSMutableArray *result = [[NSMutableArray alloc] init];
                                                   if (authenModel == nil) {
                                                       [result addObject:[NSNull null]];
                                                   }
                                                   callback(@[[NSNull null], result]);
                                               } errorBlock:^(NSString* error) {
                                                   NSMutableString *result = [[NSMutableString alloc] init];
                                                   if (error == nil) {
                                                       [result setString: @"{\"error_message\": \"Unknown error\"}"];
                                                   }
                                                   callback(@[result, [NSNull null]]);
                                               }];
}

RCT_EXPORT_METHOD(checkSignIn: (RCTResponseSenderBlock)callback) {
    callback(@[[NSNull null], @[[[UserKitIdentityModule sharedInstance] isLoggedIn]]]);
}



@end
