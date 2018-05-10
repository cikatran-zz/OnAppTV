package com.onapptv.android_control_page;

import android.app.Fragment;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;

import com.brightcove.player.edge.VideoListener;
import com.brightcove.player.model.DeliveryType;
import com.brightcove.player.model.Video;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.onapptv.android_stb_connect.R;

import java.util.ArrayList;
import java.util.HashMap;

import jp.wasabeef.glide.transformations.BlurTransformation;
import tv.hi_global.stbapi.Api;

@RequiresApi(api = Build.VERSION_CODES.M)
public class FragmentControlPage extends Fragment {
    private final String NO_VIDEO_URL = "no_video_url";

    SeekBar mRealSeek, mFakeSeek;
    RelativeLayout mTopContainer;
    ImageView mTopBanner, mMainBanner;
    ProgressBar mProgress;
    HashMap mData, mDataLive;
    ImageButton mDetail, mDismiss, mRecord, mFavorite, mShare, mStartOver, mCaption, mPlay, mBackward, mFastward;
    TextView mTitle, mGenres;

    String videoUrl = NO_VIDEO_URL;
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
    public void onDetach() {
        super.onDetach();
    }

    @Override
    public void onCreate(Bundle onSavedInstanceState) {
        super.onCreate(onSavedInstanceState);

        if (ControlPageAdapter.isLive()) {
            mDataLive = (HashMap) getArguments().getSerializable("item");
        }
        else {
            mData = (HashMap) getArguments().getSerializable("item");
            ControlPageAdapter.getCatalog().findVideoByID(mData.get("contentId").toString(), new VideoListener() {
                @Override
                public void onVideo(Video video) {
                    videoUrl = video.findHighQualitySource(DeliveryType.MP4).getUrl();
                    if (Api.sharedApi().hIG_IsConnect()) {
                        Api.sharedApi().hIG_PlayMediaStart(0, videoUrl, new Api.OnSuccessCallbackBlock() {
                            @Override
                            public void OnSuccessCallback(Boolean aBoolean, String s) {
                                Log.v("playMediaOnSuccess", aBoolean.toString());
                            }
                        });
                    }
                }
            });
        }


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
        mDetail = rootView.findViewById(R.id.information_btn);
        mDismiss = rootView.findViewById(R.id.dismiss);
        mRecord = rootView.findViewById(R.id.record);
        mFavorite = rootView.findViewById(R.id.favorite);
        mShare = rootView.findViewById(R.id.share);
        mStartOver = rootView.findViewById(R.id.start_over);
        mCaption = rootView.findViewById(R.id.caption);
        mPlay = rootView.findViewById(R.id.play);
        mBackward = rootView.findViewById(R.id.backward);
        mFastward = rootView.findViewById(R.id.fastward);
        mTitle = rootView.findViewById(R.id.title_tv);
        mGenres = rootView.findViewById(R.id.genres_tv);

        if (ControlPageAdapter.isLive()) {
            mPlay.setImageResource(R.mipmap.ic_ontv);
            mTitle.setText(((HashMap)mDataLive.get("videoData")).get("title").toString());
            mGenres.setText(getGenresFromArray((ArrayList<HashMap>) ((HashMap) mDataLive.get("videoData")).get("genresData")));
        }
        else {
            mPlay.setImageResource(R.mipmap.ic_play);
            mTitle.setText((mData.get("title").toString()));
            mGenres.setText(getGenresFromArray((ArrayList<HashMap>) mData.get("genresData")));
        }

        if (ControlPageAdapter.isLive()) {
            Glide.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) ((HashMap) mDataLive.get("videoData")).get("originalImages"), "portrait", "feature"))
                    .into(mTopBanner);
            Glide.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) ((HashMap )mDataLive.get("videoData")).get("originalImages"), "portrait", "feature"))
                    .apply(RequestOptions.bitmapTransform(new BlurTransformation(25, 2)))
                    .into(mMainBanner);
        }
        else {
            Glide.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) mData.get("originalImages"), "portrait", "feature"))
                    .into(mTopBanner);
            Glide.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) mData.get("originalImages"), "portrait", "feature"))
                    .apply(RequestOptions.bitmapTransform(new BlurTransformation(25, 2)))
                    .into(mMainBanner);
        }

        mDetail.setOnClickListener(v -> {

            Intent data = new Intent();
            data.putExtra("isLive",ControlPageAdapter.isLive());
            if (ControlPageAdapter.isLive()) {
                data.putExtra("item",mDataLive);
            } else {
                data.putExtra("item",mData);
            }
            getActivity().setResult(getActivity().RESULT_OK,data);
            getActivity().finish();
        });

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

    String getGenresFromArray(ArrayList<HashMap> genres) {
        String genre = "";
        for (int i = 0; i < genres.size(); i++) {
            genre = genre.concat(" ");
            genre = genre.concat(genres.get(i).get("name").toString());
        }
        return genre;
    }
}
