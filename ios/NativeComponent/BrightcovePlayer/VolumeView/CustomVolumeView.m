//
//  CustomVolumeView.m
//  OnAppTV
//
//  Created by Chuong Huynh on 3/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "CustomVolumeView.h"
#import "UIView+Extension.h"

@interface CustomVolumeView()

@property (strong, nonatomic) IBOutlet UIView *contentView;

@end

@implementation CustomVolumeView

- (instancetype)init {
  self = [super init];
  return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
  
  self = [super initWithFrame:frame];
  [self commonInit];
  return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  [self commonInit];
  return self;
}

- (void)commonInit {
  
  [[NSBundle mainBundle] loadNibNamed:@"CustomVolumeView" owner:self options:nil];
  [self addSubview:_contentView];
  _contentView.frame = self.bounds;
  _contentView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
}

@end
