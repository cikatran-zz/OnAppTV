package com.onapptv;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.support.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import tv.hi_global.stbapi.Api;

public class MainActivity extends ReactActivity {

    private SharedPreferences mSharedPreferences;
    private SharedPreferences.Editor mEditor;
    private static final String PREFS_DEBUG_SERVER_HOST_KEY = "debug_http_host";
    private static String HOST_SERVER = "192.168.10.112:8081";

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);
//        Boolean readExternalPer = ContextCompat.checkSelfPermission(this, android.Manifest.permission.READ_EXTERNAL_STORAGE)
//                != PackageManager.PERMISSION_GRANTED;
//        Boolean writeExternalPer = ContextCompat.checkSelfPermission(this, android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
//                != PackageManager.PERMISSION_GRANTED;
//        Boolean wifiState = ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_WIFI_STATE)
//                != PackageManager.PERMISSION_GRANTED;
//        Boolean internet = ContextCompat.checkSelfPermission(this, android.Manifest.permission.INTERNET)
//                != PackageManager.PERMISSION_GRANTED;
//        Boolean systemAlertWindow = ContextCompat.checkSelfPermission(this, android.Manifest.permission.SYSTEM_ALERT_WINDOW)
//                != PackageManager.PERMISSION_GRANTED;
//
//        if (readExternalPer || writeExternalPer || wifiState || internet || systemAlertWindow) {
//
//            // Permission is not granted
//            // Should we show an explanation?
//            if (ActivityCompat.shouldShowRequestPermissionRationale(this,
//                    android.Manifest.permission.READ_EXTERNAL_STORAGE) || ActivityCompat.shouldShowRequestPermissionRationale(this,
//                    android.Manifest.permission.WRITE_EXTERNAL_STORAGE) || ActivityCompat.shouldShowRequestPermissionRationale(this,
//                    android.Manifest.permission.ACCESS_WIFI_STATE) || ActivityCompat.shouldShowRequestPermissionRationale(this,
//                    android.Manifest.permission.INTERNET) || ActivityCompat.shouldShowRequestPermissionRationale(this,
//                    android.Manifest.permission.SYSTEM_ALERT_WINDOW)) {
//
//                // Show an explanation to the user *asynchronously* -- don't block
//                // this thread waiting for the user's response! After the user
//                // sees the explanation, try again to request the permission.
//
//            } else {
//
//                // No explanation needed; request the permission
//                ActivityCompat.requestPermissions(this,
//                        new String[]{Manifest.permission_group.STORAGE},
//                        );
//
//                // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
//                // app-defined int constant. The callback method gets the
//                // result of the request.
//            }
//        } else {
//            // Permission has already been granted
//        }
        Api.sharedApi().hIG_ReceiverNotifyEvent((hig_notify_event, s) -> {
            WritableMap map = Arguments.createMap();
            map.putInt("data", hig_notify_event.getValue());
            sendEvent((ReactContext) getBaseContext(),
                    "statusEvent",
                    map);
        });

        Api.sharedApi().hIG_DisconnectAndCallback(s -> {
            WritableMap map = Arguments.createMap();
            map.putString("data", s);
            sendEvent((ReactContext) getBaseContext(),
                    "disconnectEvent",
                    map);
        });
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    @Override
    protected String getMainComponentName() {
        return "OnAppTV";
    }
}
