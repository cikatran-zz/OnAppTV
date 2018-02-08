//
//  BrightcovePlayer.m
//  OnAppTV
//
//  Created by Chuong Huynh on 2/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "BrightcovePlayer.h"
#import <BrightcovePlayerSDK/BCOVPlaybackController.h>
#import "CustomVolumeView.h"

@interface BrightcovePlayer() {
  NSString *_videoId;
  NSString *_policyKey;
  NSString *_accountId;
}

@property (nonatomic, strong) BCOVPlaybackService *playbackService;
@property (nonatomic, strong) id<BCOVPlaybackController> playbackController;
@property (nonatomic, strong) BCOVPlayerSDKManager *bCOVSDKManager;
@property (nonatomic, strong) BCOVPUIPlayerView *playerView;
@property (nonatomic) NSTimeInterval currentTime;
@property (nonatomic, strong) NSLayoutConstraint *progressWidth;
@property (nonatomic, strong) NSDictionary *videoProperties;
@property (nonatomic) NSTimeInterval videoDuration;
@property (nonatomic, strong) UILabel *currentTimeLabel;
@property (nonatomic, strong) UILabel *etaTimeLabel;
@property (nonatomic) BOOL isFadeIn;
@property (nonatomic, strong) UIImageView *playheadImageView;
@property (nonatomic) BOOL isDragging;
@property (nonatomic, strong) UIButton* playbackButton;
@property (nonatomic) BOOL isPlaying;
@property (nonatomic) BOOL isPlayingBeforePan;
@property (nonatomic) UIButton *captionButton;
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
    _isDragging = NO;
    
    // Set up player view
    _playerView = [[BCOVPUIPlayerView alloc] initWithPlaybackController:_playbackController options:NULL controlsView:[BCOVPUIBasicControlView basicControlViewWithVODLayout]];
    _playerView.frame = self.bounds;
    _playerView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _playerView.delegate = self;
    _playerView.playbackController = _playbackController;
    //[_playerView.controlsView setAlpha:0];
    [_playbackController setAutoPlay:YES];
    
    [self initBackgroundView];
    [self initProgressView];
    [self initVolumeView];
    [self initPlaybackButton];
    [self initTimeLabel];
    [self initGesture];
    
    _isFadeIn = YES;
    [self addSubview:_playerView];
  }
  return self;
}

- (void)resizeControlsView {
  
  // Remove old constraints
  [_playerView.controlsView removeConstraints:_playerView.controlsView.constraints];
  UIView *superview = _playerView.controlsView.superview;
  while (superview != nil) {
    for (NSLayoutConstraint *c in superview.constraints) {
      if (c.firstItem == self || c.secondItem == self) {
        [superview removeConstraint:c];
      }
    }
    superview = superview.superview;
  }
  
  // Add more constraints
  
}

- (void)initPlaybackButton {
  _playbackButton = [[UIButton alloc] init];
  _playbackButton.translatesAutoresizingMaskIntoConstraints = NO;
  [_playbackButton setImage:[UIImage imageNamed:@"pause"] forState:UIControlStateNormal];
  [_playbackButton.imageView setContentMode:UIViewContentModeScaleAspectFill];
  [_playbackButton.layer setCornerRadius:30];
  [_playbackButton setClipsToBounds:YES];
  [_playbackButton addTarget:self action:@selector(playbackButtonPressed:) forControlEvents:UIControlEventTouchUpInside];
  
  UIBlurEffect * blurEffect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleLight];
  UIVisualEffectView *blurView = [[UIVisualEffectView alloc] initWithEffect:blurEffect];
  blurView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  [_playbackButton insertSubview:blurView belowSubview:_playbackButton.imageView];
  [_playbackButton addConstraint:[NSLayoutConstraint constraintWithItem:_playbackButton
                                                                 attribute:NSLayoutAttributeWidth
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:NULL
                                                                 attribute: NSLayoutAttributeNotAnAttribute
                                                                multiplier:1.0
                                                                  constant:60]];
  [_playbackButton addConstraint:[NSLayoutConstraint constraintWithItem:_playbackButton
                                                                 attribute:NSLayoutAttributeHeight
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:NULL
                                                                 attribute: NSLayoutAttributeNotAnAttribute
                                                                multiplier:1.0
                                                                  constant:60]];
  [_playerView.controlsFadingView insertSubview:_playbackButton belowSubview:_playerView.controlsView];
  [_playerView.controlsFadingView addConstraint:[NSLayoutConstraint constraintWithItem:_playbackButton
                                                              attribute:NSLayoutAttributeCenterX
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:_playerView.controlsFadingView
                                                              attribute: NSLayoutAttributeCenterX
                                                             multiplier:1.0
                                                               constant:0]];
  [_playerView.controlsFadingView addConstraint:[NSLayoutConstraint constraintWithItem:_playbackButton
                                                                             attribute:NSLayoutAttributeCenterY
                                                                             relatedBy:NSLayoutRelationEqual
                                                                                toItem:_playerView.controlsFadingView
                                                                             attribute: NSLayoutAttributeCenterY
                                                                            multiplier:1.0
                                                                              constant:0]];
}

- (void)initGesture {
  UITapGestureRecognizer *singleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTapGesture:)];
  singleTapGesture.numberOfTapsRequired = 1;
  UITapGestureRecognizer *doubleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleDoubleTapGesture:)];
  doubleTapGesture.numberOfTapsRequired = 2;
  [singleTapGesture requireGestureRecognizerToFail:doubleTapGesture];
  
  [_playerView.overlayView addGestureRecognizer:singleTapGesture];
  [_playerView.overlayView addGestureRecognizer:doubleTapGesture];
  
  UIPanGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(handlePanGesture:)];
  [_playerView.controlsFadingView addGestureRecognizer:panGesture];
}

- (void)initBackgroundView {
  
  UIView *backgroundView = [[UIView alloc] init];
  backgroundView.translatesAutoresizingMaskIntoConstraints = NO;
  backgroundView.backgroundColor = [UIColor blackColor];
  backgroundView.alpha = 0.4;
  [_playerView.controlsFadingView insertSubview:backgroundView belowSubview:_playerView.controlsView];

  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:backgroundView
                                                                              attribute:NSLayoutAttributeLeading
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeLeading
                                                                             multiplier:1.0
                                                                               constant:0]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:backgroundView
                                                                              attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeBottom
                                                                             multiplier:1.0
                                                                               constant:0]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:backgroundView
                                                                              attribute:NSLayoutAttributeTop
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeTop
                                                                             multiplier:1.0
                                                                               constant:0]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:backgroundView
                                                                              attribute:NSLayoutAttributeTrailing
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeTrailing
                                                                             multiplier:1.0
                                                                               constant:0]];
}

- (void) initProgressView {
  
  UIView *progressView = [[UIView alloc] init];
  progressView.translatesAutoresizingMaskIntoConstraints = NO;
  progressView.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.7];
  [_playerView.controlsFadingView insertSubview:progressView belowSubview:_playerView.controlsView];
  
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:progressView
                                                                              attribute:NSLayoutAttributeLeading
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeLeading
                                                                             multiplier:1.0
                                                                               constant:0]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:progressView
                                                                              attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeBottom
                                                                             multiplier:1.0
                                                                               constant:0]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:progressView
                                                                              attribute:NSLayoutAttributeTop
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeTop
                                                                             multiplier:1.0
                                                                               constant:0]];
  _progressWidth = [NSLayoutConstraint constraintWithItem:progressView
                                                attribute:NSLayoutAttributeWidth
                                                relatedBy:NSLayoutRelationEqual
                                                   toItem:NULL
                                                attribute: NSLayoutAttributeNotAnAttribute
                                               multiplier:1.0
                                                 constant:0];
  [progressView addConstraint: _progressWidth];
  
  
  // Progress head
  _playheadImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"ProgressHead"]];
  _playheadImageView.translatesAutoresizingMaskIntoConstraints = NO;
  _playheadImageView.userInteractionEnabled = YES;
  progressView.userInteractionEnabled = YES;
  [_playheadImageView setContentMode: UIViewContentModeScaleAspectFit];
  [_playheadImageView addConstraint:[NSLayoutConstraint constraintWithItem:_playheadImageView
                                                            attribute:NSLayoutAttributeWidth
                                                            relatedBy:NSLayoutRelationEqual
                                                               toItem:NULL
                                                            attribute: NSLayoutAttributeNotAnAttribute
                                                           multiplier:1.0
                                                             constant:26]];
  [_playheadImageView addConstraint:[NSLayoutConstraint constraintWithItem:_playheadImageView
                                                            attribute:NSLayoutAttributeHeight
                                                            relatedBy:NSLayoutRelationEqual
                                                               toItem:NULL
                                                            attribute: NSLayoutAttributeNotAnAttribute
                                                           multiplier:1.0
                                                             constant:135]];
  [progressView addSubview:_playheadImageView];
  [progressView addConstraint:[NSLayoutConstraint constraintWithItem:_playheadImageView
                                                           attribute:NSLayoutAttributeCenterY
                                                           relatedBy:NSLayoutRelationEqual
                                                              toItem:progressView
                                                           attribute:NSLayoutAttributeCenterY
                                                          multiplier:1.0
                                                            constant:0]];
  [progressView addConstraint:[NSLayoutConstraint constraintWithItem:_playheadImageView
                                                           attribute:NSLayoutAttributeCenterX
                                                           relatedBy:NSLayoutRelationEqual
                                                              toItem:progressView
                                                           attribute:NSLayoutAttributeTrailing
                                                          multiplier:1.0
                                                            constant:0]];
}

- (void)initTimeLabel {
  
  _currentTimeLabel = [[UILabel alloc] init];
  [_currentTimeLabel setTextColor:[UIColor whiteColor]];
  _currentTimeLabel.translatesAutoresizingMaskIntoConstraints = NO;
  [_playerView.controlsFadingView insertSubview:_currentTimeLabel belowSubview:_playerView.controlsView];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:_currentTimeLabel
                                                                              attribute:NSLayoutAttributeLeading
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeLeading
                                                                             multiplier:1.0
                                                                               constant:25]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:_currentTimeLabel
                                                                              attribute:NSLayoutAttributeCenterY
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeCenterY
                                                                             multiplier:1.0
                                                                               constant:0]];
  
  _etaTimeLabel = [[UILabel alloc] init];
  [_etaTimeLabel setTextColor:[UIColor whiteColor]];
  _etaTimeLabel.translatesAutoresizingMaskIntoConstraints = NO;
  [_playerView.controlsFadingView insertSubview:_etaTimeLabel belowSubview:_playerView.controlsView];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:_etaTimeLabel
                                                                              attribute:NSLayoutAttributeTrailing
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeTrailing
                                                                             multiplier:1.0
                                                                               constant:-25]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:_etaTimeLabel
                                                                              attribute:NSLayoutAttributeCenterY
                                                                              relatedBy:NSLayoutRelationEqual
                                                                                 toItem:_playerView.controlsFadingView
                                                                              attribute:NSLayoutAttributeCenterY
                                                                             multiplier:1.0
                                                                               constant:0]];
}

- (void) initVolumeView {
  // Volume view
  CustomVolumeView *volumeView = [[CustomVolumeView alloc] init];
  volumeView.showsRouteButton = NO;
  volumeView.showsVolumeSlider = YES;
  volumeView.tintColor = [UIColor colorWithRed:1.0 green:45/255 blue:85/255 alpha:1.0];
  [volumeView setVolumeThumbImage:[UIImage imageNamed:@"thumbImage"] forState:UIControlStateNormal];
  [_playerView.controlsFadingView insertSubview:volumeView belowSubview:_playerView.controlsView];
  
  volumeView.translatesAutoresizingMaskIntoConstraints = NO;
  
  // --- Constraints
  [volumeView addConstraint: [NSLayoutConstraint constraintWithItem:volumeView
                                                          attribute:NSLayoutAttributeWidth
                                                          relatedBy:NSLayoutRelationEqual
                                                             toItem:NULL
                                                          attribute: NSLayoutAttributeNotAnAttribute
                                                         multiplier:1.0
                                                           constant:200]];
  [volumeView addConstraint: [NSLayoutConstraint constraintWithItem:volumeView attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:NULL attribute: NSLayoutAttributeNotAnAttribute multiplier:1.0 constant:20]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:volumeView attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:_playerView.controlsFadingView attribute:NSLayoutAttributeLeading multiplier:1.0 constant:50]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:volumeView attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual toItem:_playerView.controlsFadingView attribute:NSLayoutAttributeBottom multiplier:1.0 constant:-30]];
  
  // Volume icon begining
  UIImageView *beginingIcon = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"quieter"]];
  [beginingIcon setContentMode:UIViewContentModeScaleAspectFit];
  beginingIcon.translatesAutoresizingMaskIntoConstraints = NO;
  [_playerView.controlsFadingView insertSubview:beginingIcon belowSubview:_playerView.controlsView];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:beginingIcon attribute:NSLayoutAttributeTrailing relatedBy:NSLayoutRelationEqual toItem:volumeView attribute:NSLayoutAttributeLeading multiplier:1.0 constant:-10]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:beginingIcon attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:volumeView attribute:NSLayoutAttributeTop multiplier:1.0 constant:2]];
  [beginingIcon addConstraint: [NSLayoutConstraint constraintWithItem:beginingIcon attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:NULL attribute: NSLayoutAttributeNotAnAttribute multiplier:1.0 constant:15]];
  [beginingIcon addConstraint: [NSLayoutConstraint constraintWithItem:beginingIcon attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:beginingIcon attribute: NSLayoutAttributeWidth multiplier:1.0 constant:0]];
  
  // Volume end begining
  UIImageView *endIcon = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"louder"]];
  [endIcon setContentMode:UIViewContentModeScaleAspectFit];
  endIcon.translatesAutoresizingMaskIntoConstraints = NO;
  [_playerView.controlsFadingView insertSubview:endIcon belowSubview:_playerView.controlsView];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:endIcon attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:volumeView attribute:NSLayoutAttributeTrailing multiplier:1.0 constant:10]];
  [_playerView.controlsFadingView addConstraint: [NSLayoutConstraint constraintWithItem:endIcon attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:volumeView attribute:NSLayoutAttributeTop multiplier:1.0 constant:-2]];
  [endIcon addConstraint: [NSLayoutConstraint constraintWithItem:endIcon attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:NULL attribute: NSLayoutAttributeNotAnAttribute multiplier:1.0 constant:25]];
  [endIcon addConstraint: [NSLayoutConstraint constraintWithItem:endIcon attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:endIcon attribute: NSLayoutAttributeWidth multiplier:1.0 constant:0]];
  
  // Caption button
  _captionButton = [[UIButton alloc] init];
  _captionButton.translatesAutoresizingMaskIntoConstraints = NO;
  [_captionButton setImage:[UIImage imageNamed:@"caption"] forState:UIControlStateNormal];
  [_playbackButton.imageView setContentMode:UIViewContentModeScaleAspectFill];
  [_playerView.controlsFadingView insertSubview:_captionButton belowSubview:_playerView.controlsView];
  [_playerView.controlsFadingView addConstraint:[NSLayoutConstraint constraintWithItem:_captionButton
                                                                             attribute:NSLayoutAttributeCenterY
                                                                             relatedBy:NSLayoutRelationEqual
                                                                                toItem:endIcon
                                                                             attribute: NSLayoutAttributeCenterY
                                                                            multiplier:1.0
                                                                              constant:0]];
  [_captionButton addConstraint:[NSLayoutConstraint constraintWithItem:_captionButton
                                                                 attribute:NSLayoutAttributeWidth
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:NULL
                                                                 attribute: NSLayoutAttributeNotAnAttribute
                                                                multiplier:1.0
                                                                  constant:50]];
  [_captionButton addConstraint:[NSLayoutConstraint constraintWithItem:_captionButton
                                                                 attribute:NSLayoutAttributeHeight
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:NULL
                                                                 attribute: NSLayoutAttributeNotAnAttribute
                                                                multiplier:1.0
                                                                  constant:50]];
  [_playerView.controlsFadingView addConstraint:[NSLayoutConstraint constraintWithItem:_captionButton
                                                                             attribute:NSLayoutAttributeTrailing
                                                                             relatedBy:NSLayoutRelationEqual
                                                                                toItem:_playerView.controlsFadingView
                                                                             attribute: NSLayoutAttributeTrailing
                                                                            multiplier:1.0
                                                                              constant:-25]];
  [_captionButton addTarget:self action:@selector(captionButtonPressed:) forControlEvents:UIControlEventTouchUpInside];
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
        _videoProperties = video.properties;
        _videoDuration = [_videoProperties[@"duration"] doubleValue]/1000;
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

#pragma mark - tap gesture recognizer

- (void)captionButtonPressed:(id)sender {
  [_playerView.controlsView.closedCaptionButton sendActionsForControlEvents:UIControlEventTouchUpInside];
}

- (void)playbackButtonPressed:(id)sender {
  if (_isPlaying) {
    [_playbackController pause];
  } else {
    [_playbackController play];
  }
}

- (void)handlePanGesture:(UIPanGestureRecognizer *)sender {
  NSLog(@"Pan gesture");
  
  if (sender.state == UIGestureRecognizerStateBegan) {
    [_playbackController pause];
    CGPoint tapLocation = [sender locationInView:_playerView.controlsFadingView];
    CGRect playheadRegion = CGRectMake(_playheadImageView.frame.origin.x - 20, _playheadImageView.frame.origin.y - 20, _playheadImageView.frame.size.width + 40, _playheadImageView.frame.size.height + 40);
    if (CGRectContainsPoint(playheadRegion, tapLocation)) {
      _isDragging = YES;
      _isPlayingBeforePan = _isPlaying;
      [UIView animateWithDuration:0.2 animations:^{
        _playbackButton.alpha = 0;
      }];
    }
  }
  
  if (_isDragging) {
    if (_isFadeIn) {
    CGPoint tapLocation = [sender locationInView:_playerView.controlsFadingView];
    if (tapLocation.x >= 0 && tapLocation.x <= _playerView.controlsFadingView.frame.size.width) {
      NSTimeInterval seekingTime = _videoDuration * (tapLocation.x / _playerView.controlsFadingView.frame.size.width);
      [_progressWidth setConstant: tapLocation.x];
      [self setTimeLabel:seekingTime];
      [_playbackController seekToTime:CMTimeMakeWithSeconds(seekingTime,1) completionHandler:NULL];
    }
    } else {
      [sender setValue:@(UIGestureRecognizerStateEnded) forKey:@"state"];
    }
  }
  
  if (sender.state == UIGestureRecognizerStateEnded) {
    if (_isPlayingBeforePan) {
      [_playbackController play];
    }
    _isDragging = NO;
    [UIView animateWithDuration:0.2 animations:^{
      _playbackButton.alpha = 1.0;
    }];
  }
}

- (void)handleTapGesture:(UITapGestureRecognizer *)sender {
  
  if (sender.state == UIGestureRecognizerStateRecognized && _isFadeIn) {
    CGPoint tapLocation = [sender locationInView:_playerView.controlsFadingView];
    if (_playbackButton.alpha > 0 && CGRectContainsPoint([_playbackButton frame], tapLocation)) {
      [_playbackButton sendActionsForControlEvents:UIControlEventTouchUpInside];
    } else if ([self isInProgressRegion:tapLocation]) {
      double progress = tapLocation.x/_playerView.controlsFadingView.frame.size.width;
      [_playbackController seekToTime:CMTimeMakeWithSeconds(_videoDuration * progress, 1) completionHandler:NULL];
    } else {
    }
  }
}

- (void)handleDoubleTapGesture:(UITapGestureRecognizer *)sender {
  if (sender.state == UIGestureRecognizerStateRecognized) {
    CGPoint tapLocation = [sender locationInView:_playerView.controlsFadingView];
    if ([self isFastForward:tapLocation]) {
      NSLog(@"Fast forward");
      [_playbackController seekToTime:CMTimeMakeWithSeconds((_currentTime + 10 > _videoDuration) ? _videoDuration : _currentTime + 10, 1) completionHandler:NULL];
    } else if ([self isReplay:tapLocation]) {
      NSLog(@"Replay");
      [_playbackController seekToTime:CMTimeMakeWithSeconds(_currentTime - 10, 1) completionHandler:NULL];
    } else {
      NSLog(@"Double click");
    }
  }
}

- (BOOL)isInProgressRegion:(CGPoint)tapLocation {
  CGRect progressRect = CGRectMake(0, _playerView.controlsFadingView.frame.size.height * 0.25, _playerView.controlsFadingView.frame.size.width, _playerView.controlsFadingView.frame.size.height * 0.5);
  return CGRectContainsPoint(progressRect, tapLocation);
}

- (BOOL)isFastForward:(CGPoint)tapLocation {
  CGRect fastForwardRect = CGRectMake(_playerView.controlsFadingView.frame.size.width * 0.75, _playerView.controlsFadingView.frame.size.height * 0.25, _playerView.controlsFadingView.frame.size.width * 0.25, _playerView.controlsFadingView.frame.size.height * 0.5);
  return CGRectContainsPoint(fastForwardRect, tapLocation);
}

- (BOOL)isReplay:(CGPoint)tapLocation {
  CGRect replayRect = CGRectMake(0, _playerView.controlsFadingView.frame.size.height * 0.25, _playerView.controlsFadingView.frame.size.width * 0.25, _playerView.controlsFadingView.frame.size.height * 0.5);
  return CGRectContainsPoint(replayRect, tapLocation);
}

- (void)setTimeLabel:(NSTimeInterval)currentTime {
  
  NSDateComponentsFormatter *formatter = [[NSDateComponentsFormatter alloc] init];
  if (_videoDuration > 3600) {
    formatter.allowedUnits = NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond;
  } else {
    formatter.allowedUnits = NSCalendarUnitMinute | NSCalendarUnitSecond;
  }
  formatter.zeroFormattingBehavior = NSDateComponentsFormatterZeroFormattingBehaviorPad;
  NSString *currentTimeString = [formatter stringFromTimeInterval:currentTime];
  [_currentTimeLabel setText:currentTimeString];
  NSString *etaTimeString = [[NSString alloc] initWithFormat:@"-%@", [formatter stringFromTimeInterval:_videoDuration - currentTime]];
  [_etaTimeLabel setText:etaTimeString];
}

#pragma mark - playback controller delegate
- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didProgressTo:(NSTimeInterval)progress {
  
  NSLog(@"CURENT TIME: %f", progress);
  _currentTime = (progress != INFINITY && progress != -INFINITY) ? progress : _currentTime;
  if (!_isDragging) {
    [_progressWidth setConstant: _playerView.controlsFadingView.frame.size.width * (_currentTime/_videoDuration)];
    [self setTimeLabel:_currentTime];
  }
}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didReceiveLifecycleEvent:(BCOVPlaybackSessionLifecycleEvent *)lifecycleEvent {
  
  if ([lifecycleEvent.eventType isEqualToString:kBCOVPlaybackSessionLifecycleEventPlay]) {
    _isPlaying = YES;
    [_playbackButton setImage:[UIImage imageNamed:@"pause"] forState:UIControlStateNormal];
  }
  
  if ([lifecycleEvent.eventType isEqualToString:kBCOVPlaybackSessionLifecycleEventPause]) {
    _isPlaying = NO;
    [_playbackButton setImage:[UIImage imageNamed:@"play"] forState:UIControlStateNormal];
  }
}

#pragma mark - playview delegate

- (void)playerView:(BCOVPUIPlayerView *)playerView controlsFadingViewDidFadeIn:(UIView *)controlsFadingView {
  _isFadeIn = YES;
}

- (void)playerView:(BCOVPUIPlayerView *)playerView controlsFadingViewDidFadeOut:(UIView *)controlsFadingView {
  _isFadeIn = NO;
}

@end
