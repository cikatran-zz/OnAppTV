package com.onapptv.ConnectionView.Controllers.Start;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;

import com.onapptv.ConnectionView.Controllers.BaseActivity;
import com.onapptv.ConnectionView.util.DensityUtil;
import com.onapptv.ConnectionView.util.StatusBarUtil;
import com.onapptv.R;


public class WifiConnectActivity extends BaseActivity {

    private SeekBar changeAlpha;
    private TextView topic;
    private Button close;
    private TextView content;
    private TextView subtitle;
    private Button wps;
    private Button manual;
    private Button details;
    private Button wps_button;

    private Handler handler = new Handler();
    private Intent intent = new Intent();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wifi_connect);

        setUI();
    }

    void setUI() {

        changeAlpha = findViewById(R.id.wifi_connect_change_alpha);
        changeAlpha.setVisibility(View.GONE);

        Typeface typeface = Typeface.createFromAsset(getAssets(), "fonts/SF-UI-Text-Regular.otf");
        topic = findViewById(R.id.wifi_connect_topic);
        topic.setTypeface(typeface);

        close = findViewById(R.id.wifi_connect_close);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        content = findViewById(R.id.wifi_connect_content);
        content.setTypeface(typeface);

        subtitle = findViewById(R.id.wifi_connect_subtitle);
        subtitle.setTypeface(typeface);

        wps = findViewById(R.id.wifi_connect_wps);
        wps.setTypeface(typeface);
        wps.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                intent = new Intent(WifiConnectActivity.this, WlanWPSActivity.class);
                startActivity(intent);
            }
        });

        manual = findViewById(R.id.wifi_connect_manual);
        manual.setTypeface(typeface);
        manual.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                intent = new Intent(WifiConnectActivity.this, WlanAPActivity.class);
                startActivity(intent);
            }
        });

        details = findViewById(R.id.wifi_connect_details);
        details.setTypeface(typeface);

        wps_button = findViewById(R.id.wifi_connect_wps_button);
    }

    @Override
    protected void setStatusBar() {
        StatusBarUtil.setTransparent(this);
    }

    @Override
    public void virtualKeyDisplay() {
        super.virtualKeyDisplay();
        handler.post(new Runnable() {
            @Override
            public void run() {
                RelativeLayout.LayoutParams wpsButtonLayout = (RelativeLayout.LayoutParams) wps_button.getLayoutParams();
                wpsButtonLayout.bottomMargin = DensityUtil.dip2px(WifiConnectActivity.this, 27 - 20);
                wps_button.setLayoutParams(wpsButtonLayout);
            }
        });
    }

    @Override
    public void virtualKeyHidden() {
        super.virtualKeyHidden();

        handler.post(new Runnable() {
            @Override
            public void run() {
                RelativeLayout.LayoutParams wpsButtonLayout = (RelativeLayout.LayoutParams) wps_button.getLayoutParams();
                wpsButtonLayout.bottomMargin = DensityUtil.dip2px(WifiConnectActivity.this, 27);
                wps_button.setLayoutParams(wpsButtonLayout);
            }
        });
    }
}
