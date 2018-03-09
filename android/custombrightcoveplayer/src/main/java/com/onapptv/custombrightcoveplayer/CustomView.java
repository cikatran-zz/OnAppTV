package com.onapptv.custombrightcoveplayer;

import android.content.Context;
import android.media.AudioManager;
import android.net.Uri;
import android.util.AttributeSet;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.accessibility.AccessibilityManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.AnimationSet;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.SeekBar;
import android.widget.TextView;

import com.brightcove.player.captioning.BrightcoveCaptionFormat;
import com.brightcove.player.event.Component;
import com.brightcove.player.event.Default;
import com.brightcove.player.event.Event;
import com.brightcove.player.event.EventEmitter;
import com.brightcove.player.event.EventListener;
import com.brightcove.player.event.EventType;
import com.brightcove.player.mediacontroller.BrightcoveMediaController;
import com.brightcove.player.util.ErrorUtil;
import com.brightcove.player.util.StringUtil;
import com.brightcove.player.view.BrightcoveExoPlayerVideoView;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

/**
 * Created by oldmen on 3/1/18.
 */

public class CustomView extends FrameLayout implements Component {
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
    private Button mRepeatToggle;
    private Button mSubtitleToggle;

    private int captionsDialogOkToken;
    private int captionsDialogSettingsToken;
    private int activityResumedToken;
    private int fragmentResumedToken;

    public String videoId;
    public String accountId;
    public String policyKey;

    private Boolean isShowing = false;
    private int endTime = 0;
    private boolean isRepeatEnabled = false;
    private long currentTimeInMs = 0;
    private final AnimationSet animationSet = new AnimationSet(true);

    /** AbstractComponent function **/

    public void addListener(String eventType, EventListener listener) {
        this.listenerTokens.put(eventType, this.eventEmitter.on(eventType, listener));
    }

    public void addOnceListener(String eventType, EventListener listener) {
        this.listenerTokens.put(eventType, this.eventEmitter.once(eventType, listener));
    }

    public void removeListener(String eventType) {
        if(this.listenerTokens.containsKey(eventType)) {
            this.eventEmitter.off(eventType, this.listenerTokens.get(eventType));
        }

    }

    public void removeListeners() {
        Iterator var1 = this.listenerTokens.keySet().iterator();

        while(var1.hasNext()) {
            String key = (String)var1.next();
            this.eventEmitter.off(key, this.listenerTokens.get(key));
        }

        this.listenerTokens.clear();
    }

    public EventEmitter getEventEmitter() {
        return this.eventEmitter;
    }

    /** Init function **/

    private void initAbstractComponent() {
        this.eventEmitter = mPlayerVideoView.getEventEmitter();
        this.listenerTokens = new HashMap();
        if(eventEmitter == null) {
            throw new IllegalArgumentException(ErrorUtil.getMessage("eventEmitterRequired"));
        }
    }

    private void initLayout() {
        inflate(mContext, R.layout.custom_brightcove, this);
        mPlayerVideoView = findViewById(R.id.player);
        mControlBar = findViewById(R.id.brightcove_control);
        mCurrTime = findViewById(R.id.current_time);
        mEndTime = findViewById(R.id.end_time);
        mPlayBtn = findViewById(R.id.play);
        mProgressBar = findViewById(R.id.progress_bar);
        mVolumeSeekBar = findViewById(R.id.volume_seek);
        mForwardAnimation = findViewById(R.id.animation_forward);
        mBackwardAnimation = findViewById(R.id.animation_backward);
        mRepeatToggle = findViewById(R.id.repeat);
        mSubtitleToggle = findViewById(R.id.subtitle);
    }

    private void initPlayer() {
        initEventListener();
        initSubtitle();

        mPlayerVideoView.setMediaController((BrightcoveMediaController) null);
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
        this.addListener("stop", playPauseHandler);
        this.addListener("activityResumed", playPauseHandler);
        this.addListener("completed", playPauseHandler);
    }

    private void initSubtitle() {
        BrightcoveCaptionFormat brightcoveCaptionFormat = BrightcoveCaptionFormat.createCaptionFormat("text/vtt", "de");
        mPlayerVideoView.addSubtitleSource(Uri.parse("android.resource://" + mContext.getPackageName() + "/" + R.raw.sintel_trailer_de), brightcoveCaptionFormat);
        brightcoveCaptionFormat = BrightcoveCaptionFormat.createCaptionFormat("text/vtt", "en");
        mPlayerVideoView.addSubtitleSource(Uri.parse("android.resource://" + mContext.getPackageName() + "/" + R.raw.sintel_trailer_en), brightcoveCaptionFormat);
        brightcoveCaptionFormat = BrightcoveCaptionFormat.createCaptionFormat("text/vtt", "es");
        mPlayerVideoView.addSubtitleSource(Uri.parse("android.resource://" + mContext.getPackageName() + "/" + R.raw.sintel_trailer_es), brightcoveCaptionFormat);
        brightcoveCaptionFormat = BrightcoveCaptionFormat.createCaptionFormat("text/vtt", "fr");
        mPlayerVideoView.addSubtitleSource(Uri.parse("android.resource://" + mContext.getPackageName() + "/" + R.raw.sintel_trailer_fr), brightcoveCaptionFormat);
        brightcoveCaptionFormat = BrightcoveCaptionFormat.createCaptionFormat("text/vtt", "it");
        mPlayerVideoView.addSubtitleSource(Uri.parse("android.resource://" + mContext.getPackageName() + "/" + R.raw.sintel_trailer_it), brightcoveCaptionFormat);
        brightcoveCaptionFormat = BrightcoveCaptionFormat.createCaptionFormat("text/vtt", "nl");
        mPlayerVideoView.addSubtitleSource(Uri.parse("android.resource://" + mContext.getPackageName() + "/" + R.raw.sintel_trailer_nl), brightcoveCaptionFormat);

        mPlayerVideoView.getEventEmitter().once(EventType.CAPTIONS_LANGUAGES, new EventListener() {
            @Override
            public void processEvent(Event event) {
                mPlayerVideoView.setClosedCaptioningEnabled(true);
                mPlayerVideoView.setSubtitleLocale("en");
            }
        });
    }

    private void initButtons() {
        mRepeatToggle.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                isRepeatEnabled = !isRepeatEnabled;
            }
        });

        mProgressBar.setMax(100);
        mProgressBar.setProgress(0);
        mProgressBar.setProgressDrawable(mContext.getResources().getDrawable(R.drawable.custom_progress));

        mPlayBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mPlayerVideoView.isPlaying()) {
                    mPlayerVideoView.pause();
                    removeCallbacks(mFadeOut);
                }
                else {
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

    /** Constructor **/

    public CustomView(Context context) {
        super(context);
        mContext = context;
        mAccessibilityManager = (AccessibilityManager) mContext.getSystemService(Context.ACCESSIBILITY_SERVICE);

        initLayout();
        initAbstractComponent();
        initPlayer();
        initButtons();
        initDoubleTapForwardAnimation();
    }

    public CustomView(Context context, AttributeSet attrs) {
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

    public void show() { show(sDefaultTimeout); }

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
        }
        else return FORWARD;
    }

    /** Handler **/

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
//            if(!isDragging()) {

                int position = event.getIntegerProperty("playheadPosition");
                if(mCurrTime != null) {
                    mCurrTime.setText(StringUtil.stringForTime((long)position));
                    currentTimeInMs = (long) position;
                }

                int duration = event.getIntegerProperty("duration");
                if(!mPlayerVideoView.getVideoDisplay().isLive() && mEndTime != null) {
                    mEndTime.setText(StringUtil.stringForTime((long)duration));
                }
                mProgressBar.setProgress((int) ((float) (position * 100/ duration)));

                if (Objects.equals(event.getType(), "completed")) {
                    if (isRepeatEnabled) {
                        mPlayerVideoView.seekTo(0);
                        mPlayerVideoView.start();
                    }
                    else {
                        mPlayBtn.setBackgroundResource(R.drawable.play);
                    }
                }
//            } else {
//                Log.d(TAG, "The seek bar is being dragged.  No progress updates are being applied.");
//            }

        }
    }

    private class SeekToHandler implements EventListener {
        private SeekToHandler() {
        }

        @Default
        public void processEvent(Event event) {
//            if(!.this.isDragging()) {
                int position;
                if(event.properties.containsKey("originalSeekPosition")) {
                    position = event.getIntegerProperty("originalSeekPosition");
                } else {
                    position = event.getIntegerProperty("seekPosition");
                }

                if(mCurrTime != null) {
                    mCurrTime.setText(StringUtil.stringForTime((long)position));
                }
//            } else {
//                Log.d(TAG, "The seek bar is being dragged.  No SEEK_TO updates are being applied.");
//            }

        }
    }

    private class CaptionsDialogLauncher implements OnClickListener {
        private CaptionsDialogLauncher() {
        }

        public void onClick(View view) {
            Log.d(TAG, "Showing the captions dialog.");
            if(mPlayerVideoView.isPlaying()) {
                mPlayerVideoView.pause();
                CustomView.this.captionsDialogOkToken = CustomView.this.eventEmitter.once("captionsDialogOk", new EventListener() {
                    public void processEvent(Event event) {
                        mPlayerVideoView.start();
                        CustomView.this.eventEmitter.off("captionsDialogSettings", CustomView.this.captionsDialogSettingsToken);
                    }
                });
                CustomView.this.captionsDialogSettingsToken = CustomView.this.eventEmitter.once("captionsDialogSettings", new EventListener() {
                    public void processEvent(Event event) {
                        CustomView.this.activityResumedToken = CustomView.this.eventEmitter.once("activityResumed", new EventListener() {
                            public void processEvent(Event event) {
                                mPlayerVideoView.start();
                                CustomView.this.eventEmitter.off("fragmentResumed", CustomView.this.fragmentResumedToken);
                            }
                        });
                        CustomView.this.fragmentResumedToken = CustomView.this.eventEmitter.once("fragmentResumed", new EventListener() {
                            public void processEvent(Event event) {
                                mPlayerVideoView.start();
                                CustomView.this.eventEmitter.off("activityResumed", CustomView.this.activityResumedToken);
                            }
                        });
                        CustomView.this.eventEmitter.off("captionsDialogOk", CustomView.this.captionsDialogOkToken);
                    }
                });
            }

            mPlayerVideoView.getClosedCaptioningController().showCaptionsDialog();
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
                    mPlayBtn.setBackground(mContext.getResources().getDrawable(R.drawable.play));
                    break;
                case "didPlay":
                    mPlayBtn.setBackground(mContext.getResources().getDrawable(R.drawable.pause));
                    break;
                default:
                    break;
            }
        }
    }

    /** Double tap gesture **/
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
            }
            else {
                mForwardAnimation.clearAnimation();
                mForwardAnimation.setVisibility(INVISIBLE);
                mBackwardAnimation.setVisibility(VISIBLE);
                mBackwardAnimation.startAnimation(animationSet);
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
            if (e.getAction() == 0) {
                if (isShowing) {
                    if (isSeekClick(e, mProgressBar)) {
                        int deviceWith = mContext.getResources().getDisplayMetrics().widthPixels;
                        int progress = (int) (e.getX() * 100 / deviceWith);

                        float msec = (progress / 100.0f) * endTime;
                        mPlayerVideoView.seekTo((int) msec);
                    }
                    else {
                        hide();
                    }
                }
                else {
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

    /** Public function **/

    public BrightcoveExoPlayerVideoView getPlayerVideoView() { return mPlayerVideoView; }
    public View getControlBar() { return mControlBar; }

}
