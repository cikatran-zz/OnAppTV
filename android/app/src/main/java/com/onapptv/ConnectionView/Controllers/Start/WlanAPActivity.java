package com.onapptv.ConnectionView.Controllers.Start;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.RelativeLayout;
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
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import tv.hi_global.stbapi.Api;

public class WlanAPActivity extends BaseActivity implements SwiperDelegate {

    private SeekBar changeAlpha;
    private TextView topic;
    private Button close;
    private SwiperView swiperView;
    private RelativeLayout connect;
    private TextView connect_wifi;
    private EditText wifiName;
    private EditText wifiPassword;
    private CheckBox checkBox;
    private Button validate;

    private Timer timer;
    private Intent intent = new Intent();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wlan_ap);

        setUI();
    }

    void setUI() {

        changeAlpha = findViewById(R.id.wlan_ap_change_alpha);
        changeAlpha.setVisibility(View.GONE);

        Typeface typeface = Typeface.createFromAsset(getAssets(), "fonts/SF-UI-Text-Regular.otf");
        topic = findViewById(R.id.wlan_ap_topic);
        topic.setTypeface(typeface);

        connect_wifi = findViewById(R.id.wlan_ap_connect_wifi);
        connect_wifi.setTypeface(typeface);

        close = findViewById(R.id.wlan_ap_close);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerStop();
                finish();
            }
        });

        swiperView = findViewById(R.id.wlan_ap_swiperView);
        List<SwiperModel> swiperData = new ArrayList<>();
        String[] imageViews = {null, "start_settings", null};
        Boolean[] isShowImages = {false, true, false};
        String[] titles = {"Step 1", "Step 2", "Step 3"};
        String[] contents = {"Press on CH+ key of your STB during\n3s until the LED flashes", "1. Open the WIFI Menu in the Settings\n2. Select the WiFi : STB-XXXXXXXX\n3. When connected, come back to the\nAPP and go to next step", ""};
        Boolean[] textCenters = {false, true, false};
        String[] subscriptions = {"", "Press this button to open the Settings", ""};
        for (int i = 0; i < titles.length; i++) {
            SwiperModel model = new SwiperModel();
            model.image = imageViews[i];
            model.isShowImageView = isShowImages[i];
            model.title = titles[i];
            model.content = contents[i];
            model.isContentTextCenter = textCenters[i];
            model.subscription = subscriptions[i];
            swiperData.add(model);
        }
        swiperView.setDelegate(this);
        swiperView.setDatas(swiperData);

        connect = findViewById(R.id.wlan_ap_connect);

        validate = findViewById(R.id.wlan_ap_validate);
        validate.setTypeface(typeface);
        validate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                connectWlanAP();
            }
        });

        typeface = Typeface.createFromAsset(getAssets(), "fonts/helveticaneue-regular.ttf");
        checkBox = findViewById(R.id.wlan_ap_connect_check_box);
        checkBox.setTypeface(typeface);
        checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    wifiPassword.setInputType(InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
                } else {
                    wifiPassword.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                }
                wifiPassword.setSelection(wifiPassword.getText().length());
            }
        });
        wifiName = findViewById(R.id.wlan_ap_wifi_name);
        wifiName.setTypeface(typeface);

        wifiPassword = findViewById(R.id.wlan_ap_wifi_password);
        wifiPassword.setTypeface(typeface);
    }

    void searchWlan() {
        Api.sharedApi().hIG_GetMobileWifiInfo(new Api.OnMapCallbackBlock() {
            @Override
            public void OnMapCallback(Map map) {
                String name = new String();
                if (map.keySet().contains("SSID")) {
                    String ssid = (String) map.get("SSID");
                    if (ssid.startsWith("STB")) {
                        name = "WIFI" + " " + ssid.substring(4);
                    } else {
                        name = "WIFI";
                    }
                } else {
                    name = "WIFI";
                }

                if (!connect_wifi.getText().equals(name)) {
                    connect_wifi.setText(name);
                }
            }
        });
    }

    void connectWlanAP() {
        if (wifiName.getText().toString().length() > 0 && wifiPassword.getText().toString().length() > 0) {
            Api.sharedApi().hIG_STBWlanAP(wifiName.getText().toString(), wifiPassword.getText().toString(), new Api.OnSuccessCallbackBlock() {
                @Override
                public void OnSuccessCallback(Boolean aBoolean, String s) {
                    if (aBoolean == true) {
                        intent.setClass(WlanAPActivity.this, SoftwareUpdateActivity.class);
                        intent.putExtra("isFirst", true);
                        intent.putExtra("timerMax", 40);
                        intent.putExtra("isSetting", true);
                        startActivity(intent);
                        timerStop();
                        finish();
                    }
                }
            });
        }
    }

    void installWPS() {
        intent = new Intent(WlanAPActivity.this, WlanWPSActivity.class);
        startActivity(intent);
        finish();
    }

    void timerStop() {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
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
        timerStop();
        if (position == 2) {
            connect.setVisibility(View.VISIBLE);
            timer = new Timer();
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    searchWlan();
                }
            }, 0, 1000);
        } else {
            connect.setVisibility(View.INVISIBLE);
        }
    }

    @Override
    public void onPageScrollStateChanged(int state) {

    }

    @Override
    public void onButtonInClicked(int currentIndex) {
        if (currentIndex == 1) {
            startActivity(new Intent(android.provider.Settings.ACTION_WIFI_SETTINGS));
        }
    }
}
