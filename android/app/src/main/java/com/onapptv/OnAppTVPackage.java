package com.onapptv;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.onapptv.android_stb_framework.AndroidSTBFramework;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by Cika on 2/2/18.
 */

public class OnAppTVPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {

        List<NativeModule> modules = new ArrayList<>();

        modules.add(new AndroidSTBFramework(reactContext));
        modules.add(new AndroidUserKitFramework(reactContext));
        modules.add(new AndroidUserKitIdentityFramework(reactContext));
        modules.add(new BrightcoveFramework(reactContext));
        modules.add(new WatchingHistoryFramework(reactContext));

        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
//    return Collections.<ViewManager>singletonList(
//        new ReactBlurViewManager()
//    );
        List<ViewManager> managerList = new ArrayList<>();
        managerList.add(new ReactBlurViewManager());
        managerList.add(new ReactBrightcovePlayerViewManager());
        managerList.add(new ReactAndroidSTBConnectScreen());
        return managerList;
    }


}
