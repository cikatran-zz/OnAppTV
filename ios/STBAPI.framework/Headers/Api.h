//
//  Api.h
//  TabletSTB
//
//  Created by 沈凯 on 2017/2/22.
//  Copyright © 2017年 沈凯. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DatabaseModel.h"
/**
 LNB Type
 */
typedef NS_ENUM(NSInteger, HIG_LNBType)
{
//    LNB Type类型为C
    HIG_LNBTYPE_C    ,
//    LNB Type类型为KU
    HIG_LNBTYPE_KU   ,
//    LNB Type类型为2LOF
    HIG_LNBTYPE_2LOF ,
};
/**
 LNB Power
 */
typedef NS_ENUM(NSInteger, HIG_LNBPower)
{
//    LNB Power为OFF
    HIG_LNBPOWER_OFF ,
//    LNB Power为13V
    HIG_LNBPOWER_13V ,
//    LNB Power为18V
    HIG_LNBPOWER_18V ,
//    LNB Power为14V
    HIG_LNBPOWER_14V ,
//    LNB Power为19V
    HIG_LNBPOWER_19V ,
//    LNB Power为Auto
    HIG_LNBPOWER_AUTO
};
/**
 DiSEqC Level
 */
typedef NS_ENUM(NSInteger, HIG_DiSEqCLevel)
{
//    DiSEqC为OFF
    HIG_LDISEQCLevel_OFF ,
//    DiSEqC为1.0
    HIG_LDISEQCLevel_DISEQC10 ,
//    DiSEqC为1.1
    HIG_LDISEQCLevel_DISEQC11 ,
//    DiSEqC为1.2
    HIG_LDISEQCLevel_DISEQC12 ,
//    DiSEqC为USALS
    HIG_LDISEQCLevel_USALS ,
//    DiSEqC为MULTI
    HIG_LDISEQCLevel_MULTI
};
/**
 DiSEqC 1.0
 */
typedef NS_ENUM(NSInteger, HIG_DiSEqC10)
{
//    DiSEqC1.0端口为OFF
    HIG_DISEQC10_OFF ,
//    DiSEqC1.0端口为1
    HIG_DISEQC10_PORT1 ,
//    DiSEqC1.0端口为2
    HIG_DISEQC10_PORT2 ,
//    DiSEqC1.0端口为3
    HIG_DISEQC10_PORT3 ,
//    DiSEqC1.0端口为4
    HIG_DISEQC10_PORT4
};
/**
 DiSEqC 1.1
 */
typedef NS_ENUM(NSInteger, HIG_DiSEqC11)
{
//    DiSEqC1.1端口为OFF
    HIG_DISEQC11_OFF  ,
//    DiSEqC1.1端口为1
    HIG_DISEQC11_PORT1 ,
//    DiSEqC1.1端口为2
    HIG_DISEQC11_PORT2 ,
//    DiSEqC1.1端口为3
    HIG_DISEQC11_PORT3 ,
//    DiSEqC1.1端口为4
    HIG_DISEQC11_PORT4 ,
//    DiSEqC1.1端口为5
    HIG_DISEQC11_PORT5 ,
//    DiSEqC1.1端口为6
    HIG_DISEQC11_PORT6 ,
//    DiSEqC1.1端口为7
    HIG_DISEQC11_PORT7 ,
//    DiSEqC1.1端口为8
    HIG_DISEQC11_PORT8 ,
//    DiSEqC1.1端口为9
    HIG_DISEQC11_PORT9 ,
//    DiSEqC1.1端口为10
    HIG_DISEQC11_PORT10,
//    DiSEqC1.1端口为11
    HIG_DISEQC11_LPORT11,
//    DiSEqC1.1端口为12
    HIG_DISEQC11_PORT12,
//    DiSEqC1.1端口为13
    HIG_DISEQC11_PORT13,
//    DiSEqC1.1端口为14
    HIG_DISEQC11_PORT14,
//    DiSEqC1.1端口为15
    HIG_DISEQC11_PORT15,
//    DiSEqC1.1端口为16
    HIG_DISEQC11_PORT16,
};
/**
 DiSEqC 1.2
 */
typedef NS_ENUM(NSInteger, HIG_DiSEqC12)
{
//    DiSEqC1.2端口为Default
    HIG_DISEQC12_DEFAULT
};
/**
 USALS
 */
typedef NS_ENUM(NSInteger, HIG_USALS)
{
//    USALS端口为Default
    HIG_USALS_DEFAULT
};
/**
 Tone Burst
 */
typedef NS_ENUM(NSInteger, HIG_ToneBurst)
{
//    Tone Burst为OFF
    HIG_TONEBURST_OFF   ,
//    Tone Burst为Burst A
    HIG_TONEBURST_BURSTA,
//    Tone Burst为Burst B
    HIG_TONEBURST_BURSTB
};
/**
 22kHz
 */
typedef NS_ENUM(NSInteger, HIG_LNBValue)
{
//    22kHz为OFF
    HIG_LNBVAlUE_OFF ,
//    22kHz为ON
    HIG_LNBVAlUE_ON  ,
//    22kHz为AUTO
    HIG_LTLNBVAlUE_AUTO
};
/**
 Polarization
 */
typedef NS_ENUM(NSInteger, HIG_Polarization)
{
//    Polarization为HORIZONTAL
    HIG_POlARIZATION_HORIZONTAL ,
//    Polarization为VERTICAL
    HIG_POlARIZATION_VERTICAL   ,
//    Polarization为LEFT
    HIG_POlARIZATION_LEFT       ,
//    Polarization为RIGHT
    HIG_POlARIZATION_RIGHT
};
/**
 Service Type
 */
typedef NS_ENUM(NSInteger, HIG_ServiceType)
{
//    Service Type为TV
    HIG_SERVICETYPE_TV         = 0x01,
//    Service Type为Radio
    HIG_SERVICETYPE_RADIO      = 0x02,
//    Service Type为AVC Digital Radio
    HIG_SERVICETYPE_AVCRADIO   = 0x0A,
//    Service Type为MPEG-2 HD TV
    HIG_SERVICETYPE_MPEG2HDTV  = 0x11,
//    Service Type为AAC Audio
    HIG_SERVICETYPE_AACAUDIO   = 0x14,
//    Service Type为AAC V2 Audio
    HIG_SERVICETYPE_AACV2AUDIO = 0x15,
//    Service Type为AVC SD TV
    HIG_SERVICETYPE_AVCSDTV    = 0x16,
//    Service Type为AVC HD TV
    HIG_SERVICETYPE_AVCHDTV    = 0x19
};
/**
 Aspect Ratio
 */
typedef NS_ENUM(NSInteger, HIG_AspectRatio)
{
//    Aspect Ratio为4:3的Letter Box
    HIG_ASPECTRATIO_43LETTERBOX    ,
//    Aspect Ratio为4:3的Center Cut Out (Pan&Scan)
    HIG_ASPECTRATIO_43CENTERCUTOUT ,
//    Aspect Ratio为4:3的Extended
    HIG_ASPECTRATIO_43EXTENDED     ,
//    Aspect Ratio为16:9的Pillar Box
    HIG_ASPECTRATIO_169PILLARBOX   ,
//    Aspect Ratio为16:9的Full Screen
    HIG_ASPECTRATIO_169FULLSCREEN  ,
//    Aspect Ratio为16:9的Extended
    HIG_ASPECTRATIO_169EXTENDED
};
/**
 Resolution
 */
typedef NS_ENUM(NSInteger, HIG_Resolution)
{
//    Resolution为1080P
    HIG_RESOLUTION_1080P ,
//    Resolution为1080I
    HIG_RESOLUTION_1080I ,
//    Resolution为720P
    HIG_RESOLUTION_720P  ,
//    Resolution为576P
    HIG_RESOLUTION_576P  ,
//    Resolution为576I
    HIG_RESOLUTION_576I
};
/**
 Video Standard
 */
typedef NS_ENUM(NSInteger, HIG_VideoStandard)
{
//    Video Standard为PAL
    HIG_VIDEOSTANDARD_PAL   ,
//    Video Standard为NTSC
    HIG_VIDEOSTANDARD_NTSC  ,
//    Video Standard为SECAM
    HIG_VIDEOSTANDARD_SECAM ,
//    Video Standard为SVHS
    HIG_VIDEOSTANDARD_SVHS
};
/**
 Digital Audio
 */
typedef NS_ENUM(NSInteger, HIG_DigitalAudio)
{
//    Digital Audio类型为PCM
    HIG_DIGITALAUDIOD_PCM         ,
//    Digital Audio类型为Encoded
    HIG_DIGITALAUDIOD_ENCODED     ,
//    Digital Audio类型为Pass Through
    HIG_DIGITALAUDIOD_PASSTHROUGH
};
/**
 Subtitle_type
 */
typedef NS_ENUM(NSInteger, HIG_Subtitle_Type)
{
//    Subtitle_type类型为DVB Normal
    HIG_SUBTITLE_TYPE_DVBNORMAL          ,
//    Subtitle_type类型为DVB Hearing Impaired
    HIG_SUBTITLE_TYPE_DVBHEARINGIMPAIRED ,
//    Subtitle_type类型为EBU Normal
    HIG_SUBTITLE_TYPE_EBUNORMAL          ,
//    Subtitle_type类型为EBU Hearing Impaired
    HIG_SUBTITLE_TYPE_EBUHEARINGIMPAIREDL
};
/**
 Audio_type
 */
typedef NS_ENUM(NSInteger, HIG_Audio_type)
{
//    Audio_type类型为Undefined
    HIG_AUDIO_TYPE_UNDEFINED       ,
//    Audio_type类型为Clean Effects
    HIG_AUDIO_TYPE_CLEANEFFECTS    ,
//    Audio_type类型为Hearing Impaired
    HIG_AUDIO_TYPE_HEARINGIMPAIRED ,
//    Audio_type类型为Audio Description
    HIG_AUDIO_TYPE_AUDIODESCRIPTION
};
/**
 Es_type
 */
typedef NS_ENUM(NSInteger, HIG_Es_type)
{
//    Es_type类型为MPEG1 Video
    HIG_ES_TYPE_MPEG1VIDEO             = 0X01 ,
//    Es_type类型为MPEG2 Video
    HIG_ES_TYPE_MPEG2VIDEO             = 0X02 ,
//    Es_type类型为MPEG4 Video
    HIG_ES_TYPE_MPEG4VIDEO             = 0X10 ,
//    Es_type类型为AVCH264 Video
    HIG_ES_TYPE_AVCH264VIDEO           = 0X1B ,
//    Es_type类型为HEVC Video
    HIG_ES_TYPE_HEVCVIDEO              = 0X24 ,
//    Es_type类型为AVS Video
    HIG_ES_TYPE_AVSVIDEO               = 0X42 ,
//    Es_type类型为MPEG1 Audio
    HIG_ES_TYPE_MPEG1AUDIO             = 0X03 ,
//    Es_type类型为MPEG2 Audio
    HIG_ES_TYPE_MPEG2AUDIO             = 0X04 ,
//    Es_type类型为AAC Audio
    HIG_ES_TYPE_AACAUDIO               = 0X0F ,
//    Es_type类型为HEAAC Audio
    HIG_ES_TYPE_HEAACAUDIO             = 0X11 ,
//    Es_type类型为DDPLUS Audio
    HIG_ES_TYPE_DDPLUSAUDIO            = 0X12 ,
//    Es_type类型为AVS Audio
    HIG_ES_TYPE_AVSAUDIO               = 0X43 ,
//    Es_type类型为AC3 Audio
    HIG_ES_TYPE_AC3AUDIO               = 0X81 ,
//    Es_type类型为MPEG1 Audio Description
    HIG_ES_TYPE_MPEG1AUDIODESCRIPTION  = 0XE5 ,
//    Es_type类型为MPEG2 Audio Description
    HIG_ES_TYPE_MPEG2AUDIODESCRIPTION  = 0XE6 ,
//    Es_type类型为AC3 Audio Description
    HIG_ES_TYPE_AC3AUDIODESCRIPTION    = 0XE7 ,
//    Es_type类型为DDPLUS Audio Description
    HIG_ES_TYPE_DDPLUSAUDIODESCRIPTION = 0XE8 ,
//    Es_type类型为AAC Audio Description
    HIG_ES_TYPE_AACAUDIODESCRIPTION    = 0XE9 ,
//    Es_type类型为HEAAC Audio Description
    HIG_ES_TYPE_HEAACAUDIODESCRIPTION  = 0XEA
};
typedef NS_ENUM(NSInteger, HIG_Soundtrack)
{
//    Soundtrack类型为LEFT
    HIG_SOUNDTRACK_LEFT ,
//    Soundtrack类型为RIGHT
    HIG_SOUNDTRACK_RIGHT ,
//    Soundtrack类型为STEREO
    HIG_SOUNDTRACK_STEREO ,
//    Soundtrack类型为MONO
    HIG_SOUNDTRACK_MONO
};
typedef NS_ENUM(NSInteger, HIG_File_system_type)
{
//    File_system_type类型为FAT16
    HIG_FILE_SYSTEM_TYPE_FAT16 ,
//    File_system_type类型为FAT32
    HIG_FILE_SYSTEM_TYPE_FAT32 ,
//    File_system_type类型为NTFS
    HIG_FILE_SYSTEM_TYPE_NTFS  ,
//    File_system_type类型为EXT2
    HIG_FILE_SYSTEM_TYPE_EXT2  ,
//    File_system_type类型为EXT3
    HIG_FILE_SYSTEM_TYPE_EXT3  ,
//    File_system_type类型为EXT4
    HIG_FILE_SYSTEM_TYPE_EXT4
};
typedef NS_ENUM(NSInteger, HIG_File_type)
{
//    File_type为Directory
    HIG_FILE_DIRECTORY ,
//    File_type为File
    HIG_FILE_FILE
};
typedef NS_ENUM(NSInteger, HIG_Notify_event)
{
//    Notify_event类型为USB Plug
    HIG_NOTIFY_EVENT_USB_PLUG        ,
//    Notify_event类型为USB Unplug
    HIG_NOTIFY_EVENT_USB_UNPLUG      ,
//    Notify_event类型为Signal Lock
    HIG_NOTIFY_EVENT_SIGNAL_LOCK     ,
//    Notify_event类型为Signal Lost
    HIG_NOTIFY_EVENT_SIGNAL_LOST     ,
//    Notify_event类型为Parental Rating
    HIG_NOTIFY_EVENT_PARENTAL_RATING ,
//    Notify_event类型为Maturity
    HIG_NOTIFY_EVENT_MATURITY        ,
//    Notify_event类型为Record Start
    HIG_NOTIFY_EVENT_RECORD_START    ,
//    Notify_event类型为Record Stop
    HIG_NOTIFY_EVENT_RECORD_STOP     ,
//    Notify_event类型为Play Start
    HIG_NOTIFY_EVENT_PLAY_START      ,
//    Notify_event类型为Play Stop
    HIG_NOTIFY_EVENT_PLAY_STOP
};
typedef NS_ENUM(NSInteger, HIG_Notify_event_Record_Stop)
{
//    Notify_event的Record Stop的类型为Normal Stop
    HIG_NOTIFY_EVENT_RECORD_STOP_NORMALSTOP  ,
//    Notify_event的Record Stop的类型为Disk Full
    HIG_NOTIFY_EVENT_RECORD_STOP_DISKFULL    ,
//    Notify_event的Record Stop的类型为Record Error
    HIG_NOTIFY_EVENT_RECORD_STOP_RECORDERROR
};
typedef NS_ENUM(NSInteger, HIG_Notify_event_Play_Stop)
{
//    Notify_event的Play Stop的类型为Normal Stop
    HIG_NOTIFY_EVENT_PLAY_STOP_NORMALSTOP        ,
//    Notify_event的Play Stop的类型为Unsupported stream
    HIG_NOTIFY_EVENT_PLAY_STOP_UNSUPPORTEDSTREAM ,
//    Notify_event的Play Stop的类型为Play Error
    HIG_NOTIFY_EVENT_PLAY_STOP_PLAYERROR
};
typedef NS_ENUM(NSInteger, HIG_STB_Status)
{
//    机顶盒状态为播放Media
    HIG_STB_STATUS_PLAY_MEDIA   ,
//    机顶盒状态为播放LCN
    HIG_STB_STATUS_PLAY_DVB     ,
//    机顶盒状态为录制
    HIG_STB_STATUS_PVR_RECORD   ,
//    机顶盒状态为回放
    HIG_STB_STATUS_PVR_PLAYBACK ,
//    机顶盒状态为暂停
    HIG_STB_STATUS_PLAY_PAUSE
};
typedef NS_ENUM(NSInteger, HIG_Record_Mode)
{
//    录制模式为只有一次
    HIG_RECORD_MODE_ONCE   ,
//    录制模式为每日一次
    HIG_RECORD_MODE_DAILY  ,
//    录制模式为每周一次
    HIG_RECORD_MODE_WEEKLY
};
//Error类型Block
typedef void (^TypeErrorCallbackBlock)(NSError *error);
//None类型Block
typedef void (^TypeNoneCallbackBlock)(void);
//NSString类型Block
typedef void (^TypeNSStringCallbackBlock)(NSString *string);
//NSDictionary类型Block
typedef void (^TypeDictionaryCallbackBlock)(NSDictionary *dic);
//NSMutableArray类型Block
typedef void (^TypeArrayCallbackBlock)(NSMutableArray *arr);
//接收广播包数组Block
typedef void (^TypeReceiverBroadcastCallbackBlock)(NSMutableArray *arr);
/**
 是否成功Block
 @param isSuccess 是否成功
 @param error 错误码
 */
typedef void (^TypeIsSuccessCallbackBlock)(BOOL isSuccess,NSString *error);
/**
 是否成功Block
 @param isSuccess 是否成功
 @param string 信息
 @param error 错误码
 */
typedef void (^TypeIsSuccessNSStringCallbackBlock)(BOOL isSuccess,NSString *string,NSString *error);
/**
 返回XML数据Block
 @param model Database模型
 */
typedef void (^TypeXMLCallbackBlock)(DatabaseModel *model);
/**
 返回Database模型Block
 @param model Database模型
 */
typedef void (^TypeDatabaseCallbackBlock)(DatabaseModel *model);
/**
 返回Database模型Block
 @param model Database模型
 @param isSuccess 是否成功
 */
typedef void (^TypeDatabaseSuccessCallbackBlock)(BOOL isSuccess,DatabaseModel *model);
/**
 得到Signal的Block
 @param isSuccess 是否成功
 @param error 错误码
 @param carrierID Carrier ID
 @param signalLevel Signal Level
 @param signalQuality Signal Quality
 */
typedef void (^TypeGetSignalCallbackBlock)(BOOL isSuccess,NSString *error,uint carrierID,int signalLevel,int signalQuality);
/**
 返回Configure模型Block
 @param model Configure模型
 */
typedef void (^TypeConfigureCallbackBlock)(ConfigureModel *model);

/**
 返回Subtitle模型Block
 @param isSuccess 是否成功
 @param model Subtitle模型
 */
typedef void (^TypeSubtitleCallbackBlock)(BOOL isSuccess,SubtitleModel *model);
/**
 返回Audio模型Block
 @param isSuccess 是否成功
 @param model Audio模型
 */
typedef void (^TypeAudioCallbackBlock)(BOOL isSuccess,AudioModel *model);

/**
 返回Notify事件Block
 @param event 事件描述
 */
typedef void (^TypeNotifyEventBlock)(HIG_Notify_event event,NSString *eventContent);

/**
 返回Int类型的值的Block
 @param isSuccess 是否成功
 @param value 返回值
 */
typedef void (^TypeIntValueCallbackBlock)(BOOL isSuccess,int value);
/**
 返回PvrInfo模型Block
 @param isSuccess 是否成功
 @param model PvrInfo模型
 */
typedef void (^TypePvrInfoCallbackBlock)(BOOL isSuccess,PvrInfoModel *model);

/**
 获取Pvr的录制路径Block
 @param isSuccess 是否成功
 @param model 分区模型
 */
typedef void (^TypeGetPvrRecordPathCallbackBlock)(BOOL isSuccess, PartitonModel *model);
/**
 返回MediaInfo模型Block
 @param isSuccess 是否成功
 @param model MediaInfo模型
 */
typedef void (^TypeMediaInfoCallbackBlock)(BOOL isSuccess,MediaInfoModel *model);
/**
 返回当前播放状态Block
 @param isSuccess 是否成功
 @param statuses 状态数组
 @param lCN 节目频道
 @param infoName 信息
 */
typedef void (^TypeSTBStatusCallbackBlock)(BOOL isSuccess,NSMutableArray *statuses,int lCN,NSString *infoName);
/**
 返回字符和数字Block
 @param isSuccess 是否成功
 @param info 信息
 @param value 值
 */
typedef void (^TypeStringAndNumberCallbackBlock)(BOOL isSuccess,NSString *info,int value);

@interface Api : NSObject
//当前Database模型
@property (strong, nonatomic) DatabaseModel *currentDatabaseModel;
//当前Configure模型
@property (strong, nonatomic) ConfigureModel *currentConfigureModel;
//当前机顶盒信息
@property (strong, nonatomic) STBInfo *currentSTBInfo;
//是否允许连接
@property (assign, nonatomic) BOOL allowConnect;
//单例
+ (instancetype)sharedApi;
//UDP操作
- (void)hIG_UdpOperation;
/**
 UDP接收数据
 @param callback 回调
 */
- (void)hIG_UdpReceiveMessage:(TypeReceiverBroadcastCallbackBlock)callback;
/**
 UDP接收数据
 @param callback JSON字符串的方式回调
 */
- (void)hIG_UdpReceiveMessageInJson:(TypeNSStringCallbackBlock)callback;

/**
 未发现的机顶盒列表
 @param callback 回调
 */
- (void)hIG_UndiscoveredSTBList:(TypeReceiverBroadcastCallbackBlock)callback;
/**
 未发现的机顶盒列表
 @param callback callback JSON字符串的方式回调
 */
- (void)hIG_UndiscoveredSTBListInJson:(TypeNSStringCallbackBlock)callback;
//断开所有连接
- (void)hIG_DisconnectAll;
/**
 通过机顶盒信息和用户名连接
 @param sTBInfo 机顶盒信息
 @param userName 用户名
 @param successCallback 连接成功回调
 @param failureCallback 连接失败回调
 */
- (void)hIG_ConnectSTBWithSTBInfo:(STBInfo *)sTBInfo
                         userName:(NSString *)userName
           connectSuccessCallback:(TypeNoneCallbackBlock)successCallback
           connectFailureCallback:(TypeErrorCallbackBlock)failureCallback;
/**
 通过机顶盒信息和用户名连接
 @param jsonString 机顶盒信息和用户名以JSON字符串的方式输入
 @param callback JSON字符串的方式回调
 */
- (void)hIG_ConnectSTBWithJsonString:(NSString *)jsonString
                            callback:(TypeNSStringCallbackBlock)callback;
/**
 因为用户抢连而断开连接回调
 @param callback 回调
 */
- (void)hIG_DisconnectAndCallback:(TypeNSStringCallbackBlock)callback;
/**
 因为用户抢连而断开连接回调
 @param callback JSON字符串的方式回调
 */
- (void)hIG_DisconnectInJsonAndCallback:(TypeNSStringCallbackBlock)callback;
/**
 TCP断开连接
 @param callback 回调
 */
- (void)hIG_Disconnect:(TypeErrorCallbackBlock)callback;

/**
 TCP断开连接
 @param callback JSON字符串的方式回调
 */
- (void)hIG_DisconnectInJson:(TypeNSStringCallbackBlock)callback;
/**
 根据地址解析XML
 @param path 地址
 @param callback 解析完成后回调
 */
- (void)hIG_ParseXMLWithPath:(NSString *)path callback:(TypeXMLCallbackBlock)callback;
/**
 根据地址解析XML
 @param path 地址
 @param callback JSON字符串的方式回调
 */
- (void)hIG_ParseXMLInJsonWithPath:(NSString *)path callback:(TypeNSStringCallbackBlock)callback;
/**
 根据地址解析XML并对比
 @param path 地址
 @param callback 与GetDatabase对比后回调
 */
- (void)hIG_ParseXMLLastWithPath:(NSString *)path callback:(TypeDatabaseCallbackBlock)callback;

/**
 根据地址解析XML并对比
 @param path 地址
 @param callback JSON字符串的方式回调
 */
- (void)hIG_ParseXMLLastInJsonWithPath:(NSString *)path callback:(TypeNSStringCallbackBlock)callback;
/**
 设置DataBase方法
 @param databaseModel DataBase模型
 @param callback 回调
 */
- (void)hIG_SetDataBaseWithDasebaseModel:(DatabaseModel *)databaseModel
                                callback:(TypeIsSuccessCallbackBlock)callback;

/**
 设置DataBase方法
 @param jsonString DataBase以JSON字符串的方式输入
 @param callback JSON字符串的方式回调
 */
- (void)hIG_SetDataBaseWithJsonString:(NSString *)jsonString
                             callback:(TypeNSStringCallbackBlock)callback;
/**
 获取DataBase方法
 @param callback 获取到的Database
 */
- (void)hIG_GetDatabaseAndCallback:(TypeDatabaseSuccessCallbackBlock)callback;

/**
 获取DataBase方法
 @param callback JSON字符串的方式回调
 */
- (void)hIG_GetDatabaseAndCallbackInJson:(TypeNSStringCallbackBlock)callback;
/**
 获取卫星列表方法
 @param callback 回调
 */
- (void)hIG_GetSatelliteList:(TypeArrayCallbackBlock)callback;

/**
 获取卫星列表方法以JSON格式传出
 @param callback 回调
 */
- (void)hIG_GetSatelliteListInJson:(TypeNSStringCallbackBlock)callback;

/**
 建立Satellite
 @param model Satellite模型
 @param callback 是否成功回调
 */
- (void)hIG_SetSatelliteWithSatelliteModel:(DatabaseSatelliteModel *)model
                                  callback:(TypeIsSuccessCallbackBlock)callback;
/**
 建立Satellite
 @param jsonString Satellite以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetSatelliteWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取服务列表方法
 @param callback 回调
 */
- (void)hIG_GetServiceList:(TypeArrayCallbackBlock)callback;
/**
 获取服务列表方法以JSON格式传出
 @param callback 回调
 */
- (void)hIG_GetServiceListInJson:(TypeNSStringCallbackBlock)callback;

/**
 设置服务列表方法
 @param array 服务列表数组
 @param callback 回调
 */
- (void)hIG_SetServiceListWithArray:(NSMutableArray *)array callback:(TypeIsSuccessCallbackBlock)callback;

/**
 设置服务列表方法
 @param jsonString 服务列表数组以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetServiceListWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;

/**
 获取Zap的服务列表方法
 @param callback 回调
 */
- (void)hIG_GetZapServiceList:(TypeArrayCallbackBlock)callback;
/**
 获取Zap的服务列表以JSON格式传出
 @param callback 回调
 */
- (void)hIG_GetZapServiceListInJson:(TypeNSStringCallbackBlock)callback;

/**
 获取喜爱的服务列表
 @param callback 回调
 */
- (void)hIG_GetFavoriteServiceList:(TypeArrayCallbackBlock)callback;
/**
 获取喜爱的服务列表以JSON格式传出
 @param callback 回调
 */
- (void)hIG_GetFavoriteServiceListInJson:(TypeNSStringCallbackBlock)callback;
/**
 建立Service
 @param serviceModel Service模型
 @param callback 是否成功回调
 */
- (void)hIG_SetServiceWithServiceModel:(DatabaseServiceModel *)serviceModel callback:(TypeIsSuccessCallbackBlock)callback;
/**
 建立Service
 @param jsonString Service以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetServiceWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 设置STB Configure方法
 @param model Configure 模型
 @param callback 返回错误码的Block
 */
- (void)hIG_SetSTBConfigureWithConfigureModel:(ConfigureModel *)model
                                     callback:(TypeIsSuccessCallbackBlock)callback;

/**
 设置STB Configure方法
 @param jsonString STB Configure以JSON字符串的方式
 @param callback 返回错误码的Block
 */
- (void)hIG_SetSTBConfigureWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取STB Configure方法
 */
- (void)hIG_GetSTBConfigureAndCallback:(TypeConfigureCallbackBlock)callback;
/**
 获取STB Configure方法以JSON格式传出
 */
- (void)hIG_GetSTBConfigureInJson:(TypeNSStringCallbackBlock)callback;
/**
 设置Zap
 @param lCN 台号
 @param callback 是否成功回调
 */
- (void)hIG_SetZapWithLCN:(int)lCN callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置Zap
 @param jsonString Zap以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_SetZapWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;

/**
 设置机顶盒音量
 @param volume 音量
 @param callback 是否成功回调
 */
- (void)hIG_SetVolume:(int)volume callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒音量
 @param jsonString volume以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_SetVolumeWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒音量
- (int)hIG_GetVolume;
//获取机顶盒音量以JSON字符串的方式
- (NSString *)hIG_GetVolumeInJson;
/**
 设置机顶盒画面比例
 @param aspectRatio 纵横比
 @param callback 是否成功回调
 */
- (void)hIG_SetAspectRatio:(HIG_AspectRatio)aspectRatio callback:(TypeIsSuccessCallbackBlock)callback;

/**
 设置机顶盒画面比例
 @param jsonString aspectRatio纵横比以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_SetAspectRatioWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒画面比例
- (HIG_AspectRatio)hIG_GetAspectRatio;
//获取机顶盒画面比例以JSON字符串的方式
- (NSString *)hIG_GetAspectRatioInJson;
/**
 设置机顶盒分辨率
 @param resolution 分辨率
 @param callback 是否成功回调
 */
- (void)hIG_SetResolution:(HIG_Resolution)resolution callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒分辨率
 @param jsonString resolution分辨率以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_SetResolutionWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒分辨率
- (HIG_Resolution)hIG_GetResolution;
//获取机顶盒分辨率以JSON字符串的方式
- (NSString *)hIG_GetResolutionInJson;
/**
 设置机顶盒视频制式
 @param videoStandard 视频标准
 @param callback 是否成功回调
 */
- (void)hIG_SetVideoStandard:(HIG_VideoStandard)videoStandard callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒视频制式
 @param jsonString videoStandard视频标准以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetVideoStandardWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒视频制式
- (HIG_VideoStandard)hIG_GetVideoStandard;
//获取机顶盒视频制式以JSON字符串的方式
- (NSString *)hIG_GetVideoStandardInJson;
/**
 设置机顶盒数字音频输出格式
 @param digitalAudio 数字音频
 @param callback 是否成功回调
 */
- (void)hIG_SetDigitalAudio:(HIG_DigitalAudio)digitalAudio callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒数字音频输出格式
 @param jsonString digitalAudio数字音频以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetDigitalAudioWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒数字音频输出格式
- (HIG_DigitalAudio)hIG_GetDigitalAudioFormat;
//获取机顶盒数字音频输出格式以JSON字符串的方式
- (NSString *)hIG_GetDigitalAudioFormatInJson;
/**
 设置机顶盒所在的国家或地区
 @param country 国家代码
 @param callback 是否成功回调
 */
- (void)hIG_SetCountry:(NSString *)country callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒所在的国家或地区
 @param jsonString 机顶盒所在的国家或地区以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetCountryWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒所在的国家或地区
- (NSString *)hIG_GetCountry;
//获取机顶盒所在的国家或地区以JSON字符串的方式
- (NSString *)hIG_GetCountryInJson;
/**
 设置机顶盒所在的国家或地区下标
 @param countryCodeIndex 国家代码下标
 @param callback 是否成功回调
 */
- (void)hIG_SetCountryCodeIndex:(int)countryCodeIndex callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒所在的国家或地区下标
 @param jsonString 机顶盒所在的国家或地区以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetCountryCodeIndexWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒所在的国家或地区下标
- (int)hIG_GetCountryCodeIndex;
//获取机顶盒所在的国家或地区下标以JSON字符串的方式
- (NSString *)hIG_GetCountryCodeIndexInJson;
/**
 设置机顶盒界面语言
 @param oSDLanguage 机顶盒界面语言
 @param callback 是否成功回调
 */
- (void)hIG_SetOSDLanguage:(NSString *)oSDLanguage callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒界面语言
 @param jsonString 机顶盒界面语言以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetOSDLanguageWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒界面语言
- (NSString *)hIG_GetOSDLanguage;
//获取机顶盒界面语言以JSON字符串的方式
- (NSString *)hIG_GetOSDLanguageInJson;
/**
 设置机顶盒界面语言下标
 @param oSDLanguageCodeIndex 机顶盒界面语言下标
 @param callback 是否成功回调
 */
- (void)hIG_SetOSDLanguageCodeIndex:(int)oSDLanguageCodeIndex callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒界面语言下标
 @param jsonString oSDLanguageCodeIndex机顶盒界面语言下标以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetOSDLanguageCodeIndexWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒界面语言下标
- (int)hIG_GetOSDLanguageCodeIndex;
//获取机顶盒界面语言下标以JSON字符串的方式
- (NSString *)hIG_GetOSDLanguageCodeIndexInJson;
/**
 设置机顶盒默认字幕语言
 @param subtitleLanguage 机顶盒默认字幕语言
 @param callback 是否成功回调
 */
- (void)hIG_SetPreferSubtitleLanguage:(NSString *)subtitleLanguage callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒默认字幕语言
 @param jsonString 机顶盒默认字幕语言以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetPreferSubtitleLanguageWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒默认字幕语言
- (NSString *)hIG_GetPreferSubtitleLanguage;
//获取机顶盒默认字幕语言以JSON字符串的方式
- (NSString *)hIG_GetPreferSubtitleLanguageInJson;
/**
 设置机顶盒默认字幕语言下标
 @param subtitleLanguageCodeIndex 机顶盒默认字幕语言下标
 @param callback 是否成功回调
 */
- (void)hIG_SetSubtitleLanguageCodeIndex:(int)subtitleLanguageCodeIndex callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒默认字幕语言下标
 @param jsonString subtitleLanguageCodeIndex机顶盒默认字幕语言下标以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetSubtitleLanguageCodeIndexWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒默认字幕语言下标
- (int)hIG_GetSubtitleLanguageCodeIndex;
//获取机顶盒默认字幕语言下标以JSON字符串的方式
- (NSString *)hIG_GetSubtitleLanguageCodeIndexInJson;
/**
 设置机顶盒默认音频语言
 @param audioLanguage 机顶盒默认音频语言
 @param callback 是否成功回调
 */
- (void)hIG_SetPreferAudioLanguage:(NSString *)audioLanguage callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒默认音频语言
 @param jsonString 机顶盒默认字幕语言以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetPreferAudioLanguageWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒默认音频语言
- (NSString *)hIG_GetPreferAudioLanguage;
//获取机顶盒默认音频语言以JSON字符串的方式
- (NSString *)hIG_GetPreferAudioLanguageInJson;
/**
 设置机顶盒默认音频语言下标
 @param audioLanguageCodeIndex 机顶盒默认音频语言
 @param callback 是否成功回调
 */
- (void)hIG_SetAudioLanguageCodeIndex:(int)audioLanguageCodeIndex callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置机顶盒默认音频语言下标
 @param jsonString audioLanguageCodeIndex机顶盒默认音频语言以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetAudioLanguageCodeIndexWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒默认音频语言下标
- (int)hIG_GetAudioLanguageCodeIndex;
//获取机顶盒默认音频语言下标以JSON字符串的方式
- (NSString *)hIG_GetAudioLanguageCodeIndexInJson;
/**
 设置机顶盒音频描述
 @param audioDescription 机顶盒音频描述
 @param callback 是否成功回调
 */
- (void)hIG_SetAudioDescription:(int)audioDescription callback:(TypeIsSuccessCallbackBlock)callback;

/**
 设置机顶盒音频描述
 @param jsonString audioDescription机顶盒音频描述以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetAudioDescriptionWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取机顶盒音频描述
- (int)hIG_GetAudioDescription;
//获取机顶盒音频描述以JSON字符串的方式
- (NSString *)hIG_GetAudioDescriptionInJson;
/**
 设置家长指引年龄等级
 @param parentalGuideRating 家长指引年龄等级
 @param callback 是否成功回调
 */
- (void)hIG_SetParentalGuideRating:(int)parentalGuideRating callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置家长指引年龄等级
 @param jsonString 家长指引年龄等级以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetParentalGuideRatingWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取家长指引年龄等级
- (int)hIG_GetParentalGuideRating;
//获取家长指引年龄等级以JSON字符串的方式
- (NSString *)hIG_GetParentalGuideRatingInJson;
/**
 设置时移录制文件大小限制
 @param timeshiftLimitSize 时移录制文件大小限制
 @param callback 是否成功回调
 */
- (void)hIG_SetTimeshiftLimitSize:(float)timeshiftLimitSize callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置时移录制文件大小限制
 @param jsonString timeshiftLimitSize 时移录制文件大小限制以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetTimeshiftLimitSizeWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
//获取时移录制文件大小限制
- (float)hIG_GetTimeshiftLimitSize;
//获取时移录制文件大小限制以JSON的方式
- (NSString *)hIG_GetTimeshiftLimitSizeInJson;
/**
 设置Command Fe Tune方法
 @param carrierID CarrierID
 @param callback 是否成功回调
 */
- (void)hIG_SetFeTunWithCarrierID:(uint)carrierID callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置Command Fe Tune方法
 @param jsonString CarrierID以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetFeTunWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取signal方法
 @param callback 回调
 */
- (void)hIG_GetSignalCallback:(TypeGetSignalCallbackBlock)callback;

/**
 获取signal方法
 @param callback JSON字符串的方式回调
 */
- (void)hIG_GetSignalCallbackInJson:(TypeNSStringCallbackBlock)callback;
/**
 在建立FeTun后获取获取Signal方法
 @param carrierID CarrierID
 @param callback 回调
 */
- (void)hIG_GetSignalAfterSetFeTunWithCarrierID:(uint)carrierID callback:(TypeGetSignalCallbackBlock)callback;

/**
 在建立FeTun后获取获取Signal方法
 @param jsonString CarrierID以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_GetSignalAfterSetFeTunWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 重设数据方法
 */
- (void)hIG_ResetDataSourceAndCallback:(TypeIsSuccessCallbackBlock)callback;
/**
 重设数据方法
 @param callback JSON字符串的方式回调
 */
- (void)hIG_ResetDataSourceAndCallbackInJson:(TypeNSStringCallbackBlock)callback;
/**
 重设Configure方法
 */
- (void)hIG_ResetConfigureAndCallback:(TypeIsSuccessCallbackBlock)callback;
/**
 重设Configure方法
 @param callback JSON字符串的方式回调
 */
- (void)hIG_ResetConfigureAndCallbackInJson:(TypeNSStringCallbackBlock)callback;
//获取机顶盒的密码
- (NSString *)hIG_GetSTBPIN;
//获取机顶盒所在的密码以JSON字符串的方式
- (NSString *)hIG_GetSTBPINInJson;
/**
 重设STB PIN方法
 @param oldPIN 旧密码
 @param newPIN 新密码
 @param callback 是否成功回调
 */
- (void)hIG_ResetSTBPINWithOldPIN:(NSString *)oldPIN newPIN:(NSString *)newPIN callback:(TypeIsSuccessCallbackBlock)callback;

/**
 重设STB PIN方法
 @param jsonString STB PIN以JSON字符串的方式
 @param callback 是否成功回调(字典形式)
 */
- (void)hIG_ResetSTBPINWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;

/**
 验证STB PIN是否正确
 @param string STB PIN
 @param callback 回调
 */
- (void)hIG_CheckSTBPINWithString:(NSString *)string callback:(TypeIsSuccessCallbackBlock)callback;
/**
 验证STB PIN是否正确
 @param jsonString STB PIN
 @param callback 是否成功回调(字典形式)
 */
- (void)hIG_CheckSTBPINWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取Subtitle List
 @param callback 回调
 */
- (void)hIG_GetSubtitleList:(TypeArrayCallbackBlock)callback;
/**
 获取Subtitle List以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_GetSubtitleListInJson:(TypeNSStringCallbackBlock)callback;
/**
 获取Subtitle
 @param callback 回调
 */
- (void)hIG_GetSubtitle:(TypeSubtitleCallbackBlock)callback;
/**
 获取Subtitle以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_GetSubtitleInJson:(TypeNSStringCallbackBlock)callback;
/**
 设置Subtitle方法
 @param model Subtitle 模型
 @param callback 是否成功回调
 */
- (void)hIG_SetSubtitleWithSubtitleModel:(SubtitleModel *)model callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置Subtitle方法
 @param jsonString Subtitle以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetSubtitleWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取Audio List
 @param callback 回调
 */
- (void)hIG_GetAudioList:(TypeArrayCallbackBlock)callback;
/**
 获取Audio List以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_GetAudioListInJson:(TypeNSStringCallbackBlock)callback;
/**
 获取Audio
 @param callback 回调
 */
- (void)hIG_GetAudio:(TypeAudioCallbackBlock)callback;
/**
 获取Audio以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_GetAudioInJson:(TypeNSStringCallbackBlock)callback;
/**
 设置Audio方法
 @param model Subtitle 模型
 @param callback 是否成功回调
 */
- (void)hIG_SetAudioWithAudioModel:(AudioModel *)model callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置Audio方法
 @param jsonString Audio以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_SetAudioWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取USB的Disk列表
 @param callback 回调
 */
- (void)hIG_GetUSBDisks:(TypeArrayCallbackBlock)callback;
/**
 获取USB的Disk列表以JSON格式传出
 @param callback 回调
 */
- (void)hIG_GetUSBDisksInJson:(TypeNSStringCallbackBlock)callback;
/**
 读取USB目录
 @param dirPath 目录路径
 @param callback 回调
 */
- (void)hIG_ReadUSBDirWithDirPath:(NSString *)dirPath callback:(TypeArrayCallbackBlock)callback;
/**
 读取USB目录
 @param jsonString 目录路径以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_ReadUSBDirWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;

/**
 设置USB格式分区
 @param model 分区
 @param callback 回调
 */
- (void)hIG_SetUSBFormatPartitionWithPartitionModel:(PartitonModel *)model callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置USB格式分区
 @param jsonString 分区以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_SetUSBFormatPartitionWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 接收通知事件
 @param callback 回调
 */
- (void)hIG_ReceiverNotifyEventAndCallback:(TypeNotifyEventBlock)callback;

/**
 接收通知事件以JSON的方式传出
 @param callback 回调
 */
- (void)hIG_ReceiverNotifyEventInJson:(TypeNSStringCallbackBlock)callback;
/**
 设置PVR路径
 @param partition 分区
 @param callback 回调
 */
- (void)hIG_SetPvrPathWithPartition:(PartitonModel *)partition callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置PVR路径
 @param jsonString 分区以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_SetPvrPathWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 设置PVR录制路径
 @param partition 分区
 @param callback 回调
 */
- (void)hIG_SetPvrRecordPathWithPartition:(PartitonModel *)partition callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置PVR录制路径
 @param jsonString 分区以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_SetPvrRecordPathWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取PVR录制路径
 @param callback 回调
 */
- (void)hIG_GetPvrRecordPathCallback:(TypeGetPvrRecordPathCallbackBlock)callback;
/**
 设置PVR录制路径
 @param callback 回调
 */
- (void)hIG_GetPvrRecordPathInJson:(TypeNSStringCallbackBlock)callback;
/**
 开始记录Pvr
 @param record 记录
 @param metaData 数据
 @param callback 回调
 */
- (void)hIG_RecordPvrStartWithRecordParameter:(RecordModel *)record
                                     metaData:(NSString *)metaData
                                     callback:(TypeIsSuccessCallbackBlock)callback;
/**
 开始记录Pvr
 @param jsonString 记录和数据以字符串的方法
 @param callback 回调
 */
- (void)hIG_RecordPvrStartWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 暂停记录Pvr
 @param callback 回调
 */
- (void)hIG_RecordPvrStop:(TypeIsSuccessCallbackBlock)callback;
/**
 暂停回放记录以Json方式传出
 @param callback 回调
 */
- (void)hIG_RecordPvrStopInJson:(TypeNSStringCallbackBlock)callback;
/**
 开始播放Pvr
 @param recordName 名字
 @param playPosition 时间节点
 @param callback 回调
 */
- (void)hIG_PlayPvrStartWithRecordName:(NSString *)recordName
                          playPosition:(int)playPosition
                              callback:(TypeIsSuccessCallbackBlock)callback;
/**
 开始播放Pvr
 @param jsonString 名字和时间节点以Json的方式
 @param callback 回调
 */
- (void)hIG_PlayPvrStartWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 停止播放Pvr
 @param callback 回调
 */
- (void)hIG_PlayPvrStop:(TypeIsSuccessCallbackBlock)callback;
/**
 停止播放Pvr以Json方式传出
 @param callback 回调
 */
- (void)hIG_PlayPvrStopInJson:(TypeNSStringCallbackBlock)callback;
/**
 暂停播放Pvr
 @param callback 回调
 */
- (void)hIG_PlayPvrPause:(TypeIsSuccessCallbackBlock)callback;

/**
 暂停播放Pvr以Json方式传出
 @param callback 回调
 */
- (void)hIG_PlayPvrPauseInJson:(TypeNSStringCallbackBlock)callback;
/**
 继续播放Pvr
 @param callback 回调
 */
- (void)hIG_PlayPvrResume:(TypeIsSuccessCallbackBlock)callback;

/**
 继续播放Pvr以Json方式传出
 @param callback 回调
 */
- (void)hIG_PlayPvrResumeInJson:(TypeNSStringCallbackBlock)callback;
/**
 设置播放Pvr的时间节点
 @param position 时间节点
 @param callback 回调
 */
- (void)hIG_PlayPvrSetPositionWithPosition:(int)position callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置播放Pvr的时间节点
 @param jsonString 时间节点以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayPvrSetPositionWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取播放Pvr的时间节点
 @param callback 回调
 */
- (void)hIG_PlayPvrGetPosition:(TypeIntValueCallbackBlock)callback;
/**
 获取播放Pvr的时间节点以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayPvrGetPositionInJson:(TypeNSStringCallbackBlock)callback;
/**
 设置播放Pvr的速度
 @param speed 速度
 @param callback 回调
 */
- (void)hIG_PlayPvrSetSpeedWithSpeed:(int)speed callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置播放Pvr的速度
 @param jsonString 速度以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayPvrSetSpeedWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取播放Pvr的速度
 @param callback 回调
 */
- (void)hIG_PlayPvrGetSpeed:(TypeIntValueCallbackBlock)callback;
/**
 获取播放Pvr的速度以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayPvrGetSpeedInJson:(TypeNSStringCallbackBlock)callback;
/**
 获取Pvr列表
 @param callback 列表
 */
- (void)hIG_GetPvrList:(TypeArrayCallbackBlock)callback;
/**
 获取Pvr列表以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_GetPvrListInJson:(TypeNSStringCallbackBlock)callback;
/**
 获取Pvr信息
 @param recordName 名字
 @param callback 回调
 */
- (void)hIG_GetPvrInfoWithRecordName:(NSString *)recordName callback:(TypePvrInfoCallbackBlock)callback;
/**
 获取Pvr信息
 @param jsonString 名字以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_GetPvrInfoWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 根据名字删除Pvr
 @param recordName 名字
 @param callback 回调
 */
- (void)hIG_DeletePvrWithRecordName:(NSString *)recordName callback:(TypeIsSuccessCallbackBlock)callback;
/**
 根据名字删除Pvr
 @param jsonString 名字以字符串的方式
 @param callback 回调
 */
- (void)hIG_DeletePvrWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 根据URL地址播放Media
 @param playPosition 时间点
 @param url URL地址
 @param callback 是否成功回调
 */
- (void)hIG_PlayMediaStartWithPlayPosition:(int)playPosition
                                       uRL:(NSString *)url
                                  callback:(TypeIsSuccessCallbackBlock)callback;
/**
 根据URL地址播放Media
 @param jsonString 时间点和地址以字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_PlayMediaStartWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 停止播放Media
 @param callback 回调
 */
- (void)hIG_PlayMediaStop:(TypeIsSuccessCallbackBlock)callback;
/**
 停止播放Media以Json方式传出
 @param callback 回调
 */
- (void)hIG_PlayMediaStopInJson:(TypeNSStringCallbackBlock)callback;
/**
 暂停播放Media
 @param callback 回调
 */
- (void)hIG_PlayMediaPause:(TypeIsSuccessCallbackBlock)callback;
/**
 暂停播放Media以Json方式传出
 @param callback 回调
 */
- (void)hIG_PlayMediaPauseInJson:(TypeNSStringCallbackBlock)callback;
/**
 继续播放Media
 @param callback 回调
 */
- (void)hIG_PlayMediaResume:(TypeIsSuccessCallbackBlock)callback;
/**
 继续播放Media以Json方式传出
 @param callback 回调
 */
- (void)hIG_PlayMediaResumeInJson:(TypeNSStringCallbackBlock)callback;
/**
 设置播放Media的时间节点
 @param position 时间节点
 @param callback 回调
 */
- (void)hIG_PlayMediaSetPositionWithPosition:(int)position callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置播放Media的时间节点
 @param jsonString 时间节点以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayMediaSetPositionWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取播放Media的时间节点
 @param callback 回调
 */
- (void)hIG_PlayMediaGetPosition:(TypeIntValueCallbackBlock)callback;
/**
 获取播放Media的时间节点以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayMediaGetPositionInJson:(TypeNSStringCallbackBlock)callback;
/**
 设置播放Media的速度
 @param speed 速度
 @param callback 回调
 */
- (void)hIG_PlayMediaSetSpeedWithSpeed:(int)speed callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置播放Media的速度
 @param jsonString 速度以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayMediaSetSpeedWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取播放Media的速度
 @param callback 回调
 */
- (void)hIG_PlayMediaGetSpeed:(TypeIntValueCallbackBlock)callback;
/**
 获取播放Media的速度以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayMediaGetSpeedInJson:(TypeNSStringCallbackBlock)callback;
/**
 获取播放Media的信息(Play Start后才能获取)
 @param callback 回调
 */
- (void)hIG_GetMediaInfoCallback:(TypeMediaInfoCallbackBlock)callback;
/**
 获取播放Media的信息以Json字符串的方式(Play Start后才能获取)
 @param callback 回调
 */
- (void)hIG_GetMediaInfoInJson:(TypeNSStringCallbackBlock)callback;
/**
 选择Media的语言
 @param audioID audio ID
 @param callback 回调
 */
- (void)hIG_SetMediaAudioWithAudioID:(int)audioID callback:(TypeIsSuccessCallbackBlock)callback;
/**
 选择Media的语言
 @param jsonString audio ID以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_SetMediaAudioWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获得Media语言的ID
 @param callback 回调
 */
- (void)hIG_GetMediaAudioCallback:(TypeIntValueCallbackBlock)callback;

/**
 获得Media语言的ID以Json字符串的方式
 @param callback 回调
 */
- (void)hIG_GetMediaAudioInJson:(TypeNSStringCallbackBlock)callback;
/**
 读取Music目录
 @param dirPath 目录路径
 @param callback 回调
 */
- (void)hIG_ReadMusicDirWithDirPath:(NSString *)dirPath callback:(TypeArrayCallbackBlock)callback;
/**
 读取Music目录
 @param jsonString 目录路径以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_ReadMusicDirWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 读取Photo目录
 @param dirPath 目录路径
 @param callback 回调
 */
- (void)hIG_ReadPhotoDirWithDirPath:(NSString *)dirPath callback:(TypeArrayCallbackBlock)callback;
/**
 读取Photo目录
 @param jsonString 目录路径以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_ReadPhotoDirWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 读取Movie目录
 @param dirPath 目录路径
 @param callback 回调
 */
- (void)hIG_ReadMovieDirWithDirPath:(NSString *)dirPath callback:(TypeArrayCallbackBlock)callback;
/**
 读取Photo目录
 @param jsonString 目录路径以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_ReadMovieDirWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;

/**
 获取Media目录
 @param dirPath 目录路径
 @param callback 回调
 */
- (void)hIG_ReadMediaDirWithDirPath:(NSString *)dirPath callback:(TypeArrayCallbackBlock)callback;

/**
 获取Media目录
 @param jsonString 目录路径以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_ReadMediaDirWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 关闭机顶盒
 */
- (void)hIG_STBStandby;
/**
 获取机顶盒当前状态
 */
- (void)hIG_GetSTBStatusAndCallback:(TypeSTBStatusCallbackBlock)callback;
/**
 获取机顶盒当前状态以JSON字符串的方式
 */
- (void)hIG_GetSTBStatusInJson:(TypeNSStringCallbackBlock)callback;
/**
 多媒体下载开始
 @param destinationPath 放置路径
 @param url URL地址
 @param callback 是否成功回调
 */
- (void)hIG_MediaDownloadStartWithDestinationPath:(NSString *)destinationPath
                                              uRL:(NSString *)url
                                         callback:(TypeIsSuccessCallbackBlock)callback;
/**
 多媒体下载开始
 @param jsonString 放置路径和URL以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_MediaDownloadStartWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;

/**
 多媒体下载停止
 @param removeFlag 是否删除已下载标记（0:不删除 1:删除）
 @param destinationPath 放置路径
 @param url URL地址
 @param callback 是否成功回调
 */
- (void)hIG_MediaDownloadStopWithRemoveFlag:(int)removeFlag
                            destinationPath:(NSString *)destinationPath
                                        uRL:(NSString *)url
                                   callback:(TypeIsSuccessCallbackBlock)callback;
/**
 多媒体下载停止
 @param jsonString 是否删除已下载标记、放置路径和URL以JSON字符串的方式
 @param callback 是否成功回调
 */
- (void)hIG_MediaDownloadStopWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取多媒体下载进度
 @param destinationPath 放置路径
 @param url URL地址
 @param callback 是否成功并获取进度
 */
- (void)hIG_MediaDownloadGetProgressWithDestinationPath:(NSString *)destinationPath
                                                    uRL:(NSString *)url
                                               callback:(TypeStringAndNumberCallbackBlock)callback;
/**
 获取多媒体下载进度
 @param jsonString 放置路径和URL以JSON字符串的方式
 @param callback 是否成功并获取进度
 */
- (void)hIG_MediaDownloadGetProgressWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 USB创建文件夹
 @param path 路径
 @param callback 回调
 */
- (void)hIG_USBMakeDirectoryWithPath:(NSString *)path callback:(TypeIsSuccessCallbackBlock)callback;
/**
 USB创建文件夹
 @param jsonString 路径以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_USBMakeDirectoryWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 USB复制
 @param sourcePath 源路径
 @param destinationPath 放置路径
 @param callback 回调
 */
- (void)hIG_USBCopyWithSourcePath:(NSString *)sourcePath destinationPath:(NSString *)destinationPath callback:(TypeIsSuccessCallbackBlock)callback;
/**
 USB复制
 @param jsonString 源路径和放置路径
 @param callback 回调
 */
- (void)hIG_USBCopyWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 USB移除文件
 @param path 路径
 @param callback 回调
 */
- (void)hIG_USBRemoveWithPath:(NSString *)path callback:(TypeIsSuccessCallbackBlock)callback;
/**
 USB移除文件
 @param jsonString 路径以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_USBRemoveWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 USB重命名
 @param oldPath 旧路径
 @param newPath 新路径
 @param callback 回调
 */
- (void)hIG_USBRenameWithOldPath:(NSString *)oldPath newPath:(NSString *)newPath callback:(TypeIsSuccessCallbackBlock)callback;
/**
 USB重命名
 @param jsonString 旧路径和新路径以JSON字符串
 @param callback 回调
 */
- (void)hIG_USBRenameWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 移动端网络状态
 @param callback 回调
 */
- (void)hIG_GetMobileWifiInfo:(TypeDictionaryCallbackBlock)callback;
/**
 移动端网络状态已Json格式传出
 @param callback 回调
 */
- (void)hIG_GetMobileWifiInfoInJson:(TypeNSStringCallbackBlock)callback;
/**
 机顶盒输入密码一键配网
 @param password 密码
 @param callback 回调
 */
- (void)hIG_STBWlanAPWithSSID:(NSString *)ssid
                     password:(NSString *)password
                     callback:(TypeIsSuccessCallbackBlock)callback;
/**
 机顶盒输入密码一键配网
 @param jsonString 密码以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_STBWlanAPWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 设置录制列表
 @param bookList 录制列表
 @param callback 回调
 */
- (void)hIG_SetPvrBookListWithList:(NSMutableArray *)bookList callback:(TypeIsSuccessCallbackBlock)callback;
/**
 设置录制列表
 @param jsonString 录制列表以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_SetPvrBookListWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 获取录制列表
 @param callback 回调
 */
- (void)hIG_GetPvrBookList:(TypeArrayCallbackBlock)callback;
/**
 获取录制列表以JSON格式传出
 @param callback 回调
 */
- (void)hIG_GetPvrBookListInJson:(TypeNSStringCallbackBlock)callback;

/**
 向录制列表添加录制
 @param bookList 录制
 @param callback 回调
 */
- (void)hIG_AddPvrBookListWith:(BookListModel *)bookList callback:(TypeIsSuccessCallbackBlock)callback;
/**
 向录制列表添加录制
 @param jsonString 录制以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_AddPvrBookListWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 向录制列表移除录制
 @param bookList 录制
 @param callback 回调
 */
- (void)hIG_DeletePvrBookListWith:(BookListModel *)bookList callback:(TypeIsSuccessCallbackBlock)callback;
/**
 向录制列表移除录制
 @param jsonString 录制
 @param callback 回调
 */
- (void)hIG_DeletePvrBookListWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 机顶盒输出正在播放的流
 @param enable 是否允许
 @param callback 回调
 */
- (void)hIG_STBSetPushAVStreamWithEnable:(BOOL)enable callback:(TypeIsSuccessNSStringCallbackBlock)callback;
/**
 机顶盒输出正在播放的流
 @param jsonString 是否允许以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_STBSetPushAVStreamWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;
/**
 机顶盒软件升级
 @param softwareVersion 版本号
 @param imagePath 路径
 */
- (void)hIG_STBUpgradeSoftwareWithSoftwareVersion:(int)softwareVersion imagePath:(NSString *)imagePath;
/**
 机顶盒软件升级
 @param jsonString 版本号和路径以JSON字符串的方式
 */
- (void)hIG_STBUpgradeSoftwareWithJsonString:(NSString *)jsonString;
//------------------------------------------------------------------------------------

/**
 播放视频
 @param contentType Content Type
 @param contentID Content ID
 @param callback 回调
 */
- (void)hIG_PlayVideoWithContentType:(NSString *)contentType
                           contentID:(NSString *)contentID
                            callback:(TypeIsSuccessCallbackBlock)callback;

/**
 播放视频
 @param jsonString Content Type和Content ID以JSON字符串的方式
 @param callback 回调
 */
- (void)hIG_PlayVideoWithJsonString:(NSString *)jsonString callback:(TypeNSStringCallbackBlock)callback;

- (void)hIG_switchCodeStream:(BOOL)isSwitch callback:(TypeIsSuccessCallbackBlock)callback;
@end
