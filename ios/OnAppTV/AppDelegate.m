/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <AppCenterReactNativeCrashes/AppCenterReactNativeCrashes.h>
#import <AppCenterReactNativeAnalytics/AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNative/AppCenterReactNative.h>
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <AVFoundation/AVFoundation.h>
#import "Orientation.h"
#import "OnAppTV-Swift.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "BrightcoveViewController.h"
#import <STBAPI/STBAPI.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSURL *jsCodeLocation;

  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];  // Initialize AppCenter crashes

  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];  // Initialize AppCenter analytics

  [AppCenterReactNative register];  // Initialize AppCenter
    application.statusBarStyle = UIStatusBarStyleLightContent;
    
    
    #ifdef DEBUG
        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:@"main" fallbackExtension:@"jsbundle"];
    #else
        jsCodeLocation = [CodePush bundleURL];
    #endif
    //jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    
    _reactNativeView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"OnAppTV"
                                                 initialProperties:nil
                                                     launchOptions:launchOptions];
    _reactNativeView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
    
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    
    BOOL isStarted = [NSUserDefaults.standardUserDefaults boolForKey:@"isStarted"];
    if (isStarted) {
        UIViewController *rootViewController = [UIViewController new];
        rootViewController.view = _reactNativeView;
        rootViewController.view.backgroundColor = [[UIColor alloc] initWithRed:255.0/255 green:45.0/255 blue:85.0/255 alpha:1.0];
        
        UIView *backgroundView = [[UIView alloc] initWithFrame:CGRectZero];
        backgroundView.translatesAutoresizingMaskIntoConstraints = YES;
        backgroundView.backgroundColor = [[UIColor alloc] initWithRed:255.0/255 green:45.0/255 blue:85.0/255 alpha:1.0];
        UIImageView *imageView = [[UIImageView alloc] initWithImage: [UIImage imageNamed:@"ic_onapp_logo"] ];
        imageView.translatesAutoresizingMaskIntoConstraints = NO;
        [backgroundView addSubview:imageView];
        [backgroundView addConstraint: [NSLayoutConstraint constraintWithItem:backgroundView attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:imageView attribute:NSLayoutAttributeCenterX multiplier:1.0 constant:0]];
        [backgroundView addConstraint: [NSLayoutConstraint constraintWithItem:backgroundView attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:imageView attribute:NSLayoutAttributeCenterY multiplier:1.0 constant:0]];
        backgroundView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        #ifdef DEBUG
        #else
        [rootViewController.view insertSubview:backgroundView atIndex:0];
        #endif
        
        self.window.rootViewController = rootViewController;
    } else {
        [NSUserDefaults.standardUserDefaults setBool:YES forKey:@"isStarted"];
        [OpenSoftwareUpdateVC.sharedInstance openWithWindow:self.window];
    }
    
    
    
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
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        while (YES) {
            [NSThread sleepForTimeInterval:20.0];
            [NSNotificationCenter.defaultCenter postNotificationName:@"onapp.controlmodal.progressUpdate" object:NULL];
        }
    });
    
    if (_serialQueue == NULL) {
        _serialQueue = dispatch_queue_create("onapp.controlmodal.progressQueue", DISPATCH_QUEUE_SERIAL);
    }
    
    dispatch_async(_serialQueue, ^{
        [self postUpdateProgressMessage];
    });
    
    return YES;
}

- (void) postUpdateProgressMessage {
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    CFAbsoluteTime start = CFAbsoluteTimeGetCurrent();
    if ([[Api sharedApi] hIG_IsConnect]) {
        [[Api sharedApi] hIG_GetSTBStatusAndCallback:^(BOOL isSuccess, NSMutableArray *statuses, int lCN, NSString *infoName) {
            if (isSuccess) {
                BOOL isPlayMedia = NO;
                for (int i = 0; i < [statuses count]; i++) {
                    NSString *status = (NSString *)[statuses objectAtIndex:i];
                    if ([status isEqual: @"PLAY_MEDIA"]) {
                        isPlayMedia = YES;
                        break;
                    }
                }
                if (isPlayMedia) {
                    [[Api sharedApi] hIG_PlayMediaGetPosition:^(BOOL isSuccess, int value) {
                        NSLog(@"PLAY POSITION", value);
                        [NSNotificationCenter.defaultCenter postNotificationName:@"onapp.controlmodal.VODprogress" object: @{@"isSuccess": [[NSNumber alloc] initWithBool:isSuccess], @"value": [[NSNumber alloc] initWithInt:value] }];
                        dispatch_semaphore_signal(semaphore);
                    }];
                } else {
                    dispatch_semaphore_signal(semaphore);
                }
            } else {
                dispatch_semaphore_signal(semaphore);
            }
        }];
    } else {
        dispatch_semaphore_signal(semaphore);
    }
    
    dispatch_semaphore_wait(semaphore, dispatch_time(DISPATCH_TIME_NOW, 2000000000));
    if (CFAbsoluteTimeGetCurrent() - start < 2) {
        [NSThread sleepForTimeInterval:2];
    }
    dispatch_async(_serialQueue, ^{
        [self postUpdateProgressMessage];
    });
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
