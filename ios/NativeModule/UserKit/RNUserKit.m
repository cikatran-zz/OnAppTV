//
//  RNUserKit.m
//  OnAppTV
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNUserKit.h"
#import "OnAppTV-Swift.h"

@implementation RNUserKit

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setDeviceType: (NSString *)type) {
    [[UserKitModule sharedInstance] setDeviceTypeWithType:type];
}

RCT_EXPORT_METHOD(time: (NSString *)event) {
    [[UserKitModule sharedInstance] timeWithEvent:event];
}

RCT_EXPORT_METHOD(track: (NSString *)name properties: (NSDictionary *)properties) {
    [[UserKitModule sharedInstance] trackWithEvent:name properties:properties];
}

@end
