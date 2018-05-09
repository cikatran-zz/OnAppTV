//
//  RNControlModalManager.m
//  OnAppTV
//
//  Created by Chuong Huynh on 5/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNControlModalManager.h"
#import "OnAppTV-Swift.h"

@implementation RNControlModalManager

RCT_EXPORT_MODULE()
- (UIView *)view {
    return [[ControlModal alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(index, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(isLive, BOOL);
RCT_EXPORT_VIEW_PROPERTY(items, NSArray);
RCT_EXPORT_VIEW_PROPERTY(onClose, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDetail, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAlert, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onShare, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onIndexChanged, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBookmark, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFavorite, RCTDirectEventBlock)

@end
