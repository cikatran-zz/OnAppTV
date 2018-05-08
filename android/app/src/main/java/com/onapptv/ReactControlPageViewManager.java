package com.onapptv;

import android.app.Activity;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.onapptv.android_control_page.ControlPage;

import java.util.Map;

public class ReactControlPageViewManager extends SimpleViewManager<ControlPage> {
    public static final String REACT_CLASS = "RNControlModal";
    private Activity mContext;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ControlPage createViewInstance(ThemedReactContext reactContext) {
        mContext = reactContext.getCurrentActivity();
        return new ControlPage(reactContext, mContext);
    }

    @ReactProp(name = "items")
    public void setEpg(ControlPage view, ReadableArray epg) {
        view.setEpg(epg);
    }

    @ReactProp(name = "index")
    public void setItem(ControlPage view, int index) {
        view.setIndex(index);
    }

    @ReactProp(name = "isLive")
    public void setIsLive(ControlPage view, Boolean isLive) {
        Log.v("setIsLive", "Value " + isLive);
        view.setIsLive(isLive);
    }

//    @ReactProp(name = "videoUrl")
//    public void setBcVideos(ControlPage view, String url) {
//        view.setBcVideos(url);
//    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder()
                .put("onClose",
                        MapBuilder.of(
                                "registrationName",
                                "onClose"))
                .put("onDetail",
                        MapBuilder.of(
                               "registrationName",
                               "onDetail"))
                .build();
    }
}
