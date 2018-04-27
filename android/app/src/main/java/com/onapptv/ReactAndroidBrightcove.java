package com.onapptv;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.onapptv.custombrightcoveplayer.CustomBrightcovePlayer;

import java.util.Map;

/**
 * Created by henry on 4/27/18.
 */
public class ReactAndroidBrightcove extends SimpleViewManager<CustomBrightcovePlayer> {
    public static final String REACT_CLASS = "RNTBrightcoveView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected CustomBrightcovePlayer createViewInstance(ThemedReactContext reactContext) {
        return new CustomBrightcovePlayer(reactContext);
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder()
                .put(
                        "finished",
                        MapBuilder.of(
                                "registrationName",
                                "onFinished"))
                .build();
    }
}
