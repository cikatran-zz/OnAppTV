package com.onapptv;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.onapptv.custombrightcoveplayer.CustomBrightcovePlayer;

/**
 * Created by henry on 4/27/18.
 */
public class BrightcoveFramework extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNBrightcove";

    public BrightcoveFramework(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void onEmit(CustomBrightcovePlayer view, String event) {
        view.getEventEmitter().emit(event);
    }
}
