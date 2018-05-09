package com.onapptv;

import android.content.Intent;
import android.os.Bundle;
import android.os.Parcelable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.onapptv.android_control_page.ControlActivity;

public class ControlPageNavigationModules extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNControlPageNavigation";

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    public ControlPageNavigationModules(ReactApplicationContext context) {
        super(context);
    }

    @ReactMethod
    public void navigateControl(ReadableArray epg, int index, boolean isLive, Callback onDismiss, Callback onDetails) {
        Intent intent = new Intent(getReactApplicationContext(), ControlActivity.class);
        Bundle arguments = new Bundle();
        arguments.putInt("index", index);
        arguments.putBoolean("isLive", isLive);
        arguments.putSerializable("epg", epg.toArrayList());
        intent.putExtra("control_page", arguments);
        getReactApplicationContext().startActivity(intent);
    }
}