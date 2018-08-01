package com.onapptv.ConnectionView.Controllers.Start;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.onapptv.ConnectionView.Controllers.BaseActivity;
import com.onapptv.ConnectionView.Controllers.TabbarActivity;
import com.onapptv.ConnectionView.Custom.View.Antena.AntenaView;
import com.onapptv.ConnectionView.Custom.View.Connect.ConnectView;
import com.onapptv.ConnectionView.Custom.View.Connect.ConnectViewDelegate;
import com.onapptv.ConnectionView.Custom.View.Loading.LoadingView;
import com.onapptv.ConnectionView.Custom.View.Password.PasswordView;
import com.onapptv.ConnectionView.Custom.View.Password.PasswordViewDelegate;
import com.onapptv.ConnectionView.util.DensityUtil;
import com.onapptv.ConnectionView.util.Request.RequestUtil;
import com.onapptv.ConnectionView.util.StatusBarUtil;
import com.onapptv.MainActivity;
import com.onapptv.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import tv.hi_global.stbapi.Api;
import tv.hi_global.stbapi.Model.ConfigureModel;
import tv.hi_global.stbapi.handler.Run;
import tv.hi_global.stbapi.handler.runable.Action;
import tv.hi_global.stbapi.implementation.Api_Implementation;

public class SoftwareUpdateActivity extends BaseActivity implements PasswordViewDelegate, ConnectViewDelegate {

    private String TAG = "SoftwareUpdateActivity";
    private SeekBar changeAlpha;
    private LoadingView loadingView;
    private TextView on;
    private TextView stb;
    private TextView subTitle;
    private TextView topic;
    private TextView content;
    private TextView bottomLabel;
    private Timer timer;
    private View backgroundStbNone;
    private TextView backgroundStbNoneLabel;
    private Button install;
    private Button next;
    private ConnectView connectView;
    private AntenaView antenaView;
    private PasswordView passwordView;
    private FrameLayout frameLayoutRoot;
    private View rRootView;

    public Boolean isFirst;
    public int timerMax;
    public Boolean isSetting;

    private int timerNumber;
    private int time = (int) 2.0 * 1000;
    private Handler handler = new Handler();
    private Intent intent = new Intent();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_software_update);

        setUI();

        defaultSetting();

        if (isFirst) {
            firstTimeDisplay();
        } else {
            otherDisplay();
        }
    }

    void defaultSetting() {

        isFirst = getIntent().getBooleanExtra("isFirst", false);

        timerMax = getIntent().getIntExtra("timerMax", 5);

        isSetting = getIntent().getBooleanExtra("isSetting", false);
    }

    void setUI() {

        changeAlpha = findViewById(R.id.software_update_change_alpha);

        changeAlpha.setVisibility(View.GONE);

        loadingView = findViewById(R.id.software_update_loadingView);
        loadingView.setAlpha((float) 0.25);
        loadingView.smoothToShow();

        frameLayoutRoot = findViewById(R.id.software_update_rootView);
        rRootView = findViewById(R.id.software_update);

        on = findViewById(R.id.software_update_on);
        Typeface typeface = Typeface.createFromAsset(getAssets(), "fonts/HelveticaNeue-Bold.otf");
        on.setTypeface(typeface);

        stb = findViewById(R.id.software_update_stb);
        typeface = Typeface.createFromAsset(getAssets(), "fonts/helveticaneue-regular.ttf");
        stb.setTypeface(typeface);

        subTitle = findViewById(R.id.software_update_sub_title);
        typeface = Typeface.createFromAsset(getAssets(), "fonts/Plantagenet Cherokee.ttf");
        subTitle.setTypeface(typeface);

        topic = findViewById(R.id.software_update_topic);
        typeface = Typeface.createFromAsset(getAssets(), "fonts/SF-UI-Text-Regular.otf");
        topic.setTypeface(typeface);

        backgroundStbNoneLabel = findViewById(R.id.software_update_background_stb_none_label);
        backgroundStbNoneLabel.setTypeface(typeface);

        bottomLabel = findViewById(R.id.software_update_bottom_label);
        bottomLabel.setTypeface(typeface);

        install = findViewById(R.id.software_update_install);
        install.setTypeface(typeface);
        install.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                installButtonAction();
            }
        });

        next = findViewById(R.id.software_update_next);
        next.setTypeface(typeface);
        next.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                nextButtonAction();
            }
        });

        content = findViewById(R.id.software_update_content);
        content.setTypeface(typeface);

        backgroundStbNone = findViewById(R.id.software_update_background_stb_none);
    }

    void firstTimeDisplay() {
        subTitle.setText("Welcome to\na revolutionary TV app’s".replace("\\n", "\n"));

        isSetting = true;

        timerNumber = 0;

        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                scanStart();
            }
        }, 0, 1000);

        Api.sharedApi().hIG_UdpReceiveMessage(new Api.OnArrayCallbackBlock() {
            @Override
            public void OnArrayCallback(ArrayList arrayList) {
                if (arrayList.size() != 0) {
                    scanStop();
                    handler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            on.setVisibility(View.INVISIBLE);
                            stb.setVisibility(View.INVISIBLE);
                            subTitle.setVisibility(View.INVISIBLE);
                            loadingView.smoothToHide();

                            if (connectView == null) {
                                connectView = new ConnectView(SoftwareUpdateActivity.this, 0, frameLayoutRoot, rRootView);
                                connectView.confirm.setText("Connect");
                                connectView.add.setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View v) {
                                        installButtonAction();
                                    }
                                });
                                connectView.delegate = SoftwareUpdateActivity.this;
                                connectView.bringToFront();
                                setAlphaAnimation(connectView, 0.0f, 1.0f, (long) (0.5 * 1000));
                            }
                        }
                    }, time);
                }
            }
        });
    }

    void scanStart() {
        timerNumber = timerNumber + 1;

        Api.sharedApi().hIG_GetMobileWifiInfo(new Api.OnMapCallbackBlock() {
            @Override
            public void OnMapCallback(Map map) {
                if (map.keySet().contains("SSID")) {
                    String ssid = (String) map.get("SSID");
                    if (!ssid.startsWith("STB")) {
                        Api.sharedApi().hIG_UdpOperation();
                    }
                } else {
                    Api.sharedApi().hIG_UdpOperationInWan();
                }
            }
        });

        if (timerNumber == timerMax) {
            scanStop();

            handler.post(new Runnable() {
                @Override
                public void run() {
                    on.setVisibility(View.INVISIBLE);
                    stb.setVisibility(View.INVISIBLE);
                    subTitle.setVisibility(View.INVISIBLE);

                    loadingView.smoothToHide();

                    topic.setText("Select your STB");

                    backgroundStbNone.setVisibility(View.VISIBLE);

                    setAlphaAnimation(backgroundStbNone, 0.0f, 1.0f, (long) (0.5 * 1000));

                    install.setVisibility(View.VISIBLE);

                    next.setText("Skip");
                    next.setVisibility(View.VISIBLE);
                }
            });
        }
    }

    void setAlphaAnimation(View view, float fromAlpha, float toAlpha, long durationMillis) {
        Animation animation = new AlphaAnimation(fromAlpha, toAlpha);
        animation.setDuration(durationMillis);
        view.startAnimation(animation);
    }

    void scanStop() {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }

    void otherDisplay() {
        on.setVisibility(View.INVISIBLE);
        stb.setVisibility(View.INVISIBLE);
        subTitle.setVisibility(View.INVISIBLE);

        topic.setText("Software update");
        content.setText("The software of your STB\nis being updated,\nit will take less than 1 minute");

        getSoftware();
    }

    void getSoftware() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                String bodyString = "{\"query\":\"{\\n  viewer {\\n    configOne(filter: {type: \\\"file-upload\\\", name: \\\"sig_app_upgrade.hi-global.bin\\\"}, sort: VERSION_DESC) {\\n      name\\n      version\\n      url\\n    }\\n  }\\n}\\n\"}";
                RequestUtil.hIG_PostRequest(bodyString, new RequestUtil.CompletionHandler() {
                    @Override
                    public void Callback(Boolean isSuccess, String string) {
                        if (isSuccess) {
                            try {
                                JSONObject jsonInfo = new JSONObject(string);
                                Object configOne = jsonInfo.getJSONObject("data").getJSONObject("viewer").get("configOne");
                                Log.i(TAG, String.valueOf(configOne));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                        } else {
                            Log.e(TAG, string);
                        }
                        Run.onUiAsync(new Action() {
                            @Override
                            public void call() {
                                topic.setText("Channel list update");
                                content.setText("The channel list is being\nupdated");
                            }
                        });
                        getDatabase();
                    }
                });
            }
        }).start();
    }

    void getDatabase() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                String bodyString = "{\"query\":\"{\\n  viewer {\\n    configOne(filter: {type: \\\"file-upload\\\", name: \\\"channel_database.xml\\\"}, sort: VERSION_DESC) {\\n      name\\n      version\\n      url\\n    }\\n  }\\n}\\n\"}";
                RequestUtil.hIG_PostRequest(bodyString, new RequestUtil.CompletionHandler() {
                    @Override
                    public void Callback(Boolean isSuccess, String string) {
                        if (isSuccess) {
                            try {
                                JSONObject jsonInfo = new JSONObject(string);
                                String url = jsonInfo.getJSONObject("data").getJSONObject("viewer").getJSONObject("configOne").getString("url");
                                dataParsing(url);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        } else {
                            Log.e(TAG, string);
                            dataParsingLocal();
                        }
                    }
                });
            }
        }).start();
    }

    void dataParsing(String url) {
        try {
            URL stream = new URL(url);
            Api.sharedApi().hIG_ParseXMLLast(stream.openStream(), new Api.OnStringCallbackBlock() {
                @Override
                public void OnStringCallback(String s) {
                    getSTBConfigure();
                }
            });
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    void dataParsingLocal() {
        try {
            Api.sharedApi().hIG_ParseXMLLast(getAssets().open("database/channel_database-1.xml"), new Api.OnStringCallbackBlock() {
                @Override
                public void OnStringCallback(String s) {
                    getSTBConfigure();
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    void getSTBConfigure() {
        Api.sharedApi().hIG_GetSTBConfigure(new Api.OnConfigureCallbackBlock() {
            @Override
            public void OnConfigureCallback(ConfigureModel configureModel) {
                Api.sharedApi().hIG_SetSTBConfigure(configureModel, new Api.OnSuccessCallbackBlock() {
                    @Override
                    public void OnSuccessCallback(Boolean aBoolean, String s) {
                        if (aBoolean) {
                            if (isFirst) {
                                if (isSetting) {
                                    content.setText("");
                                    loadingView.smoothToHide();

                                    antenaView = new AntenaView(SoftwareUpdateActivity.this,frameLayoutRoot,rRootView);
                                    addContentView(antenaView, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                                    setAlphaAnimation(antenaView, 0.0f, 1.0f, (long) (0.5 * 1000));
                                    bottomLabel.setVisibility(View.VISIBLE);

                                    next.setText("Next");
                                    next.setBackgroundDrawable(getResources().getDrawable(R.drawable.colored_button));
                                    next.setVisibility(View.VISIBLE);
                                } else {
                                    intent.setClass(SoftwareUpdateActivity.this, MainActivity.class);
                                    startActivity(intent);
                                    finish();
                                }
                            } else {
                                finish();
                            }
                        }
                    }
                });
            }
        });
    }

    void nextButtonAction() {
        if (next.getText() == "Skip") {
            intent = new Intent(SoftwareUpdateActivity.this, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(intent);
            finish();
        } else {
            setAlphaAnimation(antenaView, 1.0f, 0.0f, (long) (0.5 * 1000));
            antenaView.removeFromSuperview();
            antenaView = null;

            bottomLabel.setVisibility(View.INVISIBLE);
            next.setVisibility(View.INVISIBLE);

            topic.setText("Create PIN Code");

            passwordView = new PasswordView(this);
            addContentView(passwordView, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            passwordView.delegate = this;
            setAlphaAnimation(passwordView, 0.0f, 1.0f, (long) (0.5 * 1000));
        }
    }

    void installButtonAction() {
        intent = new Intent(SoftwareUpdateActivity.this, WifiConnectActivity.class);
        startActivity(intent);
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
                RelativeLayout.LayoutParams installLayout = (RelativeLayout.LayoutParams) install.getLayoutParams();
                installLayout.topMargin = DensityUtil.dip2px(SoftwareUpdateActivity.this, 488 - 20);
                install.setLayoutParams(installLayout);

                RelativeLayout.LayoutParams nextlLayout = (RelativeLayout.LayoutParams) next.getLayoutParams();
                nextlLayout.topMargin = DensityUtil.dip2px(SoftwareUpdateActivity.this, 537 - 20);
                next.setLayoutParams(nextlLayout);
            }
        });

//
    }

    @Override
    public void virtualKeyHidden() {
        super.virtualKeyHidden();
        handler.post(new Runnable() {
            @Override
            public void run() {
                RelativeLayout.LayoutParams installLayout = (RelativeLayout.LayoutParams) install.getLayoutParams();
                installLayout.topMargin = DensityUtil.dip2px(SoftwareUpdateActivity.this, 488);
                install.setLayoutParams(installLayout);

                RelativeLayout.LayoutParams nextlLayout = (RelativeLayout.LayoutParams) next.getLayoutParams();
                nextlLayout.topMargin = DensityUtil.dip2px(SoftwareUpdateActivity.this, 537);
                next.setLayoutParams(nextlLayout);
            }
        });
    }

    @Override
    public void setPasswordSuccess() {
        intent.setClass(SoftwareUpdateActivity.this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);
        finish();
    }

    @Override
    public void setPasswordFail(String error) {
        passwordView.reset();
    }

    @Override
    public void connectSuccess(Boolean isSave) {
        loadingView.smoothToShow();
        if (isSetting) {
            on.setVisibility(View.VISIBLE);
            subTitle.setVisibility(View.VISIBLE);
            stb.setVisibility(View.VISIBLE);
            subTitle.setText("Few more steps !");
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    otherDisplay();
                }
            }, time);
        } else {
            otherDisplay();
        }
    }

    @Override
    public void connectFail(Error error) {

    }
}
