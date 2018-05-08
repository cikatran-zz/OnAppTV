package com.onapptv.android_control_page;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.util.AttributeSet;
import android.util.Log;
import android.widget.FrameLayout;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.onapptv.android_stb_connect.R;

import tv.hi_global.stbapi.Api;

public class ControlPage extends FrameLayout {
    Activity mActivity;

    LimitedViewPager mViewPager;
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

        mViewPager = findViewById(R.id.view_pager);
        mViewPager.setOffscreenPageLimit(1);

        mViewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
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

    public void setIsLive(Boolean isLive) {
        mIsLive = isLive;
        loadViewPager();
    }

    public void setIndex(int index) {
        mIndex = 0;
        loadViewPager();
    }

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

    public void loadViewPager() {
        Log.v("setIsLive", "Activity " + mActivity);
        if (mEpg != null && mIndex != -1 && mIsLive != null && mActivity != null) {

            ControlPageAdapter adapter =
                    new ControlPageAdapter( (mActivity).getFragmentManager(), mEpg, mIsLive);
            mViewPager.setAdapter(adapter);

            mViewPager.setCurrentItem(mIndex);
        }
    }
}
