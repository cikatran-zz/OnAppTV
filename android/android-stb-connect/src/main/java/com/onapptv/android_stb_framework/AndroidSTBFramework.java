package com.onapptv.android_stb_framework;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import tv.hi_global.stbapi.Api;
import tv.hi_global.stbapi.Model.AudioModel;
import tv.hi_global.stbapi.Model.BookListModel;
import tv.hi_global.stbapi.implementation.Api_Implementation;

/**
 * Created by oldmen on 3/26/18.
 */

public class AndroidSTBFramework extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "STBManager";

    public AndroidSTBFramework(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void setContext() {
        Api_Implementation.sharedManager().hIG_setContext(getReactApplicationContext());
    }

    @ReactMethod
    public void udpOperation() {
        Api_Implementation.sharedManager().hIG_UdpOperation();
    }

    @ReactMethod
    public void udpReceiveMessageInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_UdpReceiveMessageInJson(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void unDiscoveredSTBListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_UndiscoveredSTBListInJson(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void disconnectAll() {
        Api_Implementation.sharedManager().hIG_DisconnectAll();
    }

    @ReactMethod
    public void connectSTBWithJsonString(String string, Callback callback) {
        Api_Implementation.sharedManager().hIG_ConnectSTB(string, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void disconnectAndCallback(Callback callback) {
        Api_Implementation.sharedManager().hIG_DisconnectAndCallback(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void disconnectInJsonAndCallback(Callback callback) {
        Api_Implementation.sharedManager().hIG_DisconnectInJsonAndCallback(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void disconnectInJson(Callback callback) {
        Log.v("DisconnectInJson", "Dummy");
    }

    @ReactMethod
    public void parseXMLInJsonWithPath(String path, Callback callback) throws FileNotFoundException {
        InputStream is = new FileInputStream(path);
        Api_Implementation.sharedManager().hIG_ParseXML(is, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void parseXMLLastInJsonWithPath(String path, Callback callback) throws FileNotFoundException {
        InputStream is = new FileInputStream(path);
        Api_Implementation.sharedManager().hIG_ParseXMLLast(is, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setDataBaseWithJsonString(String string, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetDataBase(string, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getSatelliteListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetSatelliteListInJson(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setSatelliteWithJsonString(String json, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetSatellite(json, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getServiceListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetServiceListInJson(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setServiceListWithJsonString(String json, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetServiceList(json, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getZapServiceListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetZapServiceListInJson(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getFavoriteServiceListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetFavoriteServiceListInJson(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setServiceWithJsonString(String string, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetService(string, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setSTBConfigureWithJsonString(String json, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetSTBConfigure(json, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getSTBConfigureInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetSTBConfigure(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setZapWithJsonString(String json, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetZap(json, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setVolumeWithJsonString(String json, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetVolume(json, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getVolumeInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetVolumeInJson());
    }

    @ReactMethod
    public void setAspectRatioWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetAspectRatio(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getAspectRatioInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetAspectRatioInJson());
    }

    @ReactMethod
    public void setResolutionWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetResolution(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getResolutionInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetResolutionInJson());
    }

    @ReactMethod
    public void setVideoStandardWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetVideoStandard(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getVideoStandardInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetVideoStandardInJson());
    }

    @ReactMethod
    public void setDigitalAudioWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetDigitalAudio(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getDigitalAudioFormatInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetDigitalAudioFormatInJson());
    }

    @ReactMethod
    public void setCountryWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetCountry(jsonString, new Api.OnSuccessCallbackBlock() {
            @Override
            public void OnSuccessCallback(Boolean aBoolean, String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getCountryInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetCountryInJson());
    }

    @ReactMethod
    public void setCountryCodeIndexWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetCountryCodeIndex(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getCountryCodeIndexInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetCountryCodeIndexInJson());
    }

    @ReactMethod
    public void setOSDLanguageWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetOSDLanguage(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getOSDLanguageCodeIndexInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetOSDLanguageCodeIndexInJson());
    }

    @ReactMethod
    public void setPreferSubtitleLanguageWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetPreferSubtitleLanguage(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getPreferSubtitleLanguageInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetPreferSubtitleLanguageInJson());
    }

    @ReactMethod
    public void setSubtitleLanguageCodeIndexWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetSubtitleLanguageCodeIndex(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getSubtitleLanguageCodeIndexInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetSubtitleLanguageCodeIndexInJson());
    }

    @ReactMethod
    public void setPreferAudioLanguageWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetPreferAudioLanguage(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getPreferAudioLanguageInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetPreferAudioLanguageInJson());
    }

    @ReactMethod
    public void setAudioLanguageCodeIndexWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetAudioLanguageCodeIndex(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getAudioLanguageCodeIndexInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetAudioLanguageCodeIndexInJson());
    }

    @ReactMethod
    public void setAudioDescriptionWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetAudioDescription(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getAudioDescriptionInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetAudioDescriptionInJson());
    }

    @ReactMethod
    public void setParentalGuideRatingWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetParentalGuideRating(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getParentalGuideRatingInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetParentalGuideRatingInJson());
    }

    @ReactMethod
    public void setTimeshiftLimitSizeWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetTimeshiftLimitSize(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getTimeshiftLimitSizeInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetTimeshiftLimitSizeInJson());
    }

    @ReactMethod
    public void setFeTunWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetFeTun(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getSignalCallbackInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetSignal(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getSignalAfterSetFeTunWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_GetSignalAfterSetFeTun(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void resetDataSourceAndCallbackInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_ResetDataSource(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void resetConfigureAndCallbackInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_ResetConfigure(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getSTBPINInJson(Callback callback) {
        callback.invoke(Api_Implementation.sharedManager().hIG_GetSTBPINInJson());
    }

    @ReactMethod
    public void resetSTBPINWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_ResetSTBPIN(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void checkSTBPINWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_CheckSTBPIN(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getSubtitleListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetSubtitleList(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getSubtitleInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetSubtitle(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setSubtitleWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetSubtitle(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getAudioListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetAudioList(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getAudioInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetAudio(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setAudioWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetAudio(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getUSBDisksInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetUSBDisks(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void readUSBDirWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_ReadUSBDir(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setUSBFormatPartitionWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetUSBFormatPartition(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }


    @ReactMethod
    public void receiverNotifyEventInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_ReceiverNotifyEvent(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setPvrPathWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetPvrPath(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getPvrRecordPathInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetPvrRecordPath(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void recordPvrStartWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_RecordPvrStart(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void recordPvrStopInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_RecordPvrStop(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playPvrStartWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayPvrStart(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playPvrStopInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayPvrStop(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playPvrPauseInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayPvrPause(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playPvrResumeInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayPvrResume(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playPvrSetPositionWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayPvrSetPosition(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playPvrGetPositionInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayPvrGetPosition(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playPvrSetSpeedWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayPvrSetSpeed(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                callback.invoke();
            }
        });
    }

    @ReactMethod
    public void playPvrGetSpeedInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayPvrGetSpeed(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getPvrListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetPvrList(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getPvrInfoWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_GetPvrInfo(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void deletePvrWithJsonString(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_DeletePvr(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    /*

     */

    @ReactMethod
    public void playMediaStartWithJson(String jsonString, Callback callback)  {
        Api_Implementation.sharedManager().hIG_PlayMediaStart(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playMediaStop(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayMediaStop(new Api.OnSuccessCallbackBlock() {
            @Override
            public void OnSuccessCallback(Boolean aBoolean, String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playMediaPause(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayMediaPause(new Api.OnSuccessCallbackBlock() {
            @Override
            public void OnSuccessCallback(Boolean aBoolean, String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playMediaResume(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayMediaResume(new Api.OnSuccessCallbackBlock() {
            @Override
            public void OnSuccessCallback(Boolean aBoolean, String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playMediaSetPositionWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayMediaSetPosition(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playMediaGetPositionInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayMediaGetPosition(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playMediaSetSpeedWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayMediaSetSpeed(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playMediaGetSpeedInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayMediaGetSpeed(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getMediaInfoInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetMediaInfo(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setMediaAudioWithJson(String jsonString,Callback callback) {
        Api_Implementation.sharedManager().hIG_SetMediaAudio(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getMediaAudioInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetMediaInfo(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void readMusicDirWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_ReadMusicDir(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void readPhotoDirWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_ReadPhotoDir(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void readMovieDirWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_ReadMovieDir(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void readMediaDirWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_ReadMediaDir(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void stbStandby() {
        Api_Implementation.sharedManager().hIG_STBStandby();
    }

    @ReactMethod
    public void getSTBStatus(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetSTBStatus(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {

                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void mediaDownloadStartWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_MediaDownloadStart(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void mediaDownloadStopWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_MediaDownloadStop(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void mediaDownloadGetProgressWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_MediaDownloadGetProgress(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void usbMakeDirectoryWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_USBMakeDirectory(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void usbCopyWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_USBCopy(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void usbRemoveWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_USBRemove(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void usbRenameWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_USBRename(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getMobileWifiInfoInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetMobileWifiInfoInJson(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void stbWlanAPWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_STBWlanAP(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void setPvrBookListWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_SetPvrBookList(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void getPvrBookListInJson(Callback callback) {
        Api_Implementation.sharedManager().hIG_GetPvrBookListInJson(new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void addPvrBooKListWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_AddPvrBooKList(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void deletePvrBookWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_DeletePvrBook(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void stbSetPushAVStreamWithEnableWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_STBSetPushAVStreamWithEnable(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void stbUpgradeSoftwareWIthJson(String jsonString) {
        Api_Implementation.sharedManager().hIG_STBUpgradeSoftware(jsonString);
    }

    @ReactMethod
    public void switchCodeStream(Boolean bool, Callback callback) {
        Api_Implementation.sharedManager().hIG_switchCodeStream(bool, new Api.OnSuccessCallbackBlock() {
            @Override
            public void OnSuccessCallback(Boolean aBoolean, String s) {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(s);
                    callback.invoke(null, array);
            }
        });
    }

    @ReactMethod
    public void playVideoWithJson(String jsonString, Callback callback) {
        Api_Implementation.sharedManager().hIG_PlayVideo(jsonString, new Api.OnStringCallbackBlock() {
            @Override
            public void OnStringCallback(String s) {
                WritableNativeArray array = new WritableNativeArray();
                array.pushString(s);
                callback.invoke(null, array);
            }
        });
    }



}
