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

@end

@implementation BrightcoveViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(deviceOrientationDidChange:) name:@"UIDeviceOrientationDidChangeNotification" object:nil];
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
    
    _brightcovePlayer.videoId = videoId;
    _brightcovePlayer.accountId = accountId;
    _brightcovePlayer.policyKey = policyKey;
    _brightcovePlayer.metaData = metaData;
    _brightcovePlayer.onDone = doneCallback;
}

- (void)deviceOrientationDidChange:(NSNotification *)notification {
    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    if (orientation == UIDeviceOrientationPortrait) {
        [_brightcovePlayer stop];
        [self dismissViewControllerAnimated:YES completion:nil];
    }
}

@end
