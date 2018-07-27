package com.onapptv;

import android.app.Application;
import android.support.multidex.MultiDex;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.codepush.react.CodePush;
import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.github.yamill.orientation.OrientationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.onapptv.custombrightcoveplayer.MyOkhttpModule;

import java.util.Arrays;
import java.util.List;

import userkit.sdk.UserKit;
import userkit.sdk.identity.UserKitIdentity;
public class MainApplication extends Application implements ReactApplication {

    public ReactContext getReactContext() {
        return mReactNativeHost.getReactInstanceManager().getCurrentReactContext();
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                new RNFetchBlobPackage(),
                new MainReactPackage(),
                new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
                new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
                new AppCenterReactNativePackage(MainApplication.this),
                new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
                new LottiePackage(),
                new FBSDKPackage(mCallbackManager),
//                new RNGestureHandlerPackage(),
                new OrientationPackage(),
                new VectorIconsPackage(),
                new OnAppTVPackage()
            );
        }


        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        MultiDex.install(this);
        SoLoader.init(this, /* native exopackage */ false);
        MyOkhttpModule.init(this);
        String token = "";
        if (BuildConfig.BUILD_TYPE == "release") {
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNWFjMmVhZmVkMGY0NGY0NzRmYWUwMzM3IiwiaWF0IjoxNTIyNzMxNTIyfQ.QquSfGGQNc0PCZppc0deIqIYQaYUh5J0R76bl0ayKjI";
        } else {
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNWFjMmVhZmVkMGY0NGY0NzRmYWUwMzM3IiwiaWF0IjoxNTIyNzIzNTgyfQ.wJcjiZKkm9A4El8Hxr5QcsIExuDh8EOrrr40vNUp7IA";
        }
        UserKit.init(this, token, "366865783618");
        UserKitIdentity.init(this, token);
    }
}
