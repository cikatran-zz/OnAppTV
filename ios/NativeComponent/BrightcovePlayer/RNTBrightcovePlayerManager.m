//
//  RNTBrightcovePlayerManager.m
//  OnAppTV
//
//  Created by Chuong Huynh on 2/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNTBrightcovePlayerManager.h"
#import "BrightcovePlayer.h"

@interface RNTBrightcovePlayerManager()

@property (nonatomic, strong) BCOVPlaybackService *playbackService;
@property (nonatomic, strong) id<BCOVPlaybackController> playbackController;
@property (nonatomic, strong) BCOVPlayerSDKManager *bCOVSDKManager;
@property (nonatomic, strong) BCOVPUIPlayerView *playerView;

@end

@implementation RNTBrightcovePlayerManager

RCT_EXPORT_MODULE()
- (UIView *)view {
  return [[BrightcovePlayer alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(videoId, NSString);
RCT_EXPORT_VIEW_PROPERTY(accountId, NSString);
RCT_EXPORT_VIEW_PROPERTY(policyKey, NSString);

@end
