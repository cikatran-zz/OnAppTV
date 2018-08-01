package com.onapptv;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;

public class LimitedViewPager extends ViewPager {
    public LimitedViewPager(@NonNull Context context) {
        super(context);
    }

    public LimitedViewPager(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        Log.v("onIntercepTouchEvent", "limited");
        if (isSwipeable(ev.getX(), ev.getY())) {
            return super.onInterceptTouchEvent(ev);
        }
        return false;
    }

    public boolean isSwipeable(float x, float y) {
        int deviceHeight = getContext().getResources().getDisplayMetrics().heightPixels;
        int deviceWidth = getContext().getResources().getDisplayMetrics().widthPixels;
        /*
        Range is 0.4227 - 0.88
         */
        float percent = y / (deviceHeight / 100);
        Log.v("isSwipeable",  String.valueOf((percent >= 42) && (percent <= 88)));
        return percent >= 42;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        Log.v("onTouchEvent", "Limited");
        if (isSwipeable(ev.getX(), ev.getY())) {
            return super.onTouchEvent(ev);
        }
        return false;
    }
}
