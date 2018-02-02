//
//  RCTBlurViewManager.m
//  OnAppTV
//
//  Created by Chuong Huynh on 2/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTBlurViewManager.h"
#import "BlurView.h"

@implementation RCTBlurViewManager

RCT_EXPORT_MODULE()
- (UIView *)view {
  return [[BlurView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(blurRadius, NSNumber);

@end
