//
//  RNConnectionViewModule.m
//  OnAppTV
//
//  Created by Chuong Huynh on 5/22/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNConnectionViewModule.h"
#import "OnAppTV-Swift.h"


@implementation RNConnectionViewModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    
    return @[@"RefreshConnection"];
}

RCT_EXPORT_METHOD(show) {
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(receiveTestNotification:) name:@"RefreshNotification" object:nil];
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *currentWindow = [[[UIApplication sharedApplication] delegate] window];
        
        ConnectionViewController *vc = [[ConnectionViewController alloc] init];
        [vc setModalPresentationStyle:UIModalPresentationCustom];
        [vc setModalTransitionStyle:UIModalTransitionStyleCrossDissolve];
        
        [currentWindow.rootViewController presentViewController:vc animated:YES completion:nil];
    });
}

- (void) receiveTestNotification:(NSNotification *) notification {
    
    if ([[notification name] isEqualToString:@"RefreshNotification"]) {
        [self sendEventWithName:@"RefreshConnection" body:@{}];
    }
}



@end
