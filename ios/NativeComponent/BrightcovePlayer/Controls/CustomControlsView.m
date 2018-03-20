//
//  CustomControlsView.m
//  OnAppTV
//
//  Created by Chuong Huynh on 3/1/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "CustomControlsView.h"
#import "UIView+Extension.h"

@interface CustomControlsView()

@property (strong, nonatomic) IBOutlet UIView *contentView;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *progressWidth;


@end

@implementation CustomControlsView

- (instancetype)init {
  
  self = [super init];
  [self loadNibFrom:@"CustomControlsView" contentView:_contentView];
  return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
  
  self = [super initWithFrame:frame];
  [self loadNibFrom:@"CustomControlsView" contentView:_contentView];
  return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  
  self = [super initWithCoder:aDecoder];
  [self loadNibFrom:@"CustomControlsView" contentView:_contentView];
  return self;
}

@end
