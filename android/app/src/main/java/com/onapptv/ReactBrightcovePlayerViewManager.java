package com.onapptv;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.onapptv.custombrightcoveplayer.CustomBrightcovePlayer;

/**
 * Created by oldmen on 3/7/18.
 */

public class ReactBrightcovePlayerViewManager extends SimpleViewManager<CustomBrightcovePlayer> {
    public static final String REACT_CLASS = "RNTBrightcovePlayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected CustomBrightcovePlayer createViewInstance(ThemedReactContext reactContext) {
        return new CustomBrightcovePlayer(reactContext);
    }

    @ReactProp(name = "videoId")
    public void setVideoId(CustomBrightcovePlayer view, String videoId) {
        view.setVideoKey(videoId);
    }

    @ReactProp(name = "accountId")
    public void setAccountId(CustomBrightcovePlayer view, String accountId) {
        view.setAccountId(accountId);
    }

    @ReactProp(name = "policyKey")
    public void setPolicyKey(CustomBrightcovePlayer view, String policyKey) {
        view.setPolicyKey(policyKey);
    }

    @ReactProp(name = "metaData")
    public void setMetadata(CustomBrightcovePlayer view, ReadableMap metadata) {
        view.setMetadata(metadata.toHashMap());
    }
}