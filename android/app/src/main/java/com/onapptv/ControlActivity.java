package com.onapptv;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v7.app.AppCompatActivity;

import com.onapptv.R;

import java.util.ArrayList;

public class ControlActivity extends AppCompatActivity implements FragmentControlPage.OnPlayFinished {

    LimitedViewPager mViewPager;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_control);

        Intent data = getIntent();
        Bundle bundle = data.getBundleExtra("control_page");

        mViewPager = findViewById(R.id.view_pager);

        ControlPageAdapter adapter =
                new ControlPageAdapter(getFragmentManager(),(ArrayList) bundle.getSerializable("epg") , bundle.getBoolean("isLive"));
        mViewPager.setAdapter(adapter);
        int index = bundle.getInt("index");
        mViewPager.setCurrentItem(index);
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
}
