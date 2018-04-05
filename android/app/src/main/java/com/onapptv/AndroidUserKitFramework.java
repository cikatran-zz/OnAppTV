package com.onapptv;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

import userkit.sdk.UserKit;
import userkit.sdk.identity.UserKitIdentity;

/**
 * Created by henry on 4/2/18.
 */
public class AndroidUserKitFramework extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNUserKit";

    public AndroidUserKitFramework(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void setDeviceType(String type){
        UserKit.getInstance().setDeviceType(type);
    }

    @ReactMethod
    public void timeEvent(String name){
        UserKit.getInstance().timeEvent(name);
    }

    @ReactMethod
    public void tract(String name, Map<String, Object> properties){
        UserKit.getInstance().track(name, properties);
    }
}
