/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <AVFoundation/AVFoundation.h>
#import "Orientation.h"
#import "OnAppTV-Swift.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "BrightcoveViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSURL *jsCodeLocation;
    
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:@"main" fallbackExtension:@"jsbundle"];
    //jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"OnAppTV"
                                                 initialProperties:nil
                                                     launchOptions:launchOptions];
    rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
    
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
    
    // Initialize UserKit
    NSString *token = @"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNWFjMmVhZmVkMGY0NGY0NzRmYWUwMzM3IiwiaWF0IjoxNTIyNzMxNTIyfQ.QquSfGGQNc0PCZppc0deIqIYQaYUh5J0R76bl0ayKjI";
#if STAGING_SERVER
    token = @"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNWFjMmVhZmVkMGY0NGY0NzRmYWUwMzM3IiwiaWF0IjoxNTIyNzIzNTgyfQ.wJcjiZKkm9A4El8Hxr5QcsIExuDh8EOrrr40vNUp7IA";
#endif
    [[UserKitModule sharedInstance] initializeWithToken:token];
    [[UserKitIdentityModule sharedInstance] initializeWithToken:token];
    
    [OANotificationCenter.sharedInstance requestPermissionWithCallback:^{
        
    }];
    
    [application registerForRemoteNotifications];
    
    
    // IQKeyboardManager
    [IQKeyboardManagerObj enable];
    
    [[FBSDKApplicationDelegate sharedInstance] application:application
                             didFinishLaunchingWithOptions:launchOptions];
    return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[UserKitModule sharedInstance] addDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    [OANotificationCenter.sharedInstance receiveNotificationWithUserInfo: userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    [OANotificationCenter.sharedInstance receiveNotificationWithUserInfo: userInfo];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
    return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                          openURL:url
                                                sourceApplication:sourceApplication
                                                       annotation:annotation];
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    UIViewController *presenterViewController = [[window rootViewController] presentedViewController];
    if ([presenterViewController isKindOfClass:[UINavigationController class]]) {
        presenterViewController = [[((UINavigationController *)presenterViewController) topViewController] presentedViewController];
    }
    
    if ([presenterViewController isKindOfClass:[BrightcoveViewController class]]) {
        if ([presenterViewController isBeingDismissed]) {
            return UIInterfaceOrientationMaskPortrait;
        }
        return UIInterfaceOrientationMaskLandscape;
    }
    
    return UIInterfaceOrientationMaskPortrait;
}

@end
