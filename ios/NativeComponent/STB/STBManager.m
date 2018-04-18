//
//  STBManager.m
//  OnAppTV
//
//  Created by Chuong Huynh on 3/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "STBManager.h"
#import <STBAPI/Api.h>

@implementation STBManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(udpOperation) {
    [Api.sharedApi hIG_UdpOperation];
}

RCT_EXPORT_METHOD(getCurrentSTBInfoInJson: (RCTResponseSenderBlock)callback) {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    dict[@"STBID"] = [Api.sharedApi.currentSTBInfo sTBID];
    dict[@"OUI"] = [Api.sharedApi.currentSTBInfo oUI];
    dict[@"hardwareVersion"] = [[NSNumber alloc] initWithInt:[Api.sharedApi.currentSTBInfo hardwareVersion]];
    dict[@"softwareVersion"] = [[NSNumber alloc] initWithInt:[Api.sharedApi.currentSTBInfo softwareVersion]];
    dict[@"loaderVersion"] = [[NSNumber alloc] initWithInt:[Api.sharedApi.currentSTBInfo loaderVersion]];
    dict[@"IPAddress"] = [Api.sharedApi.currentSTBInfo iPAddress];
    
    callback(@[[NSNull null], @[dict]]);
}

RCT_EXPORT_METHOD(isConnect: (RCTResponseSenderBlock)callback) {
    NSMutableString *isConnected = [[NSMutableString alloc] initWithString: @"{\"is_connected\": false}"];
    if ([Api.sharedApi hIG_IsConnect]) {
        [isConnected setString:@"{\"is_connected\": true}"];
    }
    callback(@[isConnected]);
}

RCT_EXPORT_METHOD(udpReceiveMessageInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_UdpReceiveMessageInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(undiscoveredSTBListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_UndiscoveredSTBListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(disconnectAll) {
    [Api.sharedApi hIG_DisconnectAll];
}

RCT_EXPORT_METHOD(connectSTBWithJsonString: (NSString *)json callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ConnectSTBWithJsonString:json callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(disconnectAndCallback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_DisconnectAndCallback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(disconnectInJsonAndCallback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_DisconnectInJsonAndCallback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(disconnectInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_DisconnectInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(parseXMLInJsonWithPath: (NSString *)path callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ParseXMLInJsonWithPath:path callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(parseXMLLastInJsonWithPath: (NSString *)path callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ParseXMLLastInJsonWithPath:path callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setDataBaseWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetDataBaseWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getDatabaseAndCallbackInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetDatabaseAndCallbackInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getSatelliteListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetSatelliteListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setContext) {
    
}

RCT_EXPORT_METHOD(setSatelliteWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetSatelliteWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getServiceListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetServiceListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setServiceListWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetServiceWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getZapServiceListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetZapServiceListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getFavoriteServiceListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetFavoriteServiceListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setServiceWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetServiceWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setSTBConfigureWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetSTBConfigureWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getSTBConfigureInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetSTBConfigureInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setZapWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetZapWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setVolumeWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetVolumeWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getVolumeInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetVolumeInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setAspectRatioWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetAspectRatioWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getAspectRatioInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetAspectRatioInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setResolutionWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetResolutionWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getResolutionInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetResolutionInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setVideoStandardWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetVideoStandardWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getVideoStandardInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetVideoStandardInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setDigitalAudioWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetDigitalAudioWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getDigitalAudioFormatInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetDigitalAudioFormatInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setCountryWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetCountryWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getCountryInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetCountryInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setCountryCodeIndexWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetCountryCodeIndexWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getCountryCodeIndexInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetCountryCodeIndexInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setOSDLanguageWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetOSDLanguageWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getOSDLanguageCodeIndexInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetOSDLanguageCodeIndexInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setPreferSubtitleLanguageWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetPreferSubtitleLanguageWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getPreferSubtitleLanguageInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetPreferSubtitleLanguageInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setSubtitleLanguageCodeIndexWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetSubtitleLanguageCodeIndexWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getSubtitleLanguageCodeIndexInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetSubtitleLanguageCodeIndexInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setPreferAudioLanguageWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetPreferAudioLanguageWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setPreferAudioLanguage: (NSString *)language callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetPreferAudioLanguage:language callback:^(BOOL isSuccess, NSString *error) {
        NSMutableString *string = [[NSMutableString alloc] init];
        if (isSuccess) {
            [string setString:@"{\"success\": 1}"];
        } else {
            [string setString:[[NSString alloc] initWithFormat:@"{\"success\": 1, \"error\": \"%@\"}", error]];
        }
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getPreferAudioLanguageInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetPreferAudioLanguageInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setAudioLanguageCodeIndexWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetAudioLanguageCodeIndexWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getAudioLanguageCodeIndexInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetAudioLanguageCodeIndexInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setAudioDescriptionWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetAudioDescriptionWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getAudioDescriptionInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetAudioDescriptionInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setParentalGuideRatingWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetParentalGuideRatingWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getParentalGuideRatingInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetParentalGuideRatingInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setTimeshiftLimitSizeWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetTimeshiftLimitSizeWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getTimeshiftLimitSizeInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetTimeshiftLimitSizeInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(setFeTunWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetFeTunWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getSignalCallbackInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetSignalCallbackInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getSignalAfterSetFeTunWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetSignalAfterSetFeTunWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(resetDataSourceAndCallbackInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ResetDataSourceAndCallbackInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(resetConfigureAndCallbackInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ResetConfigureAndCallbackInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getSTBPINInJson: (RCTResponseSenderBlock)callback) {
    NSArray *events = [[NSArray alloc] initWithObjects: [Api.sharedApi hIG_GetSTBPINInJson], nil];
    callback(@[[NSNull null], events]);
}

RCT_EXPORT_METHOD(resetSTBPINWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ResetSTBPINWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(checkSTBPINWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_CheckSTBPINWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getSubtitleListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetSubtitleListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getSubtitleInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetSubtitleInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setSubtitleWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetSubtitleWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getAudioListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetAudioListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getAudioInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetAudioInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setAudioWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetAudioWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getUSBDisksInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetUSBDisksInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(readUSBDirWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ReadUSBDirWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setUSBFormatPartitionWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetUSBFormatPartitionWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(receiverNotifyEventInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ReceiverNotifyEventInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setPvrPathWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetPvrPathWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getPvrRecordPathInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetPvrRecordPathInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(recordPvrStartWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_RecordPvrStartWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(recordPvrStopInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_RecordPvrStopInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playPvrStartWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayPvrStartWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playPvrStopInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayPvrStopInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playPvrPauseInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayPvrPauseInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playPvrResumeInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayPvrResumeInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playPvrSetPositionWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayPvrSetPositionWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playPvrGetPositionInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayPvrGetPositionInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playPvrSetSpeedWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayPvrSetSpeedWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playPvrGetSpeedInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayPvrGetSpeedInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getPvrListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetPvrListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getPvrInfoWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetPvrInfoWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(deletePvrWithJsonString: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_DeletePvrWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playMediaStartWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayMediaStartWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playMediaStop: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayMediaStopInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playMediaPause: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayMediaPauseInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playMediaResume: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayMediaResumeInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playMediaSetPositionWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayMediaSetPositionWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playMediaGetPositionInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayMediaGetPositionInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playMediaSetSpeedWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayMediaSetSpeedWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playMediaGetSpeedInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayMediaGetSpeedInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getMediaInfoInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetMediaInfoInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setMediaAudioWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetMediaAudioWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getMediaAudioInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetMediaAudioInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(readMusicDirWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ReadMusicDirWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(readPhotoDirWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ReadPhotoDirWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(readMovieDirWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ReadMovieDirWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(readMediaDirWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_ReadMediaDirWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(stbStandby) {
    [Api.sharedApi hIG_STBStandby];
}

RCT_EXPORT_METHOD(getSTBStatus: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetSTBStatusInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(mediaDownloadStartWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_MediaDownloadStartWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(mediaDownloadStopWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_MediaDownloadStopWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(mediaDownloadGetProgressWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_MediaDownloadGetProgressWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(usbMakeDirectoryWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_USBMakeDirectoryWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(usbCopyWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_USBCopyWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(usbRemoveWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_USBRemoveWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(usbRenameWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_USBRenameWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getMobileWifiInfoInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetMobileWifiInfoInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(stbWlanAPWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_STBWlanAPWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(setPvrBookListWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_SetPvrBookListWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(getPvrBookListInJson: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_GetPvrBookListInJson:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(addPvrBooKListWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_AddPvrBookListWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(deletePvrBookWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_DeletePvrWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(stbSetPushAVStreamWithEnableWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_STBSetPushAVStreamWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(stbUpgradeSoftwareWIthJson: (NSString *)jsonString) {
    [Api.sharedApi hIG_STBUpgradeSoftwareWithJsonString:jsonString];
}

RCT_EXPORT_METHOD(switchCodeStream: (BOOL)isSwitch callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_switchCodeStream:isSwitch callback:^(BOOL isSuccess, NSString *error) {
        NSArray *events = [[NSArray alloc] initWithObjects: error, nil];
        callback(@[[NSNull null], events]);
    }];
}

RCT_EXPORT_METHOD(playVideoWithJson: (NSString *)jsonString callback: (RCTResponseSenderBlock)callback) {
    [Api.sharedApi hIG_PlayVideoWithJsonString:jsonString callback:^(NSString *string) {
        NSArray *events = [[NSArray alloc] initWithObjects: string, nil];
        callback(@[[NSNull null], events]);
    }];
}

@end
