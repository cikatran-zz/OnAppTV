//
//  RNTBrightcovePlayerManager.m
//  OnAppTV
//
//  Created by Chuong Huynh on 2/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNTBrightcovePlayerManager.h"
#import "OnAppTV-Swift.h"

@implementation RNTBrightcovePlayerManager

RCT_EXPORT_MODULE()
- (UIView *)view {
  return [[BrightcovePlayer alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(videoId, NSString);
RCT_EXPORT_VIEW_PROPERTY(accountId, NSString);
RCT_EXPORT_VIEW_PROPERTY(policyKey, NSString);
RCT_EXPORT_VIEW_PROPERTY(metaData, NSDictionary);

@end
