//
//  RCTBlurViewManager.m
//  OnAppTV
//
//  Created by Chuong Huynh on 2/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTBlurViewManager.h"
#import "RCTBlurView.h"

@implementation RCTBlurViewManager

RCT_EXPORT_MODULE()
- (UIView *)view {
  return [[RCTBlurView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(blurRadius, NSNumber);

@end
