//
//  RNNotificationCenter.m
//  OnAppTV
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNNotificationCenter.h"
#import "OnAppTV-Swift.h"

@implementation RNNotificationCenter

RCT_EXPORT_METHOD(requestPermission) {
    [[OANotificationCenter sharedInstance] requestPermissionWithCallback:^{
        
    }];
}

@end
