package com.onapptv.ConnectionView.Custom.View.Antena;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.os.Handler;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.onapptv.ConnectionView.Custom.Model.AntenaModel;
import com.onapptv.ConnectionView.Custom.View.Blur.BlurringView;
import com.onapptv.ConnectionView.util.DensityUtil;
import com.onapptv.ConnectionView.util.WindowManager;
import com.onapptv.R;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import tv.hi_global.stbapi.Api;
import tv.hi_global.stbapi.Model.DatabaseSatelliteModel;
import tv.hi_global.stbapi.Model.DatabaseTransponderModel;

public class AntenaView extends RelativeLayout implements AntenaButtonDelegate {

    private Context mContext;

    private ListView listView;
    private View strength;
    private View quality;
    private Timer timer;
    private BlurringView mBlurringView;
    private ViewGroup mParentView;
    private View blurView;
    private Handler handler = new Handler();

    private List<AntenaModel> dataSource;

    private String[] titles = {"DiSEqC1.0", "DiSEqC1.1", "LNB Type", "22 kHz", "Transponder"};
    private String[] diSeqC10s = {"None", "LNB1", "LNB2", "LNB3", "LNB4"};
    private String[] diSeqC11s = {"None", "LNB1", "LNB2", "LNB3", "LNB4", "LNB5", "LNB6", "LNB7", "LNB8", "LNB9", "LNB10", "LNB11", "LNB12", "LNB13", "LNB14", "LNB15", "LNB16"};
    private String[] lNBValue = {"OFF", "ON", "AUTO"};
    private ArrayList<String> lowLOF = new ArrayList<String>() {{
        add("5150");
        add("5750");
        add("9750");
    }};
    private ArrayList<String> highLOF = new ArrayList<String>() {{
        add("10600");
        add("10750");
        add("11300");
        add("11475");
    }};
    private DatabaseSatelliteModel satellite;

    double antenaView_ProportionHeight = 396.0 / 665.0;
    double antenaView_ProportionWidth = 282.0 / 375.0;
    double antenaView_AspectRatio = 282.0 / 396.0;
    int antenaView_width;
    int antenaView_height;

    public AntenaView(Context context, ViewGroup parentView, View blurView) {
        super(context);
        mContext = context;
        this.mParentView = parentView;
        this.blurView = blurView;
        setupSubViews();
        loadData();
    }

    void setupSubViews() {
        antenaView_width = (int) (WindowManager.getScreenWidth(mContext) * antenaView_ProportionWidth);
        antenaView_height = (int) (antenaView_width / antenaView_AspectRatio);

        RelativeLayout root = new RelativeLayout(mContext);
        RelativeLayout.LayoutParams rootLp = new LayoutParams(antenaView_width, antenaView_height);
        rootLp.addRule(CENTER_HORIZONTAL);
        rootLp.topMargin = (int) (WindowManager.getScreenHeight(mContext) * 99.0 / 665.0);
        root.setLayoutParams(rootLp);
//        Background
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        layoutParams.width = antenaView_width;
        layoutParams.height = antenaView_height;
        layoutParams.topMargin =   (int) (WindowManager.getScreenHeight(mContext) * 99.0 / 665.0);
        layoutParams.leftMargin = (WindowManager.getScreenWidth(mContext) - antenaView_width) / 2;
        mBlurringView = new BlurringView(mContext);
        mBlurringView.setBlurRadius(15);
        mBlurringView.setDownsampleFactor(8);
        mBlurringView.setOverlayColor(getResources().getColor(R.color.colorClear));
        mBlurringView.setRadius(DensityUtil.dip2px(mContext, 13));
        mBlurringView.setLayoutParams(layoutParams);
        new Thread(new Runnable() {
            @Override
            public void run() {
                // Give the blurring view a reference to the blurred view.
                mBlurringView.setBlurredView(blurView);
            }
        }).start();
        mParentView.addView(mBlurringView);
        int rootCornerRadius = DensityUtil.dip2px(mContext, 13);
        float[] rootOuterRadian = new float[]{rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius, rootCornerRadius};
        RoundRectShape roundRectShape = new RoundRectShape(rootOuterRadian, null, null);
        ShapeDrawable rootDrawable = new ShapeDrawable(roundRectShape);
        rootDrawable.getPaint().setColor(Color.TRANSPARENT);
        root.setBackgroundDrawable(rootDrawable);
        addView(root);

        rootLp = new LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        rootLp.topMargin = 0;
        RelativeLayout relativeLayoutChild = new RelativeLayout(mContext);
        relativeLayoutChild.setLayoutParams(rootLp);
        root.addView(relativeLayoutChild);

        RelativeLayout relativeLayout = new RelativeLayout(mContext);
        relativeLayout.setLayoutParams(rootLp);
        rootDrawable.getPaint().setColor(getResources().getColor(R.color.colorDarkGrey12));
        relativeLayout.setBackgroundDrawable(rootDrawable);
        relativeLayoutChild.addView(relativeLayout);
//        ListView
        listView = new ListView(mContext);
        int listView_height = (int) (antenaView_height * 44 * 5 / 396.0);
        RelativeLayout.LayoutParams listViewLp = new LayoutParams(antenaView_width, listView_height);
        listViewLp.addRule(CENTER_HORIZONTAL);
        listViewLp.topMargin = antenaView_height * 29 / 396;
        listView.setDividerHeight(0);
        listView.setLayoutParams(listViewLp);
        listView.setVerticalScrollBarEnabled(false);
        listView.setFastScrollEnabled(false);
        relativeLayout.addView(listView);
//        Signal Strength Label
        TextView strengthLabel = new TextView(mContext);
        strengthLabel.setText("Signal Strength");
        strengthLabel.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 13);
        Typeface typeface = Typeface.createFromAsset(mContext.getAssets(), "fonts/helveticaneue-regular.ttf");
        strengthLabel.setTypeface(typeface);
        strengthLabel.setTextColor(Color.WHITE);

        RelativeLayout.LayoutParams strengthLabelLp = new LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        strengthLabelLp.leftMargin = (int) (antenaView_width * 23.0 / 282.0);
        strengthLabelLp.topMargin = (int) (antenaView_height * 283.0 / 396.0);
        relativeLayout.addView(strengthLabel, strengthLabelLp);
//        Signal Strength BackgroundView
        View strengthBackgroundView = new View(mContext);
        int strengthBackgroundView_width = (int) (antenaView_width * ((282.0 - 23 * 2) / 282.0));
        int strengthBackgroundView_height = (int) (antenaView_width * 3.72 / 396.0);

        RelativeLayout.LayoutParams strengthBackgroundLp = new LayoutParams(strengthBackgroundView_width, strengthBackgroundView_height);
        strengthBackgroundLp.leftMargin = strengthLabelLp.leftMargin;
        strengthBackgroundLp.topMargin = (int) (antenaView_height * 307.5 / 396.0);

        int strengthBackgroundCornerRadius = strengthBackgroundView_height / 2;
        float[] strengthBackgroundOuterRadian = new float[]{strengthBackgroundCornerRadius, strengthBackgroundCornerRadius, strengthBackgroundCornerRadius, strengthBackgroundCornerRadius, strengthBackgroundCornerRadius, strengthBackgroundCornerRadius, strengthBackgroundCornerRadius, strengthBackgroundCornerRadius};
        RoundRectShape strengthBackgroundRectShape = new RoundRectShape(strengthBackgroundOuterRadian, null, null);
        ShapeDrawable strengthBackgroundDrawable = new ShapeDrawable(strengthBackgroundRectShape);
        strengthBackgroundDrawable.getPaint().setColor(getResources().getColor(R.color.colorBlack09));
        strengthBackgroundView.setBackgroundDrawable(strengthBackgroundDrawable);

        relativeLayout.addView(strengthBackgroundView, strengthBackgroundLp);
//        Signal Quality Label
        TextView qualityLabel = new TextView(mContext);
        qualityLabel.setText("Signal Quality");
        qualityLabel.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 13);
        qualityLabel.setTypeface(typeface);
        qualityLabel.setTextColor(Color.WHITE);

        RelativeLayout.LayoutParams qualityLabelLp = new LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        qualityLabelLp.leftMargin = (int) (antenaView_width * 23.0 / 282.0);
        qualityLabelLp.topMargin = (int) (antenaView_height * 325.0 / 396.0);
        relativeLayout.addView(qualityLabel, qualityLabelLp);
//        Signal Quality BackgroundView
        View qualityBackgroundView = new View(mContext);

        RelativeLayout.LayoutParams qualityBackgroundViewLp = new LayoutParams(strengthBackgroundView_width, strengthBackgroundView_height);
        qualityBackgroundViewLp.leftMargin = strengthLabelLp.leftMargin;
        qualityBackgroundViewLp.topMargin = (int) (antenaView_height * 349.5 / 396.0);

        qualityBackgroundView.setBackgroundDrawable(strengthBackgroundDrawable);
        relativeLayout.addView(qualityBackgroundView, qualityBackgroundViewLp);
//        Strength View
        strength = new View(mContext);
        RelativeLayout.LayoutParams strengthLp = new LayoutParams(0, strengthBackgroundView_height);
        strengthLp.leftMargin = strengthBackgroundLp.leftMargin;
        strengthLp.topMargin = strengthBackgroundLp.topMargin;
        RoundRectShape strengthRectShape = new RoundRectShape(strengthBackgroundOuterRadian, null, null);
        ShapeDrawable strengthDrawable = new ShapeDrawable(strengthRectShape);
        strengthDrawable.getPaint().setColor(getResources().getColor(R.color.selfColorRed));
        strength.setBackgroundDrawable(strengthDrawable);
        relativeLayout.addView(strength, strengthLp);
//        Quality View
        quality = new View(mContext);
        RelativeLayout.LayoutParams qualityLp = new LayoutParams(0, strengthBackgroundView_height);
        qualityLp.leftMargin = qualityBackgroundViewLp.leftMargin;
        qualityLp.topMargin = qualityBackgroundViewLp.topMargin;
        RoundRectShape qualityRectShape = new RoundRectShape(strengthBackgroundOuterRadian, null, null);
        ShapeDrawable qualityDrawable = new ShapeDrawable(qualityRectShape);
        qualityDrawable.getPaint().setColor(getResources().getColor(R.color.selfColorRed));
        quality.setBackgroundDrawable(qualityDrawable);
        relativeLayout.addView(quality, qualityLp);
    }

    void loadData() {
        dataSource = new ArrayList<>();

        for (int i = 0; i < titles.length; i++) {
            AntenaModel model = new AntenaModel();
            model.title = titles[i];
            model.arrayType = AntenaArrayType.AntenaArrayType_none;

            if (Api.sharedApi().hIG_IsConnect()) {
                List<DatabaseSatelliteModel> satelliteArr = Api.sharedApi().getCurrentDatabaseModel().getSatelliteArr();
                satellite = satelliteArr.get(satelliteArr.size() - 1);
                model.transponderArray = satellite.getTransponderModelArr();
                if (i == 0) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_single;
                    model.sigleArray = diSeqC10s;
                    model.index = satellite.diSEqC10;
                } else if (i == 1) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_single;
                    model.sigleArray = diSeqC11s;
                    model.index = satellite.diSEqC11;
                } else if (i == 2) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_mixture;
                    if (!lowLOF.contains(String.valueOf(satellite.lowLOF))) {
                        lowLOF.add(String.valueOf(satellite.lowLOF));
                    }
                    int j = lowLOF.indexOf(String.valueOf(satellite.lowLOF));

                    if (!highLOF.contains(String.valueOf(satellite.highLOF))) {
                        highLOF.add(String.valueOf(satellite.highLOF));
                    }
                    int k = highLOF.indexOf(String.valueOf(satellite.highLOF));
                    model.index = j * highLOF.size() + k;
                } else if (i == 3) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_single;
                    model.sigleArray = lNBValue;
                    model.index = satellite.lNBValue;
                } else if (i == 4) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_transponder;
                    model.index = model.transponderArray.size() - 1;

                    DatabaseTransponderModel transponder = satellite.getTransponderModelArr().get(model.index);
                    Api.sharedApi().hIG_SetFeTun(transponder.carrierID, null);

                    startTimer();
                }
            } else {
                model.transponderArray = null;
                if (i == 0) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_single;
                    model.sigleArray = diSeqC10s;
                } else if (i == 1) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_single;
                    model.sigleArray = diSeqC11s;
                } else if (i == 2) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_mixture;
                } else if (i == 3) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_single;
                    model.sigleArray = lNBValue;
                } else if (i == 4) {
                    model.arrayType = AntenaArrayType.AntenaArrayType_transponder;
                }
                model.index = 0;
            }
            model.mixtureArray1 = lowLOF.toArray(new String[lowLOF.size()]);
            model.mixtureArray2 = highLOF.toArray(new String[highLOF.size()]);
            ;
            dataSource.add(model);
        }
        AntenaAdapter adapter = new AntenaAdapter(mContext, dataSource);
        adapter.delegate = this;
        listView.setAdapter(adapter);
    }

    void startTimer() {
        stopTimer();
        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                getSignal();
            }
        }, 0, 1000);
    }

    void stopTimer() {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }

    void getSignal() {
        Api.sharedApi().hIG_GetSignal(new Api.OnGetSignalCallbackBlock() {
            @Override
            public void OnGetSignalCallback(boolean b, String s, long l, int i, int i1) {
                if (b == true) {
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
                            if (i <= 100) {
                                ViewGroup.LayoutParams strengthlp = strength.getLayoutParams();
                                strengthlp.width = (int) (antenaView_width * i / 100.0 * (282.0 - 23 * 2) / 282.0);
                                strength.setLayoutParams(strengthlp);
                            }

                            if (i1 <= 100) {
                                ViewGroup.LayoutParams qualitylp = quality.getLayoutParams();
                                qualitylp.width = (int) (antenaView_width * i1 / 100.0 * (282.0 - 23 * 2) / 282.0);
                                quality.setLayoutParams(qualitylp);
                            }
                        }
                    });
                }
            }
        });
    }

    @Override
    public void onClick(ImageButton button) {
        buttonAction(button);
    }

    void buttonAction(ImageButton button) {
        int index = button.getTag().hashCode() / 10;
        Boolean isLeft = button.getTag().hashCode() % 10 == 1 ? true : false;

        AntenaModel model = dataSource.get(index);

        if (index == 0 || index == 1 || index == 3) {
            if (isLeft) {
                if (model.index == 0) {
                    model.index = model.sigleArray.length - 1;
                } else {
                    model.index = model.index - 1;
                }
            } else {
                if (model.index == model.sigleArray.length - 1) {
                    model.index = 0;
                } else {
                    model.index = model.index + 1;
                }
            }
        } else if (index == 4) {
            if (model.transponderArray != null) {
                if (isLeft) {
                    if (model.index == 0) {
                        model.index = model.transponderArray.size() - 1;
                    } else {
                        model.index = model.index - 1;
                    }
                } else {
                    if (model.index == model.transponderArray.size() - 1) {
                        model.index = 0;
                    } else {
                        model.index = model.index + 1;
                    }
                }
            }
        } else if (index == 2) {
            int indexMax = model.mixtureArray1.length * model.mixtureArray2.length - 1;
            if (isLeft) {
                if (model.index == 0) {
                    model.index = indexMax;
                } else {
                    model.index = model.index - 1;
                }
            } else {
                if (model.index == indexMax) {
                    model.index = 0;
                } else {
                    model.index = model.index + 1;
                }
            }
        }
        AntenaAdapter adapter = (AntenaAdapter) listView.getAdapter();
        adapter.notifyDataSetChanged();
        setDatabase();
    }

    void setDatabase() {
        if (Api.sharedApi().hIG_IsConnect()) {
            int diseqC10 = dataSource.get(0).index;
            int diseqC11 = dataSource.get(1).index;
            satellite.diSEqC10 = diseqC10;
            satellite.diSEqC11 = diseqC11;
            if (diseqC10 == 0 && diseqC11 == 0) {
                satellite.diSEqCLevel = 0;
            } else if (diseqC10 != 0 && diseqC11 == 0) {
                satellite.diSEqCLevel = 1;
            } else if (diseqC10 == 0 && diseqC11 != 0) {
                satellite.diSEqCLevel = 2;
            } else {
                satellite.diSEqCLevel = 5;
            }
            satellite.lNBValue = dataSource.get(3).index;

            satellite.lowLOF = Integer.parseInt(lowLOF.get(dataSource.get(2).index / highLOF.size()));
            satellite.highLOF = Integer.parseInt(highLOF.get(dataSource.get(2).index / highLOF.size()));

            Api.sharedApi().hIG_SetSatellite(satellite, null);

            DatabaseTransponderModel transponder = satellite.getTransponderModelArr().get(dataSource.get(4).index);
            Api.sharedApi().hIG_SetFeTun(transponder.carrierID, null);

            startTimer();
        }
    }

    public void removeFromSuperview() {
        ((ViewGroup) getParent()).removeView(this);
        mParentView.removeView(mBlurringView);
        stopTimer();
    }

}
