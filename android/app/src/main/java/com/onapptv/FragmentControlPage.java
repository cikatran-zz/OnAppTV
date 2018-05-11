package com.onapptv;

import android.app.Fragment;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.res.Configuration;
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
    TextView mTitle, mGenres, mPassedTv, mEtrTime;
    GetTimer mTimer;

    String videoUrl = NO_VIDEO_URL;
    Boolean isDragging = false;
    Boolean isPlaying = null;
    int currentProgress = 0;
    float durations = 0;
    float mOffsetRate = 0.0f;
    int deviceHeight;
    int deviceWidth;

    interface OnPlayFinished {
        void nextPage();
    }

    public void setProgress(int progress) {
        if (mData != null) {
            currentProgress = progress;
            float percent = progress / mOffsetRate;
            mProgress.setProgress((int) (percent / (deviceWidth / 100)));
            int minutes = progress / (60 * 1000);
            int seconds = (progress / 1000) % 60;
            String str = String.format("%02d:%02d", minutes, seconds);
            mPassedTv.setText(str);
            int etr_time = (int) durations;
            if (durations > progress) {
                etr_time = (int) (durations - progress);
                String etr = "-" + String.format("%02d:%02d", minutes, seconds).toString();
                mEtrTime.setText(etr);
            }
        }
    }

    @Override
    public void onDestroy() {
        mTimer.cancel(true);
        super.onDestroy();
    }

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
            mTimer = new GetTimer(this);
            mData = (HashMap) getArguments().getSerializable("item");
            ControlPageAdapter.getCatalog().findVideoByID(mData.get("contentId").toString(), new VideoListener() {
                @Override
                public void onVideo(Video video) {
                    videoUrl = video.findHighQualitySource(DeliveryType.MP4).getUrl();
                }
            });

            int currentOrientation = getResources().getConfiguration().orientation;
            if (currentOrientation == Configuration.ORIENTATION_LANDSCAPE) {
                // Landscape
                Intent intent = new Intent(getContext(), BrightcoveActivity.class);
                intent.putExtra(BrightcoveActivity.VIDEO_ID, mData.get("contentId").toString());
                intent.putExtra(BrightcoveActivity.ACCOUNT_ID, "5706818955001");
                intent.putExtra(BrightcoveActivity.POLICY_KEY, "BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I");
                getContext().startActivity(intent);
            }
        }


    }

    View.OnClickListener backward = v -> {
        if (Api.sharedApi().hIG_IsConnect()) {
            Api.sharedApi().hIG_PlayMediaGetPosition((b, i) -> {
                Api.sharedApi().hIG_PlayMediaSetPosition(i - 10, (aBoolean, s) -> {

                });
            });
        }
    };

    View.OnClickListener forward = v -> {
        if (Api.sharedApi().hIG_IsConnect()) {
            Api.sharedApi().hIG_PlayMediaGetPosition((b, i) -> {
                Api.sharedApi().hIG_PlayMediaSetPosition(i + 10, (aBoolean, s) -> {

                });
            });
        }
    };

    View.OnClickListener startOver = v -> {
        if (Api.sharedApi().hIG_IsConnect()) {
            Api.sharedApi().hIG_PlayMediaSetPosition(0, (aBoolean, s) -> {

            });
        }
    };

    View.OnClickListener playBtnListener = v -> {
        if (Api.sharedApi().hIG_IsConnect()) {
            if (mData != null) {
                // VOD
                if (isPlaying == null) {
                    Api.sharedApi().hIG_PlayMediaStart(0, videoUrl, (aBoolean, s) -> {
                                Log.v("playMediaOnSuccess", aBoolean.toString());
                                mTimer.execute();
                            }
                    );
                    mPlay.setImageResource(R.mipmap.ic_pause);
                    isPlaying = true;
                } else if (isPlaying) {
                    Api.sharedApi().hIG_PlayMediaPause(s -> {
                    });
                    mPlay.setImageResource(R.mipmap.ic_play);
                    isPlaying = false;
                } else {
                    Api.sharedApi().hIG_PlayMediaResume(s -> {
                    });
                    mPlay.setImageResource(R.mipmap.ic_pause);
                    isPlaying = true;
                }
            }
            else {
                // LIVE
                if (isPlaying == null) {
                    int lcn = Integer.parseInt(((HashMap) mDataLive.get("channelData")).get("lcn").toString());
                    Api.sharedApi().hIG_SetZap(lcn, (aBoolean, s) -> {

                    });
                }
            }
        }
    };

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle bundle) {
        View rootView = inflater.inflate(R.layout.fragment_control_page, container, false);
        deviceHeight  = getContext().getResources().getDisplayMetrics().heightPixels;
        deviceWidth = getContext().getResources().getDisplayMetrics().widthPixels;

        if (mData != null && (mData.get("durationInSeconds") != null)) {
            // offset-rate = width / durations
            durations = Float.parseFloat(mData.get("durationInSeconds").toString());
            mOffsetRate = (Float.parseFloat(mData.get("durationInSeconds").toString())) / deviceWidth;
        }

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
        mPassedTv = rootView.findViewById(R.id.passed_time);
        mEtrTime = rootView.findViewById(R.id.etr_time);

        if (!Api.sharedApi().hIG_IsConnect()) {
            mRecord.setAlpha(0.5f);
            mRecord.setClickable(false);
            mFavorite.setAlpha(0.5f);
            mFavorite.setClickable(false);
            mShare.setAlpha(0.5f);
            mShare.setClickable(false);
            mStartOver.setAlpha(0.5f);
            mStartOver.setClickable(false);
            mCaption.setAlpha(0.5f);
            mCaption.setClickable(false);
            mPlay.setAlpha(0.5f);
            mPlay.setClickable(false);
            mBackward.setAlpha(0.5f);
            mBackward.setClickable(false);
            mFastward.setAlpha(0.5f);
            mFastward.setClickable(false);
        }
        else {
            mTopContainer.setOnTouchListener((v, event) -> {
                Log.v("onTouch", "Top Container");
                return mGestureDetector.onTouchEvent(event);
            });

            mFakeSeek.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    mRealSeek.setProgress(progress);
                    Api.sharedApi().hIG_SetVolume(progress, (aBoolean, s) -> { });
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {

                }

                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {

                }
            });

            mPlay.setOnClickListener(playBtnListener);
            mBackward.setOnClickListener(backward);
            mFastward.setOnClickListener(forward);
            mStartOver.setOnClickListener(startOver);
        }

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
                data.putExtra("item", mDataLive);
            } else {
                data.putExtra("item", mData);
            }
            getActivity().setResult(getActivity().RESULT_OK,data);
            getActivity().finish();
        });

        mDismiss.setOnClickListener(v -> {
            Intent data = new Intent();
            data.putExtra("dismiss", true);
            getActivity().setResult(getActivity().RESULT_OK, data);
            getActivity().finish();
        });

        return rootView;
    }

    private void showDialogWithMessage(String message) {
        FragmentTransaction transaction = ControlPageAdapter.getmFm().beginTransaction();
        transaction.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN);
        transaction.add(android.R.id.content, OTVDialog.shareInstance(message))
                .addToBackStack(null).commit();
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
            Api.sharedApi().hIG_PlayMediaSetPosition((int) (currentProgress * mOffsetRate), (aBoolean, s) -> {

            });
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
