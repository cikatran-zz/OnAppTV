//
//  BrightcovePlayer.m
//  OnAppTV
//
//  Created by Chuong Huynh on 2/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "BrightcovePlayer.h"
#import <BrightcovePlayerSDK/BCOVPlaybackController.h>

@interface BrightcovePlayer() {
  NSString *_videoId;
  NSString *_policyKey;
  NSString *_accountId;
}

@property (nonatomic, strong) BCOVPlaybackService *playbackService;
@property (nonatomic, strong) id<BCOVPlaybackController> playbackController;
@property (nonatomic, strong) BCOVPlayerSDKManager *bCOVSDKManager;
@property (nonatomic, strong) BCOVPUIPlayerView *playerView;

@end

@implementation BrightcovePlayer

- (instancetype)init {
  self = [super init];
  if (self) {
    
    // Setup playback controller
    _bCOVSDKManager = [BCOVPlayerSDKManager sharedManager];
    _playbackController = [_bCOVSDKManager createPlaybackController];
    _playbackController.delegate = self;
    [_playbackController setAutoAdvance:YES];
    [_playbackController setAutoPlay:NO];
    
    // Set up player view
    _playerView = [[BCOVPUIPlayerView alloc] initWithPlaybackController:_playbackController options:NULL controlsView:[BCOVPUIBasicControlView basicControlViewWithVODLayout]];
    _playerView.frame = self.bounds;
    _playerView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _playerView.delegate = self;
    _playerView.playbackController = _playbackController;
    [_playerView.controlsView.screenModeButton setHidden:YES];
    
    [self addSubview:_playerView];
  }
  return self;
}

- (void)drawRect:(CGRect)rect {
  [super drawRect:rect];
  [_playerView performScreenTransitionWithScreenMode:BCOVPUIScreenModeFull];
}

- (void)requestVideo {
  if (_playbackService && _videoId) {
    [_playbackService findVideoWithVideoID:_videoId parameters:NULL completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
      if (video) {
        [_playbackController setVideos:@[video]];
      } else {
        NSLog(@"Error retrieving video: %@", error.localizedDescription);
      }
    }];
  }
}

- (void)setVideoId:(NSString *)videoId {
  _videoId = videoId;
  [self requestVideo];
}

- (void)setAccountId:(NSString *)accountId {
  _accountId = accountId;
  if (_policyKey) {
    _playbackService = [[BCOVPlaybackService alloc] initWithAccountId:_accountId policyKey:_policyKey];
    [self requestVideo];
  }
}

- (void)setPolicyKey:(NSString *)policyKey {
  _policyKey = policyKey;
  if (_accountId) {
    _playbackService = [[BCOVPlaybackService alloc] initWithAccountId:_accountId policyKey:_policyKey];
    [self requestVideo];
  }
}

@end
