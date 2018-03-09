//
//  CustomControlsView.h
//  OnAppTV
//
//  Created by Chuong Huynh on 3/1/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SliderMPVolumeView.h"

@interface CustomControlsView : UIView

@property (weak, nonatomic) IBOutlet UIView *progressView;
@property (nonatomic, strong) UIButton *playbackButton;
@property (nonatomic, strong) SliderMPVolumeView *volumeView;

@end
