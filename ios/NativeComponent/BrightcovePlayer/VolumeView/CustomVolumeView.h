//
//  CustomVolumeView.h
//  OnAppTV
//
//  Created by Chuong Huynh on 3/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SliderMPVolumeView.h"

@interface CustomVolumeView : UIView

@property (weak, nonatomic) IBOutlet SliderMPVolumeView *volumeSlider;
@property (weak, nonatomic) IBOutlet UIImageView *quieterIcon;
@property (weak, nonatomic) IBOutlet UIImageView *louderIcon;

@end
