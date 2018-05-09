package com.onapptv;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.onapptv.android_control_page.ControlActivity;

/**
 * Created by oldmen on 5/2/18.
 */

public class BrightcoveVCModules extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNBrightcoveVC";

    public BrightcoveVCModules(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void navigateWithVideoId(String videoId, String accountId, String policyKey, ReadableMap metaData) {
        Intent intent = new Intent(getReactApplicationContext(), BrightcoveActivity.class);
        intent.putExtra(BrightcoveActivity.VIDEO_ID, videoId);
        intent.putExtra(BrightcoveActivity.ACCOUNT_ID, accountId);
        intent.putExtra(BrightcoveActivity.POLICY_KEY, policyKey);
        intent.putExtra(BrightcoveActivity.METADATA, metaData.toHashMap());
        getReactApplicationContext().startActivity(intent);
    }
}
