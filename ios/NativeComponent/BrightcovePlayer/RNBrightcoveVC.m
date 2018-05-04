//
//  RNBrightcoveVC.m
//  OnAppTV
//
//  Created by Chuong Huynh on 5/1/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNBrightcoveVC.h"
#import "BrightcoveViewController.h"

@implementation RNBrightcoveVC

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(navigateWithVideoId: (NSString *)videoId
                  accountId: (NSString *)accountId
                  policyKey: (NSString *)policyKey
                  metaData: (NSDictionary *)metaData) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *currentWindow = [[[UIApplication sharedApplication] delegate] window];
        
        BrightcoveViewController *vc = (BrightcoveViewController *)[UIStoryboard storyboardWithName:@"BrightcoveStoryboard" bundle:nil].instantiateInitialViewController;
        
        [vc setBrightcoveWithVideoId:videoId
                           accountId:accountId
                           policyKey:policyKey
                            metaData:metaData
                              onDone:^{
                                  [currentWindow.rootViewController dismissViewControllerAnimated:YES
                                                                                       completion:nil];
                              }];
        
        [currentWindow.rootViewController presentViewController:vc animated:YES completion:nil];
    });
}

@end
