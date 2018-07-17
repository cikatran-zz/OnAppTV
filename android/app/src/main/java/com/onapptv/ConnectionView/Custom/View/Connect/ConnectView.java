package com.onapptv.ConnectionView.Custom.View.Connect;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.onapptv.ConnectionView.Custom.Model.ConnectModel;
import com.onapptv.ConnectionView.Custom.View.Blur.BlurringView;
import com.onapptv.ConnectionView.util.DensityUtil;
import com.onapptv.ConnectionView.util.WindowManager;
import com.onapptv.R;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import tv.hi_global.stbapi.Api;
import tv.hi_global.stbapi.Model.ScanModel;
import tv.hi_global.stbapi.handler.Run;
import tv.hi_global.stbapi.handler.runable.Action;

/**
 * File description
 * Created by mac on 2018/5/22.
 */

public class ConnectView extends RelativeLayout implements ConnectViewSwithchListener {

    private Context mContext;
    private List<ConnectModel> dataSource = new ArrayList<ConnectModel>();
    private boolean isExist = true;
    private ListView listView;
    private ViewGroup parentView;
    private FrameLayout.LayoutParams layoutParams;
    private View blurView;
    public BlurringView mBlurringView;

    public Button confirm;
    public Button add;
    public ConnectViewDelegate delegate;

    private Timer mTimer;
    private ConnectAdapter connectAdapter;
    double connectView_Proportionheight = 490.0 / 665.0;
    double connectView_ProportionWidth = 282.0 / 375.0;
    double connectView_AspectRatio = 282.0 / 490.0;
    public int backColor = R.color.colorDark25;
    private int isTabbarHeight = 0;
    private int screenWidth, screenHeight, connectView_Width, connectView_Height;
    private Boolean isOperation;

    public LinearLayout linearLayoutRoot;

    public ConnectView(Context context, int isTabbarHeight, ViewGroup parentView, View blurView) {
        super(context);
        this.mContext = context;
        this.isTabbarHeight = isTabbarHeight;
        this.parentView = parentView;
        this.blurView = blurView;
        setupSubViews();
        loadData();
    }

    /**
     * Setup SubViews
     */
    private void setupSubViews() {
        Api.sharedApi().hIG_setContext(mContext);
        this.setOverScrollMode(OVER_SCROLL_NEVER);
        screenWidth = WindowManager.getScreenWidth(mContext);
        screenHeight = WindowManager.getScreenHeight(mContext) - isTabbarHeight - WindowManager.getStatusBarHeight(mContext);
        connectView_Width = (int) (WindowManager.getScreenWidth(mContext) * connectView_ProportionWidth);
        connectView_Height = (int) (connectView_Width / connectView_AspectRatio);

        layoutParams = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        layoutParams.width = connectView_Width;
        layoutParams.height = connectView_Height;
        layoutParams.topMargin = (screenHeight - connectView_Height) / 2;
        layoutParams.leftMargin = (screenWidth - connectView_Width) / 2;
        mBlurringView = new BlurringView(mContext);
        new Thread(new Runnable() {
            @Override
            public void run() {
                mBlurringView.setBlurRadius(15);
                mBlurringView.setDownsampleFactor(8);
                mBlurringView.setOverlayColor(getResources().getColor(R.color.digitalColor));
                mBlurringView.setRadius(DensityUtil.dip2px(mContext, 13));
                mBlurringView.setLayoutParams(layoutParams);
                // Give the blurring view a reference to the blurred view.
                mBlurringView.setBlurredView(blurView);
            }
        }).start();
        parentView.addView(mBlurringView);
        parentView.addView(this, layoutParams);
        linearLayoutRoot = new LinearLayout(mContext);
        linearLayoutRoot.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        int rootCornerRadius = DensityUtil.dip2px(mContext, 13);
        float[] rootOuterRadian = new float[]{rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius};
        RoundRectShape roundRectShape = new RoundRectShape(rootOuterRadian, null, null);
        ShapeDrawable rootDrawable = new ShapeDrawable(roundRectShape);
        rootDrawable.getPaint().setColor(getResources().getColor(R.color.colorDarkGrey26));
        linearLayoutRoot.setBackgroundDrawable(rootDrawable);
        linearLayoutRoot.setOrientation(LinearLayout.VERTICAL);
        addView(linearLayoutRoot);

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        double title_y = 32.5 / 490 * connectView_Height;
        lp.setMargins(0, (int) title_y, 0, 20);
        TextView titleView = new TextView(mContext);
        Typeface typeface = Typeface.createFromAsset(mContext.getAssets(), "fonts/SF-UI-Text-Regular.otf");
        titleView.setTypeface(typeface);
        titleView.setText("Select STB");
        titleView.setTextColor(Color.WHITE);
        titleView.setTextSize(17);
        titleView.setGravity(Gravity.CENTER);
        titleView.setLayoutParams(lp);
        linearLayoutRoot.addView(titleView);

        double list_Height = 44 * 5 / 490.0 * connectView_Height + 20;
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, (int) list_Height);
        lp.setMargins(50, 20, 50, 15);
        listView = new ListView(this.getContext());
        listView.setBackgroundColor(Color.TRANSPARENT);
        listView.setDividerHeight(0);
        listView.setSelector(R.color.colorClear);
        listView.setVerticalScrollBarEnabled(false);
        listView.setHorizontalFadingEdgeEnabled(false);
        listView.setFastScrollEnabled(false);
        listView.setOverScrollMode(OVER_SCROLL_NEVER);
        listView.setFadingEdgeLength(0);
        listView.setLayoutParams(lp);

        connectAdapter = new ConnectAdapter(this.getContext(), dataSource);
        connectAdapter.height_Adapter = connectView_Height;
        connectAdapter.areAllItemsEnabled();
        connectAdapter.listener = this;

        listView.setAdapter(connectAdapter);
        linearLayoutRoot.addView(listView);

        double confirm_width = 231.14 / 282 * connectView_Width;
        double confirm_height = 33.35 / 490 * connectView_Height;
        double confirm_topMargin = 60.0 / 490 * connectView_Height;
        lp = new LinearLayout.LayoutParams((int) confirm_width, (int) confirm_height);
        lp.setMargins(0, (int) confirm_topMargin, 0, 0);
        lp.gravity = Gravity.CENTER;
        confirm = new Button(mContext);
        confirm.setBackgroundResource(R.drawable.confirm_button_style);
        confirm.setTypeface(typeface);
        confirm.setGravity(Gravity.CENTER);
        confirm.setEnabled(false);
        confirm.setText("Confirm");
        confirm.setAllCaps(false);
        confirm.setPadding(0, 0, 0, 0);
        confirm.setTextSize(17);
        confirm.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean isExist = false;
                for (ConnectModel model : dataSource) {
                    if (model.isOnline && model.isSelect) {
                        isExist = true;
                        Boolean isSave = model.scanInfo.stb.sTBID.equals(Api.sharedApi().getCurrentSTBInfo().sTBID) ? true : false;
                        Api.sharedApi().hIG_ConnectSTB(model.scanInfo.stb, model.scanInfo.userName, new Api.OnVoidCallbackBlock() {
                            @Override
                            public void OnVoidCallback() {
                                stopTimer();
                                Animation animation = new AlphaAnimation(1.0f, 0.0f);
                                animation.setDuration((long) (0.5 * 1000));
                                startAnimation(animation);

                                removeFromSuperview();
                                if (delegate != null) {
                                    delegate.connectSuccess(isSave);
                                }
                            }
                        }, new Api.OnErrorCallbackBlock() {
                            @Override
                            public void OnErrorCallback(Error error) {
                                if (delegate != null) {
                                    delegate.connectFail(error);
                                }
                            }
                        });
                    }
                }
                if (isExist == false) {
                    if (delegate != null) {
                        delegate.connectFail(new Error("Unselected equipment!"));
                    }
                }
            }
        });
        confirm.setTextColor(Color.WHITE);
        confirm.setLayoutParams(lp);
        linearLayoutRoot.addView(confirm);

        double markTextTop = 18.0 / 490 * connectView_Height;
        double markTextWidth = 100.0 / 282 * connectView_Width;
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = DensityUtil.px2dip(mContext, (float) markTextTop);
        lp.gravity = Gravity.CENTER_HORIZONTAL;
        add = new Button(mContext);
        add.setText("Add another STB");
        add.setGravity(Gravity.CENTER);
        add.setTextSize(13);
        Typeface typefaces = Typeface.createFromAsset(mContext.getAssets(), "fonts/helveticaneue-regular.ttf");
        add.setTypeface(typefaces);
        add.setAllCaps(false);
        add.getPaint().setFlags(Paint.UNDERLINE_TEXT_FLAG);
        add.getPaint().setAntiAlias(true);
        add.setPadding(0, 0, 0, 0);
        add.setTextColor(getResources().getColor(R.color.colorWhite70));
        add.setLayoutParams(lp);
        add.setBackgroundColor(Color.TRANSPARENT);
        linearLayoutRoot.addView(add);
    }

    /**
     * load data
     */
    private void loadData() {

        isOperation = false;

        mTimer = new Timer();
        mTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                scanStart();
            }
        }, 0, 1000);

        Api.sharedApi().hIG_UdpReceiveMessage(new Api.OnArrayCallbackBlock() {
            @Override
            public void OnArrayCallback(ArrayList arrayList) {
                Run.onUiAsync(new Action() {
                    @Override
                    public void call() {
                        for (int i = 0; i < arrayList.size(); i++) {
                            ScanModel scanInfo = (ScanModel) arrayList.get(i);
                            ConnectModel connectModel = new ConnectModel();
                            connectModel.isOnline = true;
                            connectModel.isSelect = false;
                            connectModel.name = scanInfo.stb.sTBID;
                            connectModel.scanInfo = scanInfo;
                            Boolean isSave = false;

                            for (int j = 0; j < dataSource.size(); j++) {
                                ConnectModel dataModel = dataSource.get(j);
                                if (dataModel.name.equals(connectModel.name)) {
                                    if (dataModel.isOnline == true) {
                                        isSave = true;
                                        connectModel.isSelect = dataModel.isSelect;
                                    } else {
                                        dataSource.remove(dataModel);
                                    }
                                }

                                if (Api.sharedApi().hIG_IsConnect() && !isOperation) {
                                    if (dataModel.name.equals(Api.sharedApi().getCurrentSTBInfo().sTBID)) {
                                        dataModel.isSelect = true;
                                    } else {
                                        dataModel.isSelect = false;
                                    }
                                }
                            }

                            if (isSave == false) {
                                dataSource.add(0, connectModel);
                            }
                        }

                        confirm.setEnabled(false);
                        for (ConnectModel model : dataSource) {
                            if (model.isSelect) {
                                confirm.setEnabled(true);
                            }
                        }

                        connectAdapter.notifyDataSetChanged();
                    }
                });
            }
        });
    }

    /**
     * Scan STB Start
     */
    private void scanStart() {
        Api.sharedApi().hIG_GetMobileWifiInfo(new Api.OnMapCallbackBlock() {
            @Override
            public void OnMapCallback(Map map) {
                if (map.keySet().contains("SSID")) {
                    String ssid = (String) map.get("SSID");
                    if (!ssid.startsWith("STB")) {
                        Api.sharedApi().hIG_UdpOperation();
                    } else {
                        dataSource.clear();
                        confirm.setEnabled(false);
                    }
                } else {
                    Api.sharedApi().hIG_UdpOperationInWan();
                }
            }
        });
        Api.sharedApi().hIG_UndiscoveredSTBList(new Api.OnArrayCallbackBlock() {
            @Override
            public void OnArrayCallback(ArrayList arrayList) {
                for (int i = 0; i < arrayList.size(); i++) {
                    ConnectModel connectModel = new ConnectModel();
                    connectModel.isOnline = false;
                    connectModel.isSelect = false;
                    connectModel.name = (String) arrayList.get(i);
                    connectModel.scanInfo = null;
                    boolean isSave = false;
                    for (int j = 0; j < dataSource.size(); j++) {
                        ConnectModel dataModel = dataSource.get(j);
                        if (dataModel.name.equals(connectModel.name)) {
                            if (dataModel.isOnline == false) {
                                isSave = true;
                            } else {
                                dataSource.remove(dataModel);
                            }
                        }
                    }

                    if (isSave == false) {
                        dataSource.add(connectModel);
                    }
                }
                connectAdapter.notifyDataSetChanged();
            }
        });
    }

    // stop timer
    public void stopTimer() {
        if (mTimer != null) {
            mTimer.cancel();
            mTimer = null;
        }
    }

    public int getConnectView_Width() {
        return connectView_Width;
    }

    public int getConnectView_Height() {
        return connectView_Height;
    }

    public void setBackColor(int backColor) {
        this.backColor = backColor;
        linearLayoutRoot.setBackgroundColor(getResources().getColor(backColor));
    }

    public void removeFromSuperview() {
        ((ViewGroup) getParent()).removeView(this);
        parentView.removeView(mBlurringView);
        stopTimer();
    }

    public void setViewPosition(int topMargin) {
        FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) getLayoutParams();
        layoutParams.topMargin = topMargin;
        setLayoutParams(layoutParams);
        mBlurringView.setLayoutParams(layoutParams);
    }

    @Override
    public void swithchStateChanged(int index, Boolean state) {

        isOperation = true;
        for (ConnectModel model : dataSource) {
            if (model.equals(dataSource.get(index))) {
                model.isSelect = state;
            } else {
                model.isSelect = false;
            }
        }

        ConnectAdapter adapter = (ConnectAdapter) listView.getAdapter();
        adapter.notifyDataSetChanged();

        confirm.setEnabled(state);
    }
}

