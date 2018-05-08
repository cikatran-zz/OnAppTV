package com.onapptv.android_control_page;

import android.app.Fragment;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.SeekBar;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.facebook.react.bridge.ReadableMap;
import com.onapptv.android_stb_connect.R;

import java.util.ArrayList;
import java.util.HashMap;

import jp.wasabeef.glide.transformations.BlurTransformation;

@RequiresApi(api = Build.VERSION_CODES.M)
public class FragmentControlPage extends Fragment {
    SeekBar mRealSeek, mFakeSeek;
    FrameLayout mTopContainer;
    ImageView mTopBanner, mMainBanner;
    ProgressBar mProgress;
    HashMap mData;

    Boolean isDragging = false;
    int currentProgress = 0;

    public static FragmentControlPage newInstance(int index, String title, HashMap item) {
        FragmentControlPage mFragment = new FragmentControlPage();
        Bundle args = new Bundle();
        args.putInt("index", index);
        args.putString("title", title);
        args.putSerializable("item", item);
        mFragment.setArguments(args);
        return mFragment;
    }

    @Override
    public void onCreate(Bundle onSavedInstanceState) {
        super.onCreate(onSavedInstanceState);

        mData = (HashMap) getArguments().getSerializable("item");
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle bundle) {
        View rootView = inflater.inflate(R.layout.fragment_control_page, container, false);
        int deviceHeight = getContext().getResources().getDisplayMetrics().heightPixels;
        int deviceWidth = getContext().getResources().getDisplayMetrics().widthPixels;

        mRealSeek = rootView.findViewById(R.id.real_volume);
        mFakeSeek = rootView.findViewById(R.id.fake_volume);
        mTopContainer = rootView.findViewById(R.id.top_banner);
        mTopBanner = rootView.findViewById(R.id.image_top_banner);
        mMainBanner = rootView.findViewById(R.id.main_banner);
        mProgress = rootView.findViewById(R.id.progress_layout);


        Glide.with(getContext())
                .load(getImageFromArray((ArrayList<HashMap>) mData.get("originalImages"), "portrait", "feature"))
                .into(mTopBanner);
        Glide.with(getContext())
                .load(getImageFromArray((ArrayList<HashMap>) mData.get("originalImages"), "portrait", "feature"))
                .apply(RequestOptions.bitmapTransform(new BlurTransformation(25, 2)))
                .into(mMainBanner);
        mFakeSeek.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                mRealSeek.setProgress(progress);
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });

        mTopContainer.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                Log.v("onTouch", "Top Container");
                return mGestureDetector.onTouchEvent(event);
            }
        });

        return rootView;
    }

    public GestureDetector mGestureDetector = new GestureDetector(getContext(), new GestureDetector.SimpleOnGestureListener() {

        @RequiresApi(api = Build.VERSION_CODES.M)
        @Override
        public boolean onScroll(MotionEvent e1, MotionEvent e2,
                                float distanceX, float distanceY) {
            Log.v("onScroll", "MotionEvent");
            int deviceWidth = getContext().getResources().getDisplayMetrics().widthPixels;
            float distance = (e2.getX() - e1.getX()) / (deviceWidth / 100);
            isDragging = true;
            mProgress.setProgress((int) (currentProgress + distance));
            return false;
        }

        @RequiresApi(api = Build.VERSION_CODES.M)
        public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX,
                               float velocityY) {
            isDragging = false;
            int deviceWidth = getContext().getResources().getDisplayMetrics().widthPixels;
            float distance = (e2.getX() - e1.getX()) / (deviceWidth / 100);
            mProgress.setProgress((int) (currentProgress + distance));
            currentProgress = (int) (currentProgress + distance);
            return false;
        }

        public boolean onDown(MotionEvent event) {
            return true;
        }
    });

    String getImageFromArray(ArrayList<HashMap> images, String firstName, String secondName) {
        if (images == null || images.size() == 0) {
            return "https://i.imgur.com/7eKo6Q7.png";
        }
        String image = null;
        for (int i = 0; i < images.size(); i++) {
            String itemName = (String) images.get(i).get("name");
            if (itemName != null) {
                if (itemName.equals(firstName)) image = (String) images.get(i).get("url");
                if (image == null && itemName.equals(secondName))
                    image = (String) images.get(i).get("url");
            }
        }
        if (image == null) image = (String) images.get(0).get("url");
        return image;
    }
}
