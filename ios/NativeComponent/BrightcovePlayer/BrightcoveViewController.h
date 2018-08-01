//
//  BrightcoveViewController.h
//  OnAppTV
//
//  Created by Chuong Huynh on 5/1/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void (^RCTDoneBlock)();
typedef void (^RCTUpdateConsumedLength)(NSNumber *);

@interface BrightcoveViewController : UIViewController

- (void)setBrightcoveWithVideoId: (NSString *)videoId
                       accountId: (NSString *)accountId
                       policyKey: (NSString *)policyKey
                        metaData: (NSDictionary *)metaData
                        playhead: (NSNumber *)playhead
                          onDone: (RCTDoneBlock) doneCallback
          onUpdateConsumedLength: (RCTUpdateConsumedLength)updateConsumedLength;


@end
