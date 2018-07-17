package com.onapptv.ConnectionView.Controllers.Start;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;

import com.onapptv.ConnectionView.Controllers.BaseActivity;
import com.onapptv.ConnectionView.Custom.Model.SwiperModel;
import com.onapptv.ConnectionView.Custom.View.Swiper.SwiperDelegate;
import com.onapptv.ConnectionView.Custom.View.Swiper.SwiperView;
import com.onapptv.ConnectionView.util.StatusBarUtil;
import com.onapptv.R;

import java.util.ArrayList;
import java.util.List;


public class WlanWPSActivity extends BaseActivity implements SwiperDelegate {

    private SeekBar changeAlpha;
    private TextView topic;
    private Button close;
    private Button wps;
    private SwiperView swiperView;

    private Intent intent = new Intent();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wlan_wps);

        setUI();
    }

    void setUI() {

        changeAlpha = findViewById(R.id.wlan_wps_change_alpha);
        changeAlpha.setVisibility(View.GONE);

        Typeface typeface = Typeface.createFromAsset(getAssets(), "fonts/SF-UI-Text-Regular.otf");
        topic = findViewById(R.id.wlan_wps_topic);
        topic.setTypeface(typeface);

        close = findViewById(R.id.wlan_wps_close);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        wps = findViewById(R.id.wlan_wps_wps);
        wps.setTypeface(typeface);
        wps.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                intent = new Intent(WlanWPSActivity.this, SoftwareUpdateActivity.class);
                intent.putExtra("isFirst", true);
                startActivity(intent);
                finish();
            }
        });

        swiperView = findViewById(R.id.wlan_wps_swiperView);
        List<SwiperModel> swiperData = new ArrayList<>();
        String[] titles = {"Step 1", "Step 2", "Step 3"};
        String[] contents = {"Press on the WPS key of your Wifi router\nuntil the LED flashes !", "Press on the WPS key of your STB until\nthe LED flashes !", "Press on the WPS key of your STB until\nthe LED flashes !"};
        for (int i = 0; i < titles.length; i++) {
            SwiperModel model = new SwiperModel();
            model.image = null;
            model.isShowImageView = false;
            model.title = titles[i];
            model.content = contents[i];
            swiperData.add(model);
        }
        swiperView.setDelegate(this);
        swiperView.setDatas(swiperData);
    }

    @Override
    protected void setStatusBar() {
        StatusBarUtil.setTransparent(this);
    }

    @Override
    public void virtualKeyDisplay() {
        super.virtualKeyDisplay();
    }

    @Override
    public void virtualKeyHidden() {
        super.virtualKeyHidden();
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

    }

    @Override
    public void onPageSelected(int position) {
        if (position == 2) {
            wps.setVisibility(View.VISIBLE);
        } else {
            wps.setVisibility(View.INVISIBLE);
        }
    }

    @Override
    public void onPageScrollStateChanged(int state) {

    }

    @Override
    public void onButtonInClicked(int currentIndex) {

    }
}
