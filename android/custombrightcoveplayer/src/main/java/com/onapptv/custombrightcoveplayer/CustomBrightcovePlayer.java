package com.onapptv.custombrightcoveplayer;

import android.content.Context;
import android.media.AudioManager;
import android.util.AttributeSet;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.accessibility.AccessibilityManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.AnimationSet;
import android.view.animation.DecelerateInterpolator;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.SeekBar;
import android.widget.TextView;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.edge.VideoListener;
import com.brightcove.player.event.Component;
import com.brightcove.player.event.Default;
import com.brightcove.player.event.Event;
import com.brightcove.player.event.EventEmitter;
import com.brightcove.player.event.EventListener;
import com.brightcove.player.event.EventType;
import com.brightcove.player.mediacontroller.BrightcoveMediaController;
import com.brightcove.player.model.CuePoint;
import com.brightcove.player.model.Video;
import com.brightcove.player.util.ErrorUtil;
import com.brightcove.player.util.StringUtil;
import com.brightcove.player.view.BrightcoveExoPlayerVideoView;
import com.bumptech.glide.request.RequestOptions;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;

import io.reactivex.Completable;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.schedulers.Schedulers;
import userkit.sdk.OnDemandPlaybackEventRecorder;
import userkit.sdk.PlayerState;
import userkit.sdk.UserKit;
import userkit.sdk.model.RemoveQueryCommand;

/**
 * Created by oldmen on 3/1/18.
 */

public class CustomBrightcovePlayer extends FrameLayout implements Component {
    private final String TAG = this.getClass().getName();
    private static final int sDefaultTimeout = 3000;
    private final int FORWARD = 1;
    private final int BACKWARD = 0;

    protected EventEmitter eventEmitter;
    protected Map<String, Integer> listenerTokens;
    private View mControlBar;
    private final AccessibilityManager mAccessibilityManager;
    private BrightcoveExoPlayerVideoView mPlayerVideoView;
    private Context mContext;
    private TextView mCurrTime;
    private TextView mEndTime;
    private Button mPlayBtn;
    private ProgressBar mProgressBar;
    private SeekBar mVolumeSeekBar;
    private ImageView mForwardAnimation;
    private ImageView mBackwardAnimation;
    private Button mRewindToggle;
    private Button mSubtitleToggle;
    private ImageView mThumbnailPreview;

    private int captionsDialogOkToken;
    private int captionsDialogSettingsToken;
    private int activityResumedToken;
    private int fragmentResumedToken;

    private int distanceDragging = 0;
    private Boolean isDragging = false;
    private Boolean isShowing = true;
    private int endTime = 0;
    private long currentTimeInMs = 0;
    private final AnimationSet animationSet = new AnimationSet(true);
    private WebView mWebview;

    private String videoId;
    private String accountId;
    private String policyKey;
    private Map<String, Object> metadata = new HashMap<>();
    OnDemandPlaybackEventRecorder mPlaybackRecorder = null;

    private String CONTINUE_WATCHING = "continue_watching";
    private String STOP_POSITION = "stop_position";
    private String ID = "id";


    public void setVideoKey(String id) {
        this.videoId = id;
        playVideoWithReactParams();
    }

    public String getVideoKey() {
        return videoId;
    }

    public void setAccountId(String id) {
        this.accountId = id;
        playVideoWithReactParams();
    }

    public String getAccountId() {
        return accountId;
    }

    public void setPolicyKey(String id) {
        this.policyKey = id;
        playVideoWithReactParams();
    }

    public String getPolicyKey() {
        return policyKey;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    private void playVideoWithReactParams() {
        if (videoId != null && accountId != null && policyKey != null) {
            Catalog catalog = new Catalog(getEventEmitter(),
                    accountId,
                    policyKey);
            catalog.findVideoByID(videoId, new VideoListener() {
                @Override
                public void onVideo(Video video) {

                    UserKit.getInstance().getProfileManager().searchChildInArray(CONTINUE_WATCHING,
                            RemoveQueryCommand.eq(ID, video.getId()),
                            JSONObject.class).map(data -> {
                        if (data.size() > 0)
                            return (int) ((Map) data.get(0)).get(STOP_POSITION);
                        else
                            return 0;
                    }).subscribeOn(Schedulers.io())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(stopPosition -> {
                                mPlayerVideoView.seekTo(stopPosition * 1000);
                                if (!mPlayerVideoView.isPlaying())
                                    mPlayerVideoView.start();
                            }, error -> Log.d(TAG, error.toString()));


                    mPlaybackRecorder = new OnDemandPlaybackEventRecorder(TrackUserkit.createItemFromBrightcove(metadata));
                    mPlayerVideoView.add(video);
                    mPlayerVideoView.start();
                }
            });
        }
    }

    /**
     * AbstractComponent function
     **/
    public void addListener(String eventType, EventListener listener) {
        this.listenerTokens.put(eventType, this.eventEmitter.on(eventType, listener));
    }

    public void addOnceListener(String eventType, EventListener listener) {
        this.listenerTokens.put(eventType, this.eventEmitter.once(eventType, listener));
    }

    public void removeListener(String eventType) {
        if (this.listenerTokens.containsKey(eventType)) {
            this.eventEmitter.off(eventType, this.listenerTokens.get(eventType));
        }

    }

    public void removeListeners() {
        Iterator var1 = this.listenerTokens.keySet().iterator();

        while (var1.hasNext()) {
            String key = (String) var1.next();
            this.eventEmitter.off(key, this.listenerTokens.get(key));
        }

        this.listenerTokens.clear();
    }

    public EventEmitter getEventEmitter() {
        return this.eventEmitter;
    }

    /**
     * Init function
     **/
    private void initAbstractComponent() {
        this.eventEmitter = mPlayerVideoView.getEventEmitter();
        this.listenerTokens = new HashMap();
        if (eventEmitter == null) {
            throw new IllegalArgumentException(ErrorUtil.getMessage("eventEmitterRequired"));
        }
    }

    private void initLayout() {
        View view = inflate(mContext, R.layout.custom_brightcove, this);
        view.setLongClickable(true);
        mPlayerVideoView = findViewById(R.id.player);
        mControlBar = findViewById(R.id.brightcove_control);
        mCurrTime = findViewById(R.id.current_time);
        mEndTime = findViewById(R.id.end_time);
        mPlayBtn = findViewById(R.id.play);
        mProgressBar = findViewById(R.id.progress_bar);
        mVolumeSeekBar = findViewById(R.id.volume_seek);
        mForwardAnimation = findViewById(R.id.animation_forward);
        mBackwardAnimation = findViewById(R.id.animation_backward);
        mRewindToggle = findViewById(R.id.rewind);
        mSubtitleToggle = findViewById(R.id.subtitle);
        mWebview = findViewById(R.id.loading_spinner);
    }

    private void initPlayer() {
        initEventListener();
        initSubtitle();

        mPlayerVideoView.setMediaController((BrightcoveMediaController) null);
        mThumbnailPreview = findViewById(R.id.thumbnail_preview);
        mThumbnailPreview.setTranslationY((mContext.getResources().getDisplayMetrics().heightPixels * 2f / 9f));
        mWebview.setWebViewClient(new WebViewClient());
        mWebview.setWebChromeClient(new WebChromeClient());
        mWebview.loadUrl("file:///android_asset/spinner.html");
    }

    private void initDoubleTapForwardAnimation() {
        mForwardAnimation.setImageResource(R.drawable.forward_shape);
        mBackwardAnimation.setImageResource(R.drawable.backward_shape);

        animationSet.setFillEnabled(true);
        animationSet.setFillAfter(true);
        animationSet.setInterpolator(new DecelerateInterpolator());

        AlphaAnimation animation1 = new AlphaAnimation(0.0f, 1.0f);
        animation1.setDuration(1000);
        animation1.setFillAfter(true);
        animationSet.addAnimation(animation1);

        AlphaAnimation animation2 = new AlphaAnimation(1.0f, 0.0f);
        animation2.setDuration(1000);
        animation2.setFillAfter(true);
        animationSet.addAnimation(animation2);
    }

    private void initEventListener() {
        this.addListener("videoDurationChanged", new VideoDurationChangedHandler());
        ProgressHandler progressHandler = new ProgressHandler();
        this.addListener("progress", progressHandler);
        this.addListener("completed", progressHandler);
        this.addListener("seekTo", new SeekToHandler());
        PlayPauseHandler playPauseHandler = new PlayPauseHandler();
        this.addListener("didPlay", playPauseHandler);
        this.addListener("didPause", playPauseHandler);
        this.addListener("didSetVideo", playPauseHandler);
//        this.addListener("stop", playPauseHandler);
        this.addListener("activityResumed", playPauseHandler);
        this.addListener("bufferedUpdate", new BufferedUpdateHandler());

        //start play controller state
        this.addListener("play", new PlayControllerImp());
        this.addListener("stop", new StopControllerImp());
        this.addListener("pause", new PauseControllerImp());
        this.addListener("error", new ErrorControllerImp());
        // end play controller state

        this.addListener("storeBrightCove", new StoreBrightCoveImp());
    }

    private class PlayControllerImp implements EventListener {
        @Override
        public void processEvent(Event event) {
            try {
                int position = mPlayerVideoView.getCurrentPosition();
                mPlaybackRecorder.recordPlayerState(PlayerState.PLAY, position / 1000.0);
            } catch (Exception e) {
                Log.d(TAG, e.toString());
            }
        }
    }

    private class StopControllerImp implements EventListener {
        @Override
        public void processEvent(Event event) {
            try {
                int position = -1;
                if (event.properties.containsKey("playheadPosition")) {
                    position = event.getIntegerProperty("playheadPosition");
                }
                if (mPlayerVideoView == null) {
                    mPlaybackRecorder.stopRecording(position / 1000.0, -1.0, null);
                } else {
                    mPlaybackRecorder.stopRecording(position / 1000.0, mPlayerVideoView.getDuration() / 1000.0, null);
                }
            } catch (Exception e) {
                Log.d(TAG, e.toString());
            }
        }
    }

    private class PauseControllerImp implements EventListener {
        @Override
        public void processEvent(Event event) {
            try {
                int position = -1;
                if (event.properties.containsKey("playheadPosition")) {
                    position = event.getIntegerProperty("playheadPosition");
                }
                mPlaybackRecorder.recordPlayerState(PlayerState.PAUSE, position / 1000.0);
            } catch (Exception e) {
                Log.d(TAG, e.toString());
            }
        }
    }

    private class ErrorControllerImp implements EventListener {
        @Override
        public void processEvent(Event event) {
            try {
                int position = -1;
                if (event.properties.containsKey("playheadPosition")) {
                    position = event.getIntegerProperty("playheadPosition");
                }
                String errorMessage = "";
                if (event.properties.containsKey("errorMessage")) {
                    errorMessage = event.properties.get("errorMessage").toString();
                }

                if (mPlayerVideoView == null) {
                    mPlaybackRecorder.stopRecording(position / 1000.0, -1.0, errorMessage);
                } else {
                    mPlaybackRecorder.stopRecording(position / 1000.0, mPlayerVideoView.getDuration() / 1000.0, errorMessage);
                }
            } catch (Exception e) {
                Log.d(TAG, e.toString());
            }
        }
    }

    private void initSubtitle() {

        mPlayerVideoView.getEventEmitter().once(EventType.CAPTIONS_LANGUAGES, new EventListener() {
            @Override
            public void processEvent(Event event) {
                mPlayerVideoView.setClosedCaptioningEnabled(true);
                mPlayerVideoView.setSubtitleLocale("en");
            }
        });
    }

    private void initButtons() {
        mRewindToggle.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                mPlayerVideoView.seekTo(0);
                resetFadeOutCallback();
            }
        });

        mProgressBar.setMax(100);
        mProgressBar.setProgress(0);
        mProgressBar.setProgressDrawable(mContext.getResources().getDrawable(R.drawable.custom_progress));

        mPlayBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                resetFadeOutCallback();
                if (mPlayerVideoView.isPlaying()) {
                    mPlayerVideoView.pause();
                } else {
                    mPlayerVideoView.start();
                }
            }
        });

        final AudioManager leftAm = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
        int maxVolume = leftAm.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        int curVolume = leftAm.getStreamVolume(AudioManager.STREAM_MUSIC);
        mVolumeSeekBar.setMax(maxVolume);
        mVolumeSeekBar.setProgress(curVolume);
        mVolumeSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                leftAm.setStreamVolume(AudioManager.STREAM_MUSIC, progress, 0);
                resetFadeOutCallback();
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });

        mSubtitleToggle.setOnClickListener(new CaptionsDialogLauncher());
    }

    /**
     * Constructor
     **/

    public CustomBrightcovePlayer(Context context) {
        this(context, null);
    }

    public CustomBrightcovePlayer(Context context, AttributeSet attrs) {
        super(context, attrs);
        mContext = context;
        mAccessibilityManager = (AccessibilityManager) mContext.getSystemService(Context.ACCESSIBILITY_SERVICE);

        initLayout();
        initAbstractComponent();
        initPlayer();
        initButtons();
        initDoubleTapForwardAnimation();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        Log.d("MController", "onTouchEvent");
        return doubleTapDetector.onTouchEvent(event);
    }

    public void show() {
        show(sDefaultTimeout);
    }

    public void show(int timeout) {
        if (!isShowing) {
            mControlBar.setVisibility(View.VISIBLE);
        }
        isShowing = true;

        if (timeout != 0 && !mAccessibilityManager.isTouchExplorationEnabled()) {
            removeCallbacks(mFadeOut);
            postDelayed(mFadeOut, timeout);
        }
    }

    public void hide() {
        if (isShowing) {
            mControlBar.setVisibility(View.INVISIBLE);
        }
        isShowing = false;
    }

    private final Runnable mFadeOut = new Runnable() {
        @Override
        public void run() {
            hide();
        }
    };

    private boolean isSeekClick(MotionEvent event, View v) {
        float y = event.getY();
        return !((y < v.getHeight() / 4) || (y > (v.getHeight() * 3 / 4)));
    }

    private int getDoubleTapDirection(MotionEvent event, View v) {
        if (event.getX() < v.getWidth() / 2) {
            return BACKWARD;
        } else return FORWARD;
    }

    /**
     * Handler
     **/

    private class VideoDurationChangedHandler implements EventListener {
        private VideoDurationChangedHandler() {
        }

        @Default
        public void processEvent(Event event) {
            int duration = event.getIntegerProperty("duration");
            mEndTime.setText(StringUtil.stringForTime((long) duration));
            endTime = duration;
        }
    }

    private class ProgressHandler implements EventListener {
        private ProgressHandler() {
        }

        @Default
        public void processEvent(Event event) {
            if (!isDragging) {

                int position = event.getIntegerProperty("playheadPosition");
                if (mCurrTime != null) {
                    mCurrTime.setText(StringUtil.stringForTime((long) position));
                    currentTimeInMs = (long) position;
                }

                int duration = event.getIntegerProperty("duration");
                if (!mPlayerVideoView.getVideoDisplay().isLive() && mEndTime != null) {
                    int etr = duration - position;
                    mEndTime.setText(StringUtil.stringForTime((long) etr));
                }
                mProgressBar.setProgress((int) ((float) (position * 100 / duration)));

            } else {
                Log.d(TAG, "The seek bar is being dragged.  No progress updates are being applied.");
            }

        }
    }

    private class SeekToHandler implements EventListener {
        private SeekToHandler() {
        }

        @Default
        public void processEvent(Event event) {
            isDragging = false;
            bufferLoading();
            int position;
            if (event.properties.containsKey("originalSeekPosition")) {
                position = event.getIntegerProperty("originalSeekPosition");
            } else {
                position = event.getIntegerProperty("seekPosition");
            }

            if (mCurrTime != null) {
                mCurrTime.setText(StringUtil.stringForTime((long) position));
            }

            try {
                mPlaybackRecorder.recordPlayerState(PlayerState.SEEK, position / 1000.0);
            } catch (Exception e) {
                Log.d(TAG, e.toString());
            }

        }
    }

    private class BufferedUpdateHandler implements EventListener {
        private BufferedUpdateHandler() {
        }

        @Override
        public void processEvent(Event event) {
            int percentComplete = event.getIntegerProperty("percentComplete");
            if ((mWebview.getVisibility() != VISIBLE) && (percentComplete < (currentTimeInMs * 100.0f / endTime) + 5)) {
                bufferLoading();
            }
        }
    }

    private class CaptionsDialogLauncher implements OnClickListener {
        private CaptionsDialogLauncher() {
        }

        public void onClick(View view) {
            Log.d(TAG, "Showing the captions dialog.");
            if (mPlayerVideoView.isPlaying()) {
                mPlayerVideoView.pause();
                CustomBrightcovePlayer.this.captionsDialogOkToken = CustomBrightcovePlayer.this.eventEmitter.once("captionsDialogOk", new EventListener() {
                    public void processEvent(Event event) {
                        mPlayerVideoView.start();
                        CustomBrightcovePlayer.this.eventEmitter.off("captionsDialogSettings", CustomBrightcovePlayer.this.captionsDialogSettingsToken);
                    }
                });
                CustomBrightcovePlayer.this.captionsDialogSettingsToken = CustomBrightcovePlayer.this.eventEmitter.once("captionsDialogSettings", new EventListener() {
                    public void processEvent(Event event) {
                        CustomBrightcovePlayer.this.activityResumedToken = CustomBrightcovePlayer.this.eventEmitter.once("activityResumed", new EventListener() {
                            public void processEvent(Event event) {
                                mPlayerVideoView.start();
                                CustomBrightcovePlayer.this.eventEmitter.off("fragmentResumed", CustomBrightcovePlayer.this.fragmentResumedToken);
                            }
                        });
                        CustomBrightcovePlayer.this.fragmentResumedToken = CustomBrightcovePlayer.this.eventEmitter.once("fragmentResumed", new EventListener() {
                            public void processEvent(Event event) {
                                mPlayerVideoView.start();
                                CustomBrightcovePlayer.this.eventEmitter.off("activityResumed", CustomBrightcovePlayer.this.activityResumedToken);
                            }
                        });
                        CustomBrightcovePlayer.this.eventEmitter.off("captionsDialogOk", CustomBrightcovePlayer.this.captionsDialogOkToken);
                    }
                });
            }

            mPlayerVideoView.getClosedCaptioningController().showCaptionsDialog();

            resetFadeOutCallback();
        }
    }

    private class PlayPauseHandler implements EventListener {
        private PlayPauseHandler() {
        }

        @Default
        public void processEvent(Event event) {
            Log.d(TAG, String.format(Locale.getDefault(), "Process event: %s.", event.getType()));
            switch (event.getType()) {
                case "didPause":
                    removeCallbacks(mFadeOut);
                    postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            if (!mPlayerVideoView.isPlaying() && !isDragging) {
                                mPlayerVideoView.start();
                            }
                        }
                    }, 2000);
                    mPlayBtn.setBackground(mContext.getResources().getDrawable(R.drawable.play));
                    break;
                case "didPlay":
                    postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            hide();
                            mWebview.setVisibility(INVISIBLE);
                        }
                    }, 500);
                    mPlayBtn.setBackground(mContext.getResources().getDrawable(R.drawable.pause));
                    break;
                default:
                    break;
            }
        }
    }

    private Completable storeVideo(double videoLength, double currentSeconds) {
        if (currentSeconds < videoLength - 30) {
            return UserKit.getInstance().getProfileManager().removeChildInArray(CONTINUE_WATCHING, RemoveQueryCommand.eq(ID, getVideoKey()))
                    .doOnComplete(() -> {
                        HashMap<String, Object> movieJson = new HashMap<>();
                        movieJson.put(STOP_POSITION, currentSeconds);
                        movieJson.put(ID, getVideoKey());
//                            movieJson.put(UserKitKeys.POSTER, mVideo?.properties?.get(Video.Fields.STILL_IMAGE_URI))
                        movieJson.putAll(metadata);
                        UserKit.getInstance().getProfileManager().append(CONTINUE_WATCHING, movieJson);
                    }).doOnError(error -> Log.d(TAG, error.toString()));
        } else {
            return UserKit.getInstance().getProfileManager().removeChildInArray(CONTINUE_WATCHING, RemoveQueryCommand.eq(ID, getVideoKey()))
                    .doOnComplete(() -> {
                    })
                    .doOnError(error -> Log.d(TAG, error.toString()));
        }
    }

    private class StoreBrightCoveImp implements EventListener {
        @Override
        public void processEvent(Event event) {
            if (mPlayerVideoView != null) {
                storeVideo(mPlayerVideoView.getDuration() / 1000.0, mPlayerVideoView.getCurrentPosition() / 1000.0)
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(() -> {
                            mPlayerVideoView.stopPlayback();
                            mPlayerVideoView.clear();
                        });
            }
        }
    }

    /**
     * Double tap gesture
     **/
    private final GestureDetector doubleTapDetector = new GestureDetector(mContext, new GestureDetector.SimpleOnGestureListener() {

        @Override
        public boolean onDoubleTap(MotionEvent e) {

            Log.v(TAG, "DoubleTap");
            int direction = getDoubleTapDirection(e, mProgressBar);

            float msec = direction == FORWARD ? currentTimeInMs + 10000 : currentTimeInMs - 10000;
            mPlayerVideoView.seekTo((int) msec);
            if (direction == FORWARD) {
                mBackwardAnimation.clearAnimation();
                mBackwardAnimation.setVisibility(INVISIBLE);
                mForwardAnimation.setVisibility(VISIBLE);
                mForwardAnimation.startAnimation(animationSet);
            } else {
                mForwardAnimation.clearAnimation();
                mForwardAnimation.setVisibility(INVISIBLE);
                mBackwardAnimation.setVisibility(VISIBLE);
                mBackwardAnimation.startAnimation(animationSet);
            }
            return false;
        }

        CuePoint lastCuePoint = new CuePoint(-1, "CODE", new HashMap<String, Object>());

        private void displayThumbnails(String url, int progress) {
            int deviceWidth = mContext.getResources().getDisplayMetrics().widthPixels;
            GlideApp.with(mContext).load(url).apply(RequestOptions.bitmapTransform(new RoundedCornersTransformation(20, 0))).into(mThumbnailPreview);
            int currentPos = (int) ((progress / 100f) * deviceWidth);
            if (currentPos - mThumbnailPreview.getWidth() / 2 <= 0) {
                mThumbnailPreview.setTranslationX(0);
            } else if (currentPos + mThumbnailPreview.getWidth() <= deviceWidth - 30) {
                mThumbnailPreview.setTranslationX(currentPos - mThumbnailPreview.getWidth() / 2);
            } else {
                mThumbnailPreview.setTranslationX(deviceWidth - mThumbnailPreview.getWidth() - 30);
            }
        }

        public void updateThumbnailsPosition(float currentSecond, int progress) {
            int roundProgress = ((int) currentSecond) / 1000 * 1000;
            if (lastCuePoint.getPosition() == roundProgress) {
                displayThumbnails(lastCuePoint.getProperties().get("metadata").toString(), progress);
            } else {
                if (mPlayerVideoView != null) {
                    try {
                        Video video = mPlayerVideoView.get(0);
                        if (video != null) {
                            CuePoint currentCuePoint = null;
                            for (CuePoint cue : video.getCuePoints()) {
                                if (cue.getPosition() <= roundProgress) {
                                    currentCuePoint = cue;
                                } else {
                                    break;
                                }
                            }
                            if (currentCuePoint != null) {
                                if (currentCuePoint.getProperties().containsKey("metadata")) {
                                    lastCuePoint = currentCuePoint;
                                    displayThumbnails(currentCuePoint.getProperties().get("metadata").toString(), progress);
                                }
                            }
                        }
                    } catch (Exception e) {
                        Log.d(TAG, e.toString());
                    }
                }
            }
        }

        @Override
        public boolean onScroll(MotionEvent e1, MotionEvent e2,
                                float distanceX, float distanceY) {
            int deviceWidth = mContext.getResources().getDisplayMetrics().widthPixels;
            mThumbnailPreview.setVisibility(VISIBLE);
//            if (!isDragging) {
//                // Start dragging
//                resetFadeOutCallback();
//                int startProgressCoordinate = (int) (e1.getX() * 100 / deviceWidth);
//                distanceDragging = mProgressBar.getProgress() - startProgressCoordinate;
//            }

            isDragging = true;
            if (mPlayerVideoView.isPlaying()) mPlayerVideoView.pause();

            removeCallbacks(mFadeOut);

            int progress = (int) ((e2.getX() * 100 / deviceWidth) + distanceDragging);
            float msec = (progress / 100.0f) * endTime;
            updateThumbnailsPosition(msec, progress);
            mProgressBar.setProgress(progress);
            if (mCurrTime != null) {
                mCurrTime.setText(StringUtil.stringForTime((long) msec));
                mEndTime.setText(StringUtil.stringForTime((long) (endTime - msec)));
            }

            return false;
        }

        @Override
        public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX,
                               float velocityY) {
            if (isDragging) {
                resetFadeOutCallback();
                isDragging = false;
                int deviceWidth = mContext.getResources().getDisplayMetrics().widthPixels;
                int progress = (int) ((e2.getX() * 100 / deviceWidth) + distanceDragging);

                float msec = (progress / 100.0f) * endTime;
                mPlayerVideoView.seekTo((int) msec);
                mPlayerVideoView.start();
                mThumbnailPreview.setVisibility(INVISIBLE);
                postDelayed(mFadeOut, sDefaultTimeout);

            }
            return false;
        }

        @Override
        public void onLongPress(MotionEvent e) {
            Log.v(TAG, "onDoubleTapEvent");
            super.onLongPress(e);

        }

        @Override
        public boolean onDoubleTapEvent(MotionEvent e) {
            Log.v(TAG, "onDoubleTapEvent");
            return true;
        }

        @Override
        public boolean onSingleTapConfirmed(MotionEvent e) {
            Log.v(TAG, "onSingleTapConfirmed");
            if (e.getAction() == e.ACTION_DOWN) {
                if (isShowing) {
                    if (isSeekClick(e, mProgressBar)) {
                        int deviceWidth = mContext.getResources().getDisplayMetrics().widthPixels;
                        int progress = (int) (e.getX() * 100 / deviceWidth);

                        float msec = (progress / 100.0f) * endTime;
                        mPlayerVideoView.seekTo((int) msec);
                    } else {
                        hide();
                    }
                } else {
                    show();
                }
            }
            return true;
        }

        @Override
        public boolean onDown(MotionEvent e) {
            Log.v(TAG, "onDown");
            return true;
        }

    });


    /**
     * Public function
     **/

    public BrightcoveExoPlayerVideoView getPlayerVideoView() {
        return mPlayerVideoView;
    }

    public View getControlBar() {
        return mControlBar;
    }

    public void resetFadeOutCallback() {
        removeCallbacks(mFadeOut);
        postDelayed(mFadeOut, sDefaultTimeout);
    }

    private void bufferLoading() {
        mWebview.setVisibility(VISIBLE);
        getEventEmitter().once("progress", new EventListener() {
            @Override
            public void processEvent(Event event) {
                mWebview.setVisibility(INVISIBLE);
            }
        });
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
    }

}
