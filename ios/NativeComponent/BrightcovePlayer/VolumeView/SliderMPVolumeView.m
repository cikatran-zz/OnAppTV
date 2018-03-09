//
//  CustomMPVolumeView.m
//  OnAppTV
//
//  Created by Chuong Huynh on 2/5/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "SliderMPVolumeView.h"

@implementation SliderMPVolumeView

- (instancetype)init {
  
  self = [super init];
  [self commonInit];
  return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  
  self = [super initWithCoder:aDecoder];
  [self commonInit];
  return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
  
  self = [super initWithFrame:frame];
  [self commonInit];
  return self;
}

- (void)commonInit {
  
  self.showsRouteButton = NO;
  self.showsVolumeSlider = YES;
  self.tintColor = [UIColor colorWithRed:1.0
                                   green:45/255
                                    blue:85/255
                                   alpha:1.0];
  
  [self setVolumeThumbImage:[UIImage imageNamed:@"thumbImage"] forState:UIControlStateNormal];
}

- (CGRect)volumeSliderRectForBounds:(CGRect)bounds {
  return bounds;
}

@end
