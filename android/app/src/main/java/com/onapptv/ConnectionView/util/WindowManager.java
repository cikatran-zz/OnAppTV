package com.onapptv.ConnectionView.util;

import android.content.Context;
import android.content.res.Resources;
import android.util.DisplayMetrics;

public class WindowManager {
    private WindowManager() {
        throw new UnsupportedOperationException("cannot be instantiated");
    }

    /**
     * 获取屏幕高度
     *
     * @param context
     * @return
     */
    public static int getScreenHeight(Context context) {
        Resources resources = context.getResources();
        DisplayMetrics displayMetrics = resources.getDisplayMetrics();
        return displayMetrics.heightPixels;
    }

    public static int getScreenWidth(Context context) {
        Resources resources = context.getResources();
        DisplayMetrics displayMetrics = resources.getDisplayMetrics();
        return displayMetrics.widthPixels;
    }

    /**
     * Device Metrices
     */
    public static float getDeviceDensity(Context context) {
        Resources resources = context.getResources();
        DisplayMetrics displayMetrics = resources.getDisplayMetrics();
        return displayMetrics.density;
    }

    /**
     * get StatausBar Height
     */
    public static int getStatusBarHeight(Context context) {
        int result = 0;
        int resultID = context.getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resultID > 0) {
            result = context.getResources().getDimensionPixelSize(resultID);
        }
        return result;
    }
}

