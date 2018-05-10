package com.onapptv;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.hardware.SensorManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.OrientationEventListener;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.onapptv.R;
import com.onapptv.custombrightcoveplayer.CustomBrightcovePlayer;

import java.util.HashMap;

public class BrightcoveActivity extends AppCompatActivity {
    public static final String VIDEO_ID = "videoId";
    public static final String ACCOUNT_ID = "accountId";
    public static final String POLICY_KEY = "policyKey";
    public static final String METADATA = "metaData";

    OrientationEventListener mOrientationListener;
    FrameLayout mContainer;
    CustomBrightcovePlayer mPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_brightcove);

        mOrientationListener = new OrientationEventListener(this, SensorManager.SENSOR_DELAY_NORMAL) {
            @Override
            public void onOrientationChanged(int i) {
                    if ((i < 10) || (i > 170 && i < 190)) {
                        Log.v("Finish", "Change activity " + i);
                        mPlayer.getPlayerVideoView().clear();
                        finish();
                    }
            }
        };

        if (mOrientationListener.canDetectOrientation()) {
            mOrientationListener.enable();
        }
        else {
            mOrientationListener.disable();
        }

        mContainer = findViewById(R.id.player_container);
        mPlayer = new CustomBrightcovePlayer(this);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                                                                                ViewGroup.LayoutParams.MATCH_PARENT);
        mPlayer.setLayoutParams(layoutParams);
        mContainer.addView(mPlayer);

        getIntentAndPlay();
    }

    private void getIntentAndPlay() {
        Intent intent = getIntent();
        mPlayer.setIds(intent.getStringExtra(VIDEO_ID),
                intent.getStringExtra(ACCOUNT_ID),
                intent.getStringExtra(POLICY_KEY),
                (HashMap<String, Object>) intent.getSerializableExtra(METADATA));

    }
}
