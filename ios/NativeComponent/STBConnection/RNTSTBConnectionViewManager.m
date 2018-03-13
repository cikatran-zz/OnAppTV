//
//  STBConnectionViewManager.m
//  OnAppTV
//
//  Created by Chuong Huynh on 3/9/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNTSTBConnectionViewManager.h"
#import "OnAppTV-Swift.h"

@implementation RNTSTBConnectionViewManager

RCT_EXPORT_MODULE()
- (UIView *)view {
  return [[STBConnectionView alloc] initWithRctBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(onFinished, RCTDirectEventBlock)

@end
