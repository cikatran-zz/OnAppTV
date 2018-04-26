package com.onapptv;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.onapptv.custombrightcoveplayer.TrackUserkit;

import userkit.sdk.BitRateUnit;
import userkit.sdk.PlayerState;
import userkit.sdk.SpecificRequiredItem;
import userkit.sdk.UserKit;
import userkit.sdk.OnDemandPlaybackEventRecorder;

/**
 * Created by Chuong on 4/26/18.
 */

public class ReactVODPlaybackRecorder extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNVODPlaybackRecorder";

    private OnDemandPlaybackEventRecorder playbackEventRecorder = null;
    @Override
    public String getName() {
        return REACT_MODULE;
    }

    public ReactVODPlaybackRecorder(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void startRecording(ReadableMap item) {
        playbackEventRecorder = new OnDemandPlaybackEventRecorder(TrackUserkit.createItemFromMetaData(item.toHashMap()));
    }

    @ReactMethod
    public void recordAudioBitrate(Number bitrate, Number playhead) {
        if (playbackEventRecorder != null) {
            playbackEventRecorder.recordAudioBitrate(bitrate.longValue(), BitRateUnit.BITS_PER_SECOND, playhead.doubleValue());
        }
    }

    @ReactMethod
    public void recordVideoBitrate(Number bitrate, Number width, Number height, Number playhead) {
        if (playbackEventRecorder != null) {
            playbackEventRecorder.recordVideoBitrate(bitrate.longValue(), BitRateUnit.BITS_PER_SECOND, width.intValue(), height.intValue(), playhead.doubleValue());
        }
    }

    @ReactMethod
    public void recordPlayerState(String state, Number playhead) {
        if (playbackEventRecorder != null) {
            if (state.equals(PlayerState.PLAY.toString())) {
                playbackEventRecorder.recordPlayerState(PlayerState.PLAY, playhead.doubleValue());
            } else if (state.equals(PlayerState.PAUSE.toString())){
                playbackEventRecorder.recordPlayerState(PlayerState.PAUSE, playhead.doubleValue());
            } else if (state.equals(PlayerState.BUFFER.toString())){
                playbackEventRecorder.recordPlayerState(PlayerState.BUFFER, playhead.doubleValue());
            } else if (state.equals(PlayerState.SEEK.toString())){
                playbackEventRecorder.recordPlayerState(PlayerState.SEEK, playhead.doubleValue());
            }
        }
    }

    @ReactMethod
    public void stopRecording(Number playhead, Number videoLength) {
        if (playbackEventRecorder != null) {
            playbackEventRecorder.stopRecording(playhead.doubleValue(), videoLength.doubleValue(),null);
        }
        playbackEventRecorder = null;
    }
}
