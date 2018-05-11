package com.onapptv;

import android.app.Fragment;
import android.app.FragmentManager;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.v13.app.FragmentStatePagerAdapter;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.event.EventEmitterImpl;

import java.util.ArrayList;
import java.util.HashMap;

public class ControlPageAdapter extends FragmentStatePagerAdapter {
    ArrayList mEpg;
    static Boolean mIsLive = false;
    static FragmentManager mFm;
    public static Catalog catalog = new Catalog(new EventEmitterImpl(), "5706818955001", "BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I");

    @RequiresApi(api = Build.VERSION_CODES.M)
    public ControlPageAdapter(FragmentManager fm,
                              ArrayList epg,
                              Boolean isLive) {
        super(fm);
        setEpg(epg);
        mIsLive = isLive;
        mFm = fm;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void setEpg(ArrayList epg) {
        mEpg = epg;
        notifyDataSetChanged();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public Fragment getItem(int position) {
        return FragmentControlPage.newInstance(position, "Page " + position, ((HashMap) mEpg.get(position)));
    }

    public static Boolean isLive() {
        return mIsLive;
    }

    public static Catalog getCatalog() {
        return catalog;
    }

    public static FragmentManager getmFm() {
        return mFm;
    }

    @Override
    public int getCount() {
        return mEpg.size();
    }

}
