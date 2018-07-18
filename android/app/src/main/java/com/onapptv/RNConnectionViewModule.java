package com.onapptv;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.onapptv.ConnectionView.Controllers.TabbarActivity;

public class RNConnectionViewModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "RNConnectionViewModule";

    public RNConnectionViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void show() {
        Intent intent = new Intent(getCurrentActivity(), TabbarActivity.class);
        getCurrentActivity().startActivity(intent);
    }
}
