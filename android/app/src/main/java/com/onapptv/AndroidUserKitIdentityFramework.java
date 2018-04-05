package com.onapptv;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.Locale;
import java.util.Map;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.schedulers.Schedulers;
import userkit.sdk.UserKit;
import userkit.sdk.identity.UserKitIdentity;
import userkit.sdk.identity.model.AccountProfile;
import userkit.sdk.identity.model.ProfileProperties;

/**
 * Created by henry on 4/2/18.
 */
public class AndroidUserKitIdentityFramework extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNUserKitIdentity";

    public AndroidUserKitIdentityFramework(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void signOut() {
        UserKitIdentity.getInstance().getAccountManager().logout();
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void signUpWithEmail(String email, String password, ReadableMap properties, Callback callback) {
        UserKitIdentity.getInstance().signUp(email, password, new ProfileProperties(properties.toHashMap()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountInfo -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(accountInfo.toJsonString());
                    callback.invoke(null, array);
                }, throwable -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(throwable.toString());
                    callback.invoke(array, null);
                });
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void signInWithEmail(String email, String password, Callback callback) {
        UserKitIdentity.getInstance().loginWithEmailAndPassword(email, password)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountInfo -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(accountInfo.toJsonString());
                    callback.invoke(null, array);
                }, throwable -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(throwable.toString());
                    callback.invoke(array, null);
                });
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void signInWithFacebookAccount(String facebookAuthToken, Callback callback) {
        UserKitIdentity.getInstance().loginWithFacebookAccount(facebookAuthToken)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountInfo -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(accountInfo.toJsonString());
                    callback.invoke(null, array);
                }, throwable -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(throwable.toString());
                    callback.invoke(array, null);
                });

    }

}
