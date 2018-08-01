//
//  BrightcovePlayer.h
//  OnAppTV
//
//  Created by Chuong Huynh on 2/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <BrightcovePlayerSDK/BrightcovePlayerSDK.h>

@interface BrightcovePlayer : UIView<BCOVPlaybackControllerDelegate, BCOVPUIPlayerViewDelegate>

@property (nonatomic, copy) NSString *videoId;
@property (nonatomic, copy) NSString *accountId;
@property (nonatomic, copy) NSString *policyKey;

- (instancetype)init;
- (void)stop;

@end
