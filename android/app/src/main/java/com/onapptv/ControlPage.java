package com.onapptv;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.onapptv.R;

import tv.hi_global.stbapi.Api;

public class ControlPage extends LimitedViewPager {
    Activity mActivity;

    ReadableArray mEpg;
    int mIndex = 0;
    Boolean mIsLive;
    private static String videoUrl;

    public ControlPage(@NonNull Context context, Activity activity) {
        super(context);
        inflate(context, R.layout.layout_control_page, this);

        mActivity = activity;

        initialize(context);
    }

    public ControlPage(@NonNull Context context, @Nullable AttributeSet attrs, Activity activity) {
        super(context, attrs);
        inflate(context, R.layout.layout_control_page, this);

        mActivity = activity;

        initialize(context);
    }

    void initialize(Context context) {

        this.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                mIndex = position;
                // Callback to get another brightcove video url
                videoUrl = null;
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void setIsLive(Boolean isLive) {
        mIsLive = isLive;
        loadViewPager();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void setIndex(int index) {
        mIndex = 0;
        loadViewPager();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void setEpg(ReadableArray epg) {
        mEpg = epg;
        loadViewPager();
    }

    public void setBcVideos(String url) {
        videoUrl = url;
        // Start Play Media
        Api.sharedApi().hIG_PlayMediaStart(videoUrl, s -> {
            Log.v("PlayMediaStart", s);
        });
    }

    public static String getCurrentVideoUrl() {
        return videoUrl;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void loadViewPager() {
        Log.v("setIsLive", "Activity " + mActivity);
//        if (mEpg != null && mIndex != -1 && mIsLive != null && mActivity != null) {
//
////            ControlPageAdapter adapter =
////                    new ControlPageAdapter(mActivity.getFragmentManager(), mEpg.toArrayList(), mIsLive);
//            this.setAdapter(adapter);
//
//            this.setCurrentItem(mIndex);
//        }
    }
}
