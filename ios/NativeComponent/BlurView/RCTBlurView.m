//
//  BlurView.m
//  OnAppTV
//
//  Created by Chuong Huynh on 2/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTBlurView.h"

@interface RCTBlurView()

@property (nonatomic, copy) UIBlurEffect *blurEffect;

@end

@implementation RCTBlurView

- (instancetype)init
{
  Class customBlurClass = NSClassFromString(@"_UICustomBlurEffect");
  
  _blurEffect = (UIBlurEffect *)[[customBlurClass alloc] init];
  [_blurEffect setValue:@1.0 forKey:@"scale"];
  [_blurEffect setValue:@0 forKey:@"blurRadius"];
  self = [super initWithEffect:_blurEffect];
  return self;
}

- (void)setBlurRadius:(NSNumber *)blurRadius {
  
  [_blurEffect setValue:blurRadius forKey:@"blurRadius"];
  self.effect = _blurEffect;
}

@end
