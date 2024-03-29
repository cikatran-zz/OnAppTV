package com.onapptv;

import android.content.Intent;
import android.opengl.GLES10;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.v7.app.AppCompatActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.onapptv.R;
import com.onapptv.custombrightcoveplayer.GlideApp;

import java.util.ArrayList;

import tv.hi_global.stbapi.Api;
import tv.hi_global.stbapi.implementation.Api_Implementation;

public class ControlActivity extends AppCompatActivity implements FragmentControlPage.OnPlayFinished {

    LimitedViewPager mViewPager;
    private static Boolean isDisconnected = false;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_control);

        Intent data = getIntent();
        Bundle bundle = data.getBundleExtra("control_page");
        ArrayList epgs = (ArrayList) SingletonDataTransaction.getInstance().getDataSerialize();
        if (epgs == null)
            epgs = new ArrayList();

        mViewPager = findViewById(R.id.view_pager);

        ControlPageAdapter adapter =
                new ControlPageAdapter(getFragmentManager(),
                        epgs,
                        bundle.getBoolean("isLive"),
                        bundle.getBoolean("isFromBanner"),
                        bundle.getBoolean("isFromChannel"));
        mViewPager.setAdapter(adapter);
        int index = bundle.getInt("index");
        mViewPager.setCurrentItem(index);

        Api_Implementation.sharedManager().hIG_setContext(this);

        Api.sharedApi().hIG_ReceiverNotifyEvent((hig_notify_event, s) -> {
            WritableMap map = Arguments.createMap();
            map.putInt("data", hig_notify_event.getValue());
            sendEvent(((MainApplication) getApplication()).getReactContext(),
                    "statusEvent",
                    map);
        });

        Api.sharedApi().hIG_DisconnectAndCallback(s -> {
            WritableMap map = Arguments.createMap();
            map.putString("data", s);
            sendEvent(((MainApplication) getApplication()).getReactContext(),
                    "disconnectEvent",
                    map);
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle oldInstanceState) {
        super.onSaveInstanceState(oldInstanceState);
        oldInstanceState.clear();
    }

    @Override
    public void nextPage() {
        int current = mViewPager.getCurrentItem();
        if (current < (mViewPager.getAdapter().getCount() - 1)) {
            mViewPager.setCurrentItem(current + 1);
        }
        else {
            mViewPager.setCurrentItem(0);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        GlideApp.get(this).clearMemory();
    }

    public static void setIsDisconnected(Boolean b) {
        isDisconnected = b;
    }

    public static Boolean getIsDisconneted() {
        return isDisconnected;
    }

    public int currentIndex() {
        return mViewPager.getCurrentItem();
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
