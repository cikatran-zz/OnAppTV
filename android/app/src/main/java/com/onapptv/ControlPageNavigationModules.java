package com.onapptv;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.onapptv.android_control_page.ControlActivity;

import java.util.HashMap;

public class ControlPageNavigationModules extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNControlPageNavigation";
    private static final int DETAILS_PAGE_REQUEST = 10000;

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    public ControlPageNavigationModules(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(mActivityEventListener);
    }

    @ReactMethod
    public void navigateControl(ReadableArray epg, int index, boolean isLive, Callback onDismiss, Callback onDetails) {
        Intent intent = new Intent(getReactApplicationContext(), ControlActivity.class);
        Bundle arguments = new Bundle();
        arguments.putInt("index", index);
        arguments.putBoolean("isLive", isLive);
        arguments.putSerializable("epg", epg.toArrayList());
        intent.putExtra("control_page", arguments);
        getCurrentActivity().startActivityForResult(intent, DETAILS_PAGE_REQUEST);
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);
            if (requestCode == DETAILS_PAGE_REQUEST) {
                if (resultCode == Activity.RESULT_OK) {
                    Bundle extras = data.getExtras();
                    boolean isLive = extras.getBoolean("isLive");
                    HashMap item = (HashMap) extras.getSerializable("item");
                    WritableMap params = Arguments.createMap();
                    params.putBoolean("isLive", isLive);
                    Gson gson = new Gson();
                    String itemJson = gson.toJson(item);
                    params.putString("item", itemJson);
                    sendEvent(getReactApplicationContext(), "reloadDetailsPage", params);
                }
            }
        }
    };

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}