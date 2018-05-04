//
//  BrightcoveViewController.m
//  OnAppTV
//
//  Created by Chuong Huynh on 5/1/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "BrightcoveViewController.h"
#import "OnAppTV-Swift.h"

@interface BrightcoveViewController ()
@property (weak, nonatomic) IBOutlet BrightcovePlayer *brightcovePlayer;
@property (strong, nonatomic) NSString *videoId;
@property (strong, nonatomic) NSString *accountId;
@property (strong, nonatomic) NSString *policyKey;
@property (strong, nonatomic) NSDictionary *metaData;
@property RCTDoneBlock doneBlock;

@end

@implementation BrightcoveViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(deviceOrientationDidChange:) name:@"UIDeviceOrientationDidChangeNotification" object:nil];
    _brightcovePlayer.videoId = _videoId;
    _brightcovePlayer.accountId = _accountId;
    _brightcovePlayer.policyKey = _policyKey;
    _brightcovePlayer.metaData = _metaData;
    _brightcovePlayer.onDone = _doneBlock;
}

- (void)viewDidDisappear:(BOOL)animated {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [super viewDidDisappear:animated];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    
    if ([self isBeingDismissed]) {
        return UIInterfaceOrientationMaskPortrait;
    }
    return UIInterfaceOrientationMaskLandscape;
}

- (BOOL)shouldAutorotate {
    return YES;
}

- (void)setBrightcoveWithVideoId:(NSString *)videoId
                       accountId:(NSString *)accountId
                       policyKey:(NSString *)policyKey
                        metaData:(NSDictionary *)metaData
                          onDone:(RCTDoneBlock)doneCallback{
    
    _videoId = videoId;
    _accountId = accountId;
    _policyKey = policyKey;
    _metaData = metaData;
    _doneBlock = doneCallback;
}

- (void)deviceOrientationDidChange:(NSNotification *)notification {
    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    if (orientation == UIDeviceOrientationPortrait) {
        //[[BrightcovePlayerManager sharedInstance] removePlayer];
        [_brightcovePlayer stop];
        [self dismissViewControllerAnimated:YES completion:nil];
    }
}

@end
