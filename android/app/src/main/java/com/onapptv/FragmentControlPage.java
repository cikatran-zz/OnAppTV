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

import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.google.gson.Gson;
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
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.onapptv.custombrightcoveplayer.GlideApp;


import org.json.JSONArray;
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

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.schedulers.Schedulers;
import jp.wasabeef.glide.transformations.BlurTransformation;
import tv.hi_global.stbapi.Api;
import userkit.sdk.UserKit;

import static com.liulishuo.filedownloader.model.FileDownloadStatus.progress;

@RequiresApi(api = Build.VERSION_CODES.M)
public class FragmentControlPage extends Fragment {
    private final String NO_VIDEO_URL = "no_video_url";

    SeekBar mRealSeek, mFakeSeek;
    RelativeLayout mTopContainer;
    ImageView mTopBanner, mMainBanner;
    ProgressBar mProgress;
    HashMap mData, mDataLive;
    ImageView mDetail, mDismiss, mRecord, mFavorite, mShare, mStartOver, mCaption, mPlay, mBackward, mFastward;
    ImageView mOrientationButton;
    TextView mTitle, mGenres, mPassedTv, mEtrTime;
    GetTimer mTimer;
    Activity activity;

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
    Gson gson = new Gson();

    interface OnPlayFinished {
        void nextPage();
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        this.activity = activity;
    }

    public void setProgress(int progress) {
        if (mData != null && !isDragging && mProgress != null) {
            currentProgress = progress;
            float percent = progress / mOffsetRate;
            mProgress.setProgress((int) (percent / (deviceWidth / 100)));
            int hours = progress / 3600;
            int minutes = (progress % 3600) / 60;
            int seconds = progress - hours * 3600 - minutes * 60;
            String str = String.format("%02d:%02d:%02d",hours, minutes, seconds);
            mPassedTv.setText(str);
            int etr_time;
            if (durations > progress) {
                etr_time = (int) (durations - progress);
                int etr_hours = etr_time / 3600;
                int etr_minutes = (etr_time % 3600) / 60;
                int etr_seconds = etr_time - etr_hours * 3600 - etr_minutes * 60;
                String etr = "-" + String.format("%02d:%02d:%02d", etr_hours, etr_minutes, etr_seconds).toString();
                mEtrTime.setText(etr);
            }
        }
        else {
            if (!isDragging) new Handler().postDelayed((Runnable) () -> {

            }, 3000);
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
                        long current = (date.getTime() - start.getTime()) / 1000;
                        int hours = (int) (current / 3600);
                        int minutes = (int) (current % 3600) / 60;
                        int seconds = (int) (current - hours * 3600 - minutes * 60);
                        String str = String.format("%02d:%02d:%02d", hours,minutes, seconds);
                        mPassedTv.setText(str);

                        long etr = (end.getTime() - date.getTime()) / 1000;
                        int etr_hours = (int) (etr / 3600);
                        int etr_minutes = (int) ((etr % 3600) / 60);
                        int etr_seconds = (int) (etr - etr_hours * 3600 - etr_minutes * 60);
                        String etrText = "-" + String.format("%02d:%02d:%02d", etr_hours, etr_minutes, etr_seconds);
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
                intent.putExtra(BrightcoveActivity.METADATA, new HashMap<>());
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

    View.OnClickListener startOver = v -> {
        if (Api.sharedApi().hIG_IsConnect()) {
            Api.sharedApi().hIG_PlayMediaSetPosition(0, (aBoolean, s) -> {

            });
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
            mOffsetRate = durations / deviceWidth;
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
            mFakeSeek.setClickable(false);
        }
        else {
            mTopContainer.setOnTouchListener((v, event) -> {
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


            mPlay.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (Api.sharedApi().hIG_IsConnect()) {
                        if (mData != null) {
                            // VOD
                            if (isPlaying == null) {
                                Api.sharedApi().hIG_PlayMediaStart(0, videoUrl, (aBoolean, s) -> {
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
                }
            });

            mBackward.setOnClickListener(v -> {
                if (Api.sharedApi().hIG_IsConnect()) {
                    Api.sharedApi().hIG_PlayMediaGetPosition((b, i) -> {
                        JSONObject obj = new JSONObject();
                        try {
                            obj.put("playPosition", i - 10);
                            Api.sharedApi().hIG_PlayMediaSetPosition(obj.toString(), s -> {
                            });
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    });
                }
            });
            mFastward.setOnClickListener(v -> {
                if (Api.sharedApi().hIG_IsConnect()) {
                    Api.sharedApi().hIG_PlayMediaGetPosition((b, i) -> {
                        JSONObject obj = new JSONObject();
                        try {
                            obj.put("playPosition", i + 10);
                            Api.sharedApi().hIG_PlayMediaSetPosition(obj.toString(), s -> {
                            });
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    });
                }
            });
            mStartOver.setOnClickListener(startOver);

            mRecord.setOnClickListener(v -> {
                if (isRecorded) {
                    if (mDataLive != null) {
                        Api.sharedApi().hIG_RecordPvrStop((aBoolean, s) -> {
                            if (aBoolean) isRecorded = true;
                        });
                    }
                    else {
                        //Stop download execute
//                        try {
//                            JSONObject obj = new JSONObject();
//                            obj.put("remove_flag", 1);
//                            obj.put("contentId", mData.get("contentId").toString());
//                            obj.put("url", videoUrl);
//                            obj.put("destination_path", "/C/Downloads");
//                            Api.sharedApi().hIG_MediaDownloadStop(1, "/C/Downloads", videoUrl, (aBoolean, s) -> {
//                                if (aBoolean) {
//                                    UserKit.getInstance().getProfileManager().getProperty("download_list", HashMap.class)
//                                            .subscribeOn(Schedulers.io())
//                                            .observeOn(AndroidSchedulers.mainThread())
//                                            .subscribe(value -> {
//                                                if (value.isPresent()) {
//                                                    JSONObject object = gson.fromJson(value.get().toString(), JSONObject.class);
//
//                                                } else {
//
//                                                }
//
//                                            }, null, null);
//                                }
//                            });
//                        } catch (JSONException e) {
//                            e.printStackTrace();
//                        }
//                        isRecorded = false;
                        showDialogWithMessage("Download on Android will be available soon");
                    }
                }
                else {
                    if (mDataLive != null) {
                        try {
                            record();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                    else {
                        //Download Execute
//                        JSONObject obj = new JSONObject();
//                        try {
//                            obj.put("remove_flag", 1);
//                            obj.put("contentId", mData.get("contentId").toString());
//                            obj.put("url", videoUrl);
//                            obj.put("destination_path", "/C/Downloads");
//                            JSONArray array = new JSONArray();
//
//                            HashMap map = new HashMap();
//                            map.put("dataArr", "[]");
//                            UserKit.getInstance().getProfileManager().set("download_list", map)
//                                    .subscribeOn(Schedulers.io())
//                                    .observeOn(AndroidSchedulers.mainThread())
//                                    .subscribe();
//                        } catch (JSONException e) {
//                            e.printStackTrace();
//                        }
//                        isRecorded = true;
                        showDialogWithMessage("Download on Android will be available soon");

                    }
                }
            });

            mFavorite.setOnClickListener(v -> {
                if (isFavorite) {
                    mFavorite.setBackground(getResources().getDrawable(R.drawable.circle_button_bg));
                    isFavorite = false;
                }
                else {
                    mFavorite.setBackground(getResources().getDrawable(R.drawable.circle_button_bg_pink));
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
            GlideApp.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) ((HashMap) mDataLive.get("videoData")).get("originalImages"), "portrait", "feature"))
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .into(mTopBanner);
            GlideApp.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) ((HashMap )mDataLive.get("videoData")).get("originalImages"), "portrait", "feature"))
                    .apply(RequestOptions.bitmapTransform(new BlurTransformation(100, 2)))
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .into(mMainBanner);
        }
        else {
            GlideApp.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) mData.get("originalImages"), "portrait", "feature"))
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .into(mTopBanner);
            GlideApp.with(getContext())
                    .load(getImageFromArray((ArrayList<HashMap>) mData.get("originalImages"), "portrait", "feature"))
                    .apply(RequestOptions.bitmapTransform(new BlurTransformation(100, 2)))
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .into(mMainBanner);
        }

        mDetail.setOnClickListener(v -> {
            switch (ControlPageAdapter.getStatus()) {
                case ControlPageAdapter.IS_FROM_BANNER: {
                    WritableMap params = Arguments.createMap();
                    Gson gson = new Gson();
                    String itemJson = gson.toJson(mData);
                    params.putString("item", itemJson);
                    params.putBoolean("isLive", ControlPageAdapter.isLive());
                    sendEvent(((MainApplication) getActivity().getApplication()).getReactContext(),
                            "bannerDetailsPage",
                            params);
                    break;
                }
                case ControlPageAdapter.IS_FROM_LIVE_DETAILS: {
                    WritableMap params = Arguments.createMap();
                    Gson gson = new Gson();
                    params.putString("item", gson.toJson(mDataLive));
                    params.putBoolean("isLive", true);
                    sendEvent(((MainApplication) getActivity().getApplication()).getReactContext(),
                            "reloadDetailsPage",
                            params);
                    break;
                }
                case ControlPageAdapter.IS_FROM_VOD_DETAILS: {
                    WritableMap params = Arguments.createMap();
                    Gson gson = new Gson();
                    params.putString("item", gson.toJson(mData));
                    params.putBoolean("isLive", false);
                    sendEvent(((MainApplication) getActivity().getApplication()).getReactContext(),
                            "reloadDetailsPage",
                            params);
                    break;
                }
                default:
                    break;
            }
            getActivity().finish();
        });

        mDismiss.setOnClickListener(v -> {
            Intent data = new Intent();
            data.putExtra("dismiss", true);
            data.putExtra("isFromBanner", ControlPageAdapter.isFromBanner());
            WritableMap params = Arguments.createMap();
            params.putBoolean("isFromBanner", ControlPageAdapter.isFromBanner());
            params.putBoolean("dismiss", true);
            sendEvent(((MainApplication) getActivity().getApplication()).getReactContext(),
                    "dismissControlPage",
                    params);
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

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
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
            int deviceWidth = getContext().getResources().getDisplayMetrics().widthPixels;
            float distance = e2.getX() - e1.getX();
            isDragging = true;
            mProgress.setProgress((int) ((currentProgress + distance * mOffsetRate) / mOffsetRate)  * 100/ deviceWidth );
            Api.sharedApi().hIG_PlayMediaSetPosition((int) ((currentProgress + distance * mOffsetRate) * durations / 100), (b, i) -> {
            });
            return false;
        }

        @RequiresApi(api = Build.VERSION_CODES.M)
        public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX,
                               float velocityY) {
            isDragging = false;
            int deviceWidth = getContext().getResources().getDisplayMetrics().widthPixels;
            float distance = e2.getX() - e1.getX();
            currentProgress = (int) (currentProgress + distance * mOffsetRate);
            mProgress.setProgress((int) ((currentProgress / mOffsetRate) * 100 / deviceWidth));
            Api.sharedApi().hIG_PlayMediaSetPosition(currentProgress, (b, i) -> {
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
        else {
            if (mTimer != null) mTimer.cancel(true);
            if (mDataLive != null) {
                if (mPlay != null )mPlay.setImageResource(R.mipmap.ic_ontv);
                if (isPlaying != null) isPlaying = false;
            }
            else {
                if (mPlay != null )mPlay.setImageResource(R.mipmap.ic_play);
                if (isPlaying != null) isPlaying = false;
                setProgress(0);
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
