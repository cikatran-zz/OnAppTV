package com.onapptv.android_stb_connect;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.github.lzyzsd.jsbridge.BridgeHandler;
import com.github.lzyzsd.jsbridge.BridgeWebView;
import com.github.lzyzsd.jsbridge.CallBackFunction;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Map;

import tv.hi_global.stbapi.Api;
import tv.hi_global.stbapi.Model.ConfigureModel;
import tv.hi_global.stbapi.implementation.Api_Implementation;

/**
 * Created by oldmen on 3/20/18.
 */

public class AndroidSTBConnectScreen extends FrameLayout {
    private static final long SPLASH_DELAY_MILLS = 1000;

    ImageView launch_View;
    BridgeWebView bWebView;
    Context context;
    
    public AndroidSTBConnectScreen(@NonNull Context context) {
        super(context);
        inflate(context, R.layout.screen, this);
        initialize(context);
    }

    public AndroidSTBConnectScreen(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        inflate(context, R.layout.screen, this);
        initialize(context);
    }

    private void initialize(Context con) {
        context = con;
        
        Api_Implementation.sharedManager().hIG_setContext(context);
        launch_View = findViewById(R.id.launch_view);
        bWebView = findViewById(R.id.webView);
//        设置编码
        bWebView.getSettings().setDefaultTextEncodingName("utf-8");
//        支持 js
        bWebView.getSettings().setJavaScriptEnabled(true);
//        允许 js 弹窗
        bWebView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);

//        定义一个 Setting 记录App是第几次启动
        SharedPreferences setting = context.getSharedPreferences("com.example.STB", 0);
        final Boolean userFirst = setting.getBoolean("isStarted", true);
//        第一次跳转至登录界面
        if(userFirst){
            setting.edit().putBoolean("isStarted", false).commit();
            jumpPagetoLogin(true);
        } else {
            jumpPagetoLogin(false);
        }

        /**
         * 获取 STB 列表
         */
        bWebView.registerHandler("HIG_GetSTBList", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_GetMobileWifiInfo(new Api.OnMapCallbackBlock() {
                    @Override
                    public void OnMapCallback(Map map) {
                        String ssid =(String) map.get("SSID");
                        if(!ssid.startsWith("STB")) {
                            Api_Implementation.sharedManager().hIG_UdpOperation();
                            Api_Implementation.sharedManager().hIG_UdpReceiveMessageInJson(new Api.OnStringCallbackBlock() {
                                @Override
                                public void OnStringCallback(String s) {
                                    function.onCallBack(s);
                                }
                            });
                        }
                    }
                });
            }
        });

        /**
         * 获取之前连接过但是未找到的 STB
         */
        bWebView.registerHandler("HIG_UndiscoveredSTBList", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_UndiscoveredSTBListInJson(new Api.OnStringCallbackBlock() {
                    @Override
                    public void OnStringCallback(String s) {
                        function.onCallBack(s);
                    }
                });
            }
        });

        /**
         * 连接机顶盒
         */
        bWebView.registerHandler("HIG_ConnectSTB", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                //转化数据
                JSONObject objects = null;
                try {
                    objects = new JSONObject(data);
                    objects.put("userName","Android_test");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                Api_Implementation.sharedManager().hIG_ConnectSTB(objects.toString(), new Api.OnStringCallbackBlock() {
                    @Override
                    public void OnStringCallback(String s) {
                        final String strings = s;
                        try {
                            JSONObject jObject = new JSONObject(s);
                            if(jObject.get("return").equals("1")) {
                                Api_Implementation.sharedManager().hIG_ParseXMLLast(context.getAssets().open("database _IBC_2017-2.xml"), new Api.OnStringCallbackBlock() {
                                    @Override
                                    public void OnStringCallback(String s) {
                                        function.onCallBack(strings);
                                        Api_Implementation.sharedManager().hIG_GetSTBConfigure(new Api.OnConfigureCallbackBlock() {
                                            @Override
                                            public void OnConfigureCallback(ConfigureModel configureModel) {
                                                if(userFirst) {
                                                    Api_Implementation.sharedManager().hIG_SetSTBConfigure(configureModel,null);
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                function.onCallBack(strings);
                            }
                        } catch (JSONException | IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        });

        /**
         * 获取 Satellite列表
         */
        bWebView.registerHandler("HIG_GetSatelliteList", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_GetSatelliteListInJson(new Api.OnStringCallbackBlock() {
                    @Override
                    public void OnStringCallback(String s) {
                        function.onCallBack(s);
                    }
                });
            }
        });

        /**
         * 设置 Satellite 属性
         */
        bWebView.registerHandler("HIG_SetSatelliteParam", new BridgeHandler() {
            @Override
            public void handler(String data, CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_SetSatellite(data,null);
            }
        });

        /**
         * 获取 Signal
         */
        bWebView.registerHandler("HIG_TuneTransporter", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_GetSignalAfterSetFeTun(data, new Api.OnStringCallbackBlock() {
                    @Override
                    public void OnStringCallback(String s) {
                        function.onCallBack(s);
                    }
                });
            }
        });

        /**
         * 获取 Configure
         */
        bWebView.registerHandler("HIG_GetParentalGuideRating", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_GetSTBConfigure(new Api.OnStringCallbackBlock() {
                    @Override
                    public void OnStringCallback(String s) {
                        function.onCallBack(s);
                    }
                });
            }
        });

        /**
         * 设置家长指引等级
         */
        bWebView.registerHandler("HIG_SetParantalGuideRating", new BridgeHandler() {
            @Override
            public void handler(String data, CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_SetParentalGuideRating(data,null);
            }
        });

        /**
         * 验证 PIN 是否正确
         */
        bWebView.registerHandler("HIG_CheckSTBPIN", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                try {
                    JSONObject jObject = new JSONObject(data);
                    Api_Implementation.sharedManager().hIG_ResetSTBPIN(Api_Implementation.sharedManager().hIG_GetSTBPIN(), jObject.getString("newPIN"), new Api.OnSuccessCallbackBlock() {
                        @Override
                        public void OnSuccessCallback(Boolean aBoolean, String s) {
                            if(aBoolean == true) {
                                function.onCallBack(aBoolean.toString());
                            } else {
                                function.onCallBack(s);
                            }
                        }
                    });
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        });

        /**
         * 连接状态
         */
        bWebView.registerHandler("HIG_STBConnectStatus", new BridgeHandler() {
            @Override
            public void handler(String data, CallBackFunction function) {
                try {
                    JSONObject jObject = new JSONObject(data);
                    onFinished();
                    if(jObject.getBoolean("connectState")) {
//                        Intent intents = new Intent(context,TabBarActivity .class);
//                        context.startActivity(intents);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });


        /**
         * 获取手机 WIFI 信息
         */
        bWebView.registerHandler("HIG_GetMobileWifiInfo", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_GetMobileWifiInfoInJson(new Api.OnStringCallbackBlock() {
                    @Override
                    public void OnStringCallback(String s) {
                        function.onCallBack(s);
                    }
                });
            }
        });

        /**
         * 连接手机 Wlan
         */
        bWebView.registerHandler("HIG_STBWlanAP", new BridgeHandler() {
            @Override
            public void handler(String data, final CallBackFunction function) {
                Api_Implementation.sharedManager().hIG_STBWlanAP(data, new Api.OnStringCallbackBlock() {
                    @Override
                    public void OnStringCallback(String s) {
                        function.onCallBack(s);
                    }
                });
            }
        });
    }

    /**
     * 页面显示的方法
     */

    private void jumpPagetoLogin(final boolean bool) {
        String webName = "";
        if(bool) {
            webName = "Login";
        } else {
            webName = "Revolution";
//                            webName = "Login";
        }
//                        隐藏启动页
        launch_View.setVisibility(View.GONE);
        bWebView.setVisibility(View.VISIBLE);
//                        加载网页
        bWebView.loadUrl("file:///android_asset/STBHTML/"+webName+".html");
    }

    /*
     * Receive native event
     */
    public void onFinished() {
        WritableMap event = Arguments.createMap();
        event.putString("message", "new message");
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "finished",
                event);
    }


}
