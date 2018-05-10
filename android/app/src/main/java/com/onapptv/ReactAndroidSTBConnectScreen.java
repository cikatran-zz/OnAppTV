package com.onapptv;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

/**
 * Created by oldmen on 3/21/18.
 */

public class ReactAndroidSTBConnectScreen extends SimpleViewManager<AndroidSTBConnectScreen> {
    public static final String REACT_CLASS = "RNTSTBConnectionView";
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected AndroidSTBConnectScreen createViewInstance(ThemedReactContext reactContext) {
        return new AndroidSTBConnectScreen(reactContext);
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
