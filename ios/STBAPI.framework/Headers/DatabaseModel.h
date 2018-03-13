//
//  DatabaseModel.h
//  TableSTB2
//
//  Created by 沈凯 on 2017/4/6.
//  Copyright © 2017年 神SKY. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DatabaseServiceModel : NSObject
//服务ID
@property (assign, nonatomic) int serviceID;
//服务名称
@property (copy, nonatomic) NSString *serviceName;
//Orginal Network ID
@property (assign, nonatomic) int orginalNetworkID;
//Transport Stream ID
@property (assign, nonatomic) int transportStreamID;
//Logic channel number
@property (assign, nonatomic) int lCN;
//服务类型
@property (assign, nonatomic) int serviceType;
//scrambled
@property (assign, nonatomic) int scrambled;
//----------------------------------------------------
//应答器ID
@property (assign, nonatomic) uint carrierID;
//卫星ID
@property (assign, nonatomic) int satelliteID;
//应答器index
@property (assign, nonatomic) int transponderIndex;
//HD logic channel number
@property (assign, nonatomic) int hDLCN;
//invisible
@property (assign, nonatomic) int invisible;
//removed
@property (assign, nonatomic) int removed;
//locked
@property (assign, nonatomic) int locked;
//reserved
@property (assign, nonatomic) int reserved;
//----------------------------------------------------
//favorite
@property (assign, nonatomic) int favorite;
- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface DatabaseTransponderModel : NSObject
//频率
@property (assign, nonatomic) int frequency;
//码元速率
@property (assign, nonatomic) int symbolRate;
//极性
@property (copy, nonatomic) NSString *polarity;
//服务数组
@property (strong, nonatomic) NSMutableArray < DatabaseServiceModel *>*serviceModelArr;
//----------------------------------------------------
//应答器ID
@property (assign, nonatomic) uint carrierID;
//卫星ID
@property (assign, nonatomic) int satelliteID;
//应答器index
@property (assign, nonatomic) int transponderIndex;
- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface DatabaseSatelliteModel : NSObject
//卫星名字
@property (copy, nonatomic) NSString *satelliteName;
//卫星与地面的夹角
@property (assign, nonatomic) float satelliteAngle;
//应答器数组
@property (strong, nonatomic) NSMutableArray < DatabaseTransponderModel *>*transponderModelArr;
//----------------------------------------------------
//卫星ID
@property (assign, nonatomic) int satelliteID;
//低本振
@property (assign, nonatomic) int lowLOF;
//高本振
@property (assign, nonatomic) int highLOF;
//LNB Type
@property (assign, nonatomic) int lNBType;
//LNB Power
@property (assign, nonatomic) int lNBPower;
//DiSEqC Level
@property (assign, nonatomic) int diSEqCLevel;
//DiSEqC 1.0
@property (assign, nonatomic) int diSEqC10;
//DiSEqC 1.1
@property (assign, nonatomic) int diSEqC11;
//DiSEqC 1.2
@property (assign, nonatomic) int diSEqC12;
//USALS
@property (assign, nonatomic) int uSALS;
//Tone Burst
@property (assign, nonatomic) int toneBurst;
//22kHz
@property (assign, nonatomic) int lNBValue;
- (instancetype)initWithDic:(NSDictionary *)dic;
@end


@interface DatabaseModel : NSObject
//数据库版本
@property (assign, nonatomic) int version;
//卫星数组
@property (strong, nonatomic) NSMutableArray < DatabaseSatelliteModel *>*satelliteArr;
- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface STBInfo : NSObject
//机顶盒ID
@property (copy, nonatomic) NSString *sTBID;
//唯一标识符
@property (copy, nonatomic) NSString *oUI;
//硬件版本号
@property (assign, nonatomic) uint hardwareVersion;
//软件版本号
@property (assign, nonatomic) uint softwareVersion;
//升级程序版本号
@property (assign, nonatomic) uint loaderVersion;
//IP地址
@property (copy, nonatomic) NSString *iPAddress;
//MAC地址
@property (copy, nonatomic) NSString *macAddress;
- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface ScanModel : NSObject
//STB信息
@property (strong, nonatomic) STBInfo *stb;
//已连用户
@property (copy, nonatomic) NSString *userName;
@end

@interface ConfigureModel : NSObject
//STB PIN
@property (copy, nonatomic) NSString *pinCode;
//Country Code
@property (copy, nonatomic) NSString *countryCode;
//OSD Language Code
@property (copy, nonatomic) NSString *oSDLanguageCode;
//Audio Language Code
@property (copy, nonatomic) NSString *audioLanguageCode;
//Subtitle Language Code
@property (copy, nonatomic) NSString *subtitleLanguageCode;
//Aspect Ratio
@property (assign, nonatomic) int aspectRatio;
//Resolution
@property (assign, nonatomic) int resolution;
//Video Standard
@property (assign, nonatomic) int videoStandard;
//Audio Description
@property (assign, nonatomic) int audioDescription;
//Digital audio
@property (assign, nonatomic) int digitalAudio;
//Volume
@property (assign, nonatomic) int volume;
//Parental Guide Rating
@property (assign, nonatomic) int parentalGuideRating;
//Brightness
@property (assign, nonatomic) int brightness;
//Sharpness
@property (assign, nonatomic) int sharpness;
//Contrast
@property (assign, nonatomic) int contrast;
//Hue
@property (assign, nonatomic) int hue;
//Saturation
@property (assign, nonatomic) int saturation;
//Time Offset
@property (assign, nonatomic) uint timeOffset;
//Timeshift Limit Size
@property (assign, nonatomic) float timeShiftLimitSize;
//Longitude
@property (assign, nonatomic) float longitude;
//Latitude
@property (assign, nonatomic) float latitude;
//-----------------------------------------------
//Country Code index
@property (assign, nonatomic) int countryCodeIndex;
//OSD Language Code index
@property (assign, nonatomic) int oSDLanguageCodeIndex;
//Audio Language Code index
@property (assign, nonatomic) int audioLanguageCodeIndex;
//Subtitle Language Code index
@property (assign, nonatomic) int subtitleLanguageCodeIndex;
//-----------------------------------------------
//LanguageCode:1.eng,2.spa,3.grc,4.fre,5.csq",6.ita,7.hun,8.dut,9.nor,10.pol,11.por,12.rus,13.ron,14.slo,15.ser,16.fin,17.swe,18.bul,19.gae,20.wel,21.per,22.cat,23.cze,24.dsk,25.ger,26.qaa,27.000,28.chi,29.und,30.fra
//LanguageIndex:1.English,2.Spanish,3.Greek,4.French,5.Croatian,6.Italian,7.Hungarian,8.Dutch,9.Norwegian,10.Polish,11.Portuguese,12.Russian,13.Romanian,14.Slovene,15.Serbian,16.Finnish,17.Swedish,18.Bulgarian,19.Gaelic,20.Welsh,21.Persian,22.Catalan,23.Czech,24.Dansk,25.German,26.Original,27.Off,28.Chinese,29.Undefined,30.French
//CountryCode:1.gbr,2.fra,3.ita,4.deu,5.rus
//CountryIndex:1.UK,2.France,3.Italy,4.Germany,5.Russia
//-----------------------------------------------
//language数组
@property (strong, nonatomic) NSArray *languageArr;
//Country数组
@property (strong, nonatomic) NSArray *countryArr;
- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface AvStreamModel : NSObject
//Type
@property (assign, nonatomic) int type;
//PID
@property (assign, nonatomic) int pID;
- (instancetype)initWithDic:(NSDictionary *)dic;

@end

@interface SubtitleModel : NSObject
//Language Code(ISO639)
@property (copy, nonatomic) NSString *languageCode;
//Subtitle Type
@property (assign, nonatomic) int subtitleType;
//PID
@property (assign, nonatomic) int pID;
//Composition Page ID
@property (assign, nonatomic) int compositionPageID;
//Ancillary Page ID
@property (assign, nonatomic) int ancillaryPageID;
//----------------------------------------------
//Language Code index
@property (assign, nonatomic) int languageIndex;
//language数组
@property (strong, nonatomic) NSArray *languageArr;
- (instancetype)initWithDic:(NSDictionary *)dic;

@end

@interface AudioModel : NSObject
//Language Code(ISO639)
@property (copy, nonatomic) NSString *languageCode;
//Audio Type
@property (assign, nonatomic) int audioType;
//Audio Codec(es_type)
@property (assign, nonatomic) int audioCodec;
//Soundtrack
@property (assign, nonatomic) int soundtrack;
//PID
@property (assign, nonatomic) int pID;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Audio ID
@property (assign, nonatomic) int audioID;
//----------------------------------------------
//Language Code index
@property (assign, nonatomic) int languageIndex;
//language数组
@property (strong, nonatomic) NSArray *languageArr;
- (instancetype)initWithDic:(NSDictionary *)dic;

@end

@interface PartitonModel : NSObject
//File System Type
@property (assign, nonatomic) int fileSystemType;
//Partition Total Size
@property (assign, nonatomic) int partitionTotalSize;
//Partition Free Size
@property (assign, nonatomic) int partitionFreeSize;
//Partition Device Name
@property (copy, nonatomic) NSString *partitionDeviceName;
//Partition Label
@property (copy, nonatomic) NSString *partitionLabel;
//Partition Mount Point
@property (copy, nonatomic) NSString *partitionMountPoint;

- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface DiskModel : NSObject
//Disk ID
@property (assign, nonatomic) int diskID;
//Disk Total Size
@property (assign, nonatomic) uint diskTotalSize;
//Disk Free Size
@property (assign, nonatomic) uint diskFreeSize;
//Partition List Size
@property (assign, nonatomic) int partitionListSize;
//Partition数组
@property (strong, nonatomic) NSMutableArray <PartitonModel *>*partitionArr;

- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface FileModel : NSObject
//File Type( 0:文件夹 , 1:文件 )
@property (assign, nonatomic) int fileType;
//File Name
@property (copy, nonatomic) NSString *fileName;

- (instancetype)initWithDic:(NSDictionary *)dic;

@end

@interface RecordModel : NSObject
//LCN
@property (assign, nonatomic) int lCN;
//Start Time
@property (strong, nonatomic) NSDate *startTime;
//Duration
@property (assign, nonatomic) int duration;
//Record Mode
@property (assign, nonatomic) int recordMode;
//Record Name
@property (copy, nonatomic) NSString *recordName;

- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface PvrInfoModel : NSObject
//Record Time
@property (strong, nonatomic) NSDate *recordTime;
//Duration
@property (assign, nonatomic) int duration;
//Record Size
@property (assign, nonatomic) int recordSize;
//Video Codec(es_type)
@property (assign, nonatomic) int videoCodec;
//Video Resolution
@property (assign, nonatomic) int resolution;
//Maturity
@property (assign, nonatomic) int maturity;
//Parental Guide Rating
@property (assign, nonatomic) int parentalGuideRating;
//Meta Data
@property (strong, nonatomic) NSString *metaData;

- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface MediaMovieModel : NSObject
//Duration
@property (assign, nonatomic) int duration;
//Video Codec(es_type)
@property (assign, nonatomic) int videoCodec;
//Video Width
@property (assign, nonatomic) int videoWidth;
//Video Height
@property (assign, nonatomic) int videoHeight;
//Audio数组
@property (strong, nonatomic) NSMutableArray <AudioModel *>*audioArr;

- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface MediaMusicModel : NSObject
//Duration
@property (assign, nonatomic) int duration;
//Title
@property (copy, nonatomic) NSString *title;
//Album
@property (copy, nonatomic) NSString *album;
//Artist
@property (copy, nonatomic) NSString *artist;
//year
@property (copy, nonatomic) NSString *year;

- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface MediaInfoModel : NSObject
//Info Type( 0:Movie , 1:Music )
@property (assign, nonatomic) int infoType;
//Movie
@property (strong, nonatomic) MediaMovieModel *movie;
//Music
@property (strong, nonatomic) MediaMusicModel *music;

- (instancetype)initWithDic:(NSDictionary *)dic;
@end

@interface BookListModel : NSObject
//Record
@property (strong, nonatomic) RecordModel *record;
//Meta Data
@property (strong, nonatomic) NSString *metaData;

- (instancetype)initWithDic:(NSDictionary *)dic;
@end
