package com.onapptv.android_control_page;

import android.app.Fragment;
import android.app.FragmentManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReadableArray;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;

public class ControlPageAdapter extends android.support.v13.app.FragmentStatePagerAdapter {
    ReadableArray mEpg;
    Boolean mIsLive = false;
    FragmentManager mFm;

    public ControlPageAdapter(FragmentManager fm,
                              ReadableArray epg,
                              Boolean isLive) {
        super(fm);
        mFm = fm;
        setEpg(epg);
        Log.v("mEpgSize", String.valueOf(mEpg.size()));
        mIsLive = isLive;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void setEpg(ReadableArray epg) {
        mEpg = epg;

        notifyDataSetChanged();
    }

//    @Override
//    public Object instantiateItem(ViewGroup container, int position) {
//        Fragment temp = mFragments.get(position);
//        mFm.beginTransaction()
//                .detach(temp)
//                .attach(temp)
//                .commit();
//        return temp;
//    }

    @Override
    public Fragment getItem(int position) {
        return FragmentControlPage.newInstance(position, "Page " + position, mEpg.getMap(position).toHashMap());
    }

    @Override
    public int getCount() {
        return mEpg.size();
    }
}
