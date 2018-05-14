package com.onapptv;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
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
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.Target;
import com.onapptv.R;
import com.onapptv.OTVDialog;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;

import jp.wasabeef.glide.transformations.BlurTransformation;
import tv.hi_global.stbapi.Api;

import static com.liulishuo.filedownloader.model.FileDownloadStatus.progress;

@RequiresApi(api = Build.VERSION_CODES.M)
public class FragmentControlPage extends Fragment {
    private final String NO_VIDEO_URL = "no_video_url";

    SeekBar mRealSeek, mFakeSeek;
    RelativeLayout mTopContainer;
    ImageView mTopBanner, mMainBanner;
    ProgressBar mProgress;
    HashMap mData, mDataLive;
    ImageButton mDetail, mDismiss, mRecord, mFavorite, mShare, mStartOver, mCaption, mPlay, mBackward, mFastward;
    ImageButton mOrientationButton;
    TextView mTitle, mGenres, mPassedTv, mEtrTime;
    GetTimer mTimer;
    Activity activity;
    WebView mLoading;

    String videoUrl = NO_VIDEO_URL;
    Boolean isDragging = false;
    Boolean isPlaying = null;
    int currentProgress = 0;
    float durations = 0;
    float mOffsetRate = 0.0f;
    int deviceHeight;
    int deviceWidth;
    Boolean isRecorded = false;
    Boolean isFavorite = false;

    interface OnPlayFinished {
        void nextPage();
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        this.activity = activity;
    }

    public void setProgress(int progress) {
        if (mData != null) {
            currentProgress = progress;
            float percent = progress / mOffsetRate;
            mProgress.setProgress((int) (percent / (deviceWidth / 100)));
            int minutes = progress / 60;
            int seconds = progress % 60;
            String str = String.format("%02d:%02d", minutes, seconds);
            mPassedTv.setText(str);
            int etr_time = (int) durations;
            if (durations > progress) {
                etr_time = (int) (durations - progress);
                String etr = "-" + String.format("%02d:%02d", etr_time / 60, etr_time % 60).toString();
                mEtrTime.setText(etr);
            }
        }
    }

    @Override
    public void onDestroy() {
        if (mTimer != null)
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

    Handler liveTimeHandler;

    @Override
    public void onCreate(Bundle onSavedInstanceState) {
        super.onCreate(onSavedInstanceState);

        if (ControlPageAdapter.isLive()) {
            mDataLive = (HashMap) getArguments().getSerializable("item");
            liveTimeHandler = new Handler();
            liveTimeHandler.postDelayed(new Runnable() {
                private long time = 0;
                @Override
                public void run() {
                    time += 1000;
                    try {
                        Date date = new Date();
                        Date start = fromISO8601UTC(mDataLive.get("startTime").toString());
                        Date end = fromISO8601UTC(mDataLive.get("endTime").toString());
                        long current = date.getTime() - start.getTime();
                        long etr = end.getTime() - date.getTime();
                        int minutes = (int) (current / 60);
                        int seconds = (int) (current % 60);
                        String str = String.format("%02d:%02d", minutes, seconds);
                        mPassedTv.setText(str);
                        String etrText = "-" + String.format("%02d:%02d", etr / 60, etr % 60);
                        mEtrTime.setText(etrText);
                        mProgress.setProgress((int) (current / (current + etr)) * 100);
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    liveTimeHandler.postDelayed(this, 1000);
                }
            }, 1000);
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

    public Date fromISO8601UTC(String dateStr) throws ParseException {
        dateStr = dateStr.substring(0, dateStr.length()-5);
        SimpleDateFormat inFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            Date date = inFormat.parse(dateStr);  //where dateString is a date in ISO-8601 format
        return date;
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
                                if (mData.get("durationInSeconds") != null)
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
        mOrientationButton = rootView.findViewById(R.id.change_orientation_btn);
        mLoading = rootView.findViewById(R.id.webView_top_banner);

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

            mRecord.setOnClickListener(v -> {
                if (isRecorded) {
                    Api.sharedApi().hIG_RecordPvrStop((aBoolean, s) -> {
                        if (aBoolean) isRecorded = true;
                    });
                    mRecord.setBackgroundColor(getResources().getColor(R.color.mainPinkColor));
                }
                else {
                    if (mDataLive != null) {
                        try {
                            record();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                    else download();
                }
            });

            mFavorite.setOnClickListener(v -> {
                if (isFavorite) {
                    mFavorite.setBackgroundColor(Color.TRANSPARENT);
                    isFavorite = false;
                }
                else {
                    mFavorite.setBackgroundColor(getResources().getColor(R.color.mainPinkColor));
                    isFavorite = true;
                }
            });
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
                    .apply(RequestOptions.bitmapTransform(new BlurTransformation(100, 2)))
                    .into(mMainBanner);
        }
        else {
            Glide.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) mData.get("originalImages"), "portrait", "feature"))
                    .into(mTopBanner);
            Glide.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) mData.get("originalImages"), "portrait", "feature"))
                    .apply(RequestOptions.bitmapTransform(new BlurTransformation(100, 2)))
                    .into(mMainBanner);
        }

        mDetail.setOnClickListener(v -> {
            Intent data = new Intent();
            data.putExtra("isFromBanner", ControlPageAdapter.isFromBanner());
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
            data.putExtra("isFromBanner", ControlPageAdapter.isFromBanner());
            getActivity().setResult(getActivity().RESULT_OK, data);
            getActivity().finish();
        });

        mOrientationButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showDialogWithMessage("Rotate your device to watch on the phone");
            }
        });

        setProgress(0);

        return rootView;
    }

    void download() {
        showDialogWithMessage("Coming soon");
    }

    void record() throws JSONException {
        String title = ((HashMap) mDataLive.get("videoData")).get("title").toString();
        int lcn = Integer.parseInt(((HashMap) mDataLive.get("channelData")).get("lcn").toString());

        JSONObject recordObj = new JSONObject();
        JSONObject recordParams = new JSONObject();
        recordParams.put("startTime", "");
        recordParams.put("recordMode", 1);
        recordParams.put("recordName", title);
        recordParams.put("lCN", lcn);
        recordParams.put("duration", 10000);
        JSONObject metaData = new JSONObject();
        metaData.put("endtime",mDataLive.get("endTime").toString());
        metaData.put("starttime", mDataLive.get("startTime").toString());
        metaData.put("title", title);
        metaData.put("image", getImageFromArray((ArrayList) ((HashMap) mDataLive.get("videoData")).get("originalImages"), "landscape", "feature"));
        metaData.put("subTitle", getGenresFromArray((ArrayList<HashMap>) ((HashMap) mDataLive.get("videoData")).get("genresData")));
        recordObj.put("record_parameter", recordParams);
        recordObj.put("metaData", metaData);

        Api.sharedApi().hIG_RecordPvrStart(recordObj.toString(), s -> {
            try {
                JSONObject result = new JSONObject(s);
                if (result.getInt("return") != 1) {
                    showDialogWithMessage("Record fail!");
                }
                else {
                    isRecorded = true;
                    mRecord.setBackgroundColor(Color.TRANSPARENT);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

        });
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

    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (isVisibleToUser) {
            if (!Api.sharedApi().hIG_IsConnect() && !ControlActivity.getIsDisconneted()) {
                    showDialogWithMessage("Disconnected from STB");
                    ControlActivity.setIsDisconnected(true);
            }
        }
    }

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
        if (genres == null)
            return genre;
        for (int i = 0; i < genres.size(); i++) {
            genre = genre.concat(" ");
            genre = genre.concat(genres.get(i).get("name").toString());
        }
        return genre;
    }
}
