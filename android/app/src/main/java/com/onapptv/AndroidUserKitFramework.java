package com.onapptv;

import android.annotation.SuppressLint;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.schedulers.Schedulers;
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
    public void setDeviceType(String type) {
        UserKit.getInstance().setDeviceType(type);
    }

    @ReactMethod
    public void timeEvent(String name) {
        UserKit.getInstance().timeEvent(name);
    }

    @ReactMethod
    public void tract(String name, ReadableMap properties) {
        UserKit.getInstance().track(name, properties.toHashMap());
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void storeProperty(String key, ReadableMap value, Callback callback) {
        UserKit.getInstance().getProfileManager().set(key, value.toHashMap())
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(() -> {
                    WritableNativeArray array = new WritableNativeArray();
                    Object valueJson = JsonHelper.toJSON(value.toHashMap());
                    array.pushString(valueJson.toString());
                    callback.invoke(null, array);
                }, throwable -> {
                    Gson gson = new Gson();
                    callback.invoke(gson.toJson(throwable), null);
                });
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void getProperty(String key, Callback callback) {
        UserKit.getInstance().getProfileManager().getProperty(key, HashMap.class)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(value -> {
                    WritableNativeArray array = new WritableNativeArray();
                    Object valueJson = JsonHelper.toJSON(value.get());
                    array.pushString(valueJson.toString());
                    callback.invoke(null, array);
                }, throwable -> {
                    Gson gson = new Gson();
                    callback.invoke(gson.toJson(throwable), null);
                });
    }
}