package com.onapptv.ConnectionView.Custom.View.Password;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.os.Handler;
import android.util.TypedValue;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.onapptv.ConnectionView.util.DensityUtil;
import com.onapptv.ConnectionView.util.WindowManager;
import com.onapptv.R;

import tv.hi_global.stbapi.Api;

public class PasswordView extends RelativeLayout {

    private TextView passwordViewLabel;
    private String password;
    private String passwordConfirm;
    private Boolean isConfirm;
    public PasswordViewDelegate delegate;

    private Context mContext;
    private Handler handler = new Handler();
    private int resource_base = getResources().getIdentifier("password_base", "drawable", getContext().getPackageName());
    private int resource_top = getResources().getIdentifier("password_top", "drawable", getContext().getPackageName());

    public PasswordView(Context context) {
        super(context);
        mContext = context;
        setupSubViews();
        commonInit();
    }

    void setupSubViews() {
//        Password View
        int passwordView_width = (int) (282.0 / 375.0 * WindowManager.getScreenWidth(mContext));
        int passwordView_height = (int) (passwordView_width / (float) (282.0 / 118.0));
        int passwordView_y = (int) (197.0 / 664.9 * WindowManager.getScreenHeight(mContext));
        LayoutParams passwordViewLp = new LayoutParams(passwordView_width,
                passwordView_height);
        passwordViewLp.addRule(CENTER_HORIZONTAL);
        passwordViewLp.topMargin = passwordView_y;
        RelativeLayout passwordView = new RelativeLayout(mContext);
        passwordView.setLayoutParams(passwordViewLp);
        int passwordViewCornerRadius = DensityUtil.dip2px(mContext, 13);
        float[] passwordViewOuterRadian = new float[]{passwordViewCornerRadius, passwordViewCornerRadius, passwordViewCornerRadius, passwordViewCornerRadius, passwordViewCornerRadius, passwordViewCornerRadius, passwordViewCornerRadius, passwordViewCornerRadius};
        RoundRectShape roundRectShape = new RoundRectShape(passwordViewOuterRadian, null, null);
        ShapeDrawable passwordViewDrawable = new ShapeDrawable(roundRectShape);
        passwordViewDrawable.getPaint().setColor(getResources().getColor(R.color.colorWhite28));
        passwordView.setBackgroundDrawable(passwordViewDrawable);
        addView(passwordView);
//        Password View Label
        passwordViewLabel = new TextView(mContext);
        passwordViewLabel.setTextColor(Color.WHITE);
        passwordViewLabel.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 15);
        Typeface typeface = Typeface.createFromAsset(mContext.getAssets(), "fonts/SF-UI-Text-Regular.otf");
        passwordViewLabel.setTypeface(typeface);
        passwordViewLabel.setText("Enter PIN Code");
        LayoutParams passwordViewLabelLp = new LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        passwordViewLabelLp.addRule(CENTER_VERTICAL);
        passwordViewLabelLp.leftMargin = DensityUtil.dip2px(mContext, 37);
        passwordViewLabel.setLayoutParams(passwordViewLabelLp);
        passwordView.addView(passwordViewLabel);
//        Password View Circle View
        int passwordViewCircleView_width = (int) (68.0 / 282.0 * passwordView_width);
        int passwordViewCircleView_height = (int) (14.0 / 118.0 * passwordView_height);
        LayoutParams passwordViewCircleView_Lp = new LayoutParams(passwordViewCircleView_width,
                passwordViewCircleView_height);
        passwordViewCircleView_Lp.addRule(CENTER_VERTICAL);
        passwordViewCircleView_Lp.leftMargin = DensityUtil.dip2px(mContext, 170);
        RelativeLayout passwordViewCircleView = new RelativeLayout(mContext);
        passwordViewCircleView.setLayoutParams(passwordViewCircleView_Lp);
        passwordView.addView(passwordViewCircleView);
//        Circle Image
        int circle_width = (int) (14.16 / 282.0 * passwordView_width);
        int circle_height = (int) (13.73 / 118.0 * passwordView_height);
        int circle_space = (passwordViewCircleView_width - 4 * circle_width) / 3;
        for (int i = 0; i <= 3; i++) {
            ImageView circle = new ImageView(mContext);
            circle.setImageResource(resource_base);
            LayoutParams circleLp = new LayoutParams(circle_width,
                    circle_height);
            circleLp.leftMargin = i * (circle_space + circle_width);
            circle.setLayoutParams(circleLp);
            int circle_id = 1000000 + i;
            circle.setId(circle_id);
            passwordViewCircleView.addView(circle);
        }
//        Button View
        int buttonView_height = WindowManager.getScreenHeight(mContext) * 216 / 664;
        RelativeLayout buttonView = new RelativeLayout(mContext);
        LayoutParams buttonViewLp = new LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, buttonView_height);
        buttonViewLp.addRule(CENTER_HORIZONTAL);
        buttonViewLp.addRule(ALIGN_PARENT_BOTTOM);
        buttonView.setLayoutParams(buttonViewLp);
        addView(buttonView);
//        Button
        int button_horizontalSpace1 = WindowManager.getScreenWidth(mContext) * 5 / 375;
        int button_horizontalSpace2 = WindowManager.getScreenWidth(mContext) * 7 / 375;
        int button_verticalSpace = (int) (buttonView_height * 6.0 / 216.0);
        int button_width = (WindowManager.getScreenWidth(mContext) - 2 * (button_horizontalSpace1 + button_horizontalSpace2)) / 3;
        int button_height = (buttonView_height - 5 * button_verticalSpace) / 4;
        for (int i = 0; i <= 11; i++) {
            if (i == 9) {
                continue;
            }
            int button_x = button_horizontalSpace1 + i % 3 * (button_width + button_horizontalSpace2);
            int button_y = (i / 3) * (button_height + button_verticalSpace) + button_verticalSpace;

            LayoutParams buttonLp = new LayoutParams(button_width, button_height);
            buttonLp.topMargin = button_y;
            buttonLp.leftMargin = button_x;
            if (i != 11) {
                String button_string = String.valueOf(i + 1);
                if (i == 10) {
                    button_string = "0";
                }
                Button button = new Button(mContext);
                button.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 25);
                typeface = Typeface.createFromAsset(mContext.getAssets(), "fonts/SF-Pro-Display-Regular.otf");
                button.setTypeface(typeface);
                button.setText(button_string);
                button.setTextColor(Color.WHITE);
                button.setPadding(0, 0, 0, 8);
                button.setOnTouchListener(new OnTouchListener() {
                    @Override
                    public boolean onTouch(View v, MotionEvent event) {
                        if (event.getAction() == MotionEvent.ACTION_DOWN) {
                            button.setTextColor(Color.GRAY);
                        } else if (event.getAction() == MotionEvent.ACTION_UP) {
                            button.setTextColor(Color.WHITE);
                        }
                        return false;
                    }
                });

                int buttonCornerRadius = DensityUtil.dip2px(mContext, 4);
                float[] buttonOuterRadian = new float[]{buttonCornerRadius, buttonCornerRadius, buttonCornerRadius, buttonCornerRadius, buttonCornerRadius, buttonCornerRadius, buttonCornerRadius, buttonCornerRadius};
                RoundRectShape buttonRectShape = new RoundRectShape(buttonOuterRadian, null, null);
                ShapeDrawable buttonDrawable = new ShapeDrawable(buttonRectShape);
                buttonDrawable.getPaint().setColor(getResources().getColor(R.color.colorWhite25));
                button.setBackgroundDrawable(buttonDrawable);
                button.setLayoutParams(buttonLp);
                button.setTag(20 + i);
                button.setOnClickListener(new OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        buttonAction(button);
                    }
                });
                buttonView.addView(button);
            } else {
                ImageButton imageButton = new ImageButton(mContext);
                imageButton.setImageDrawable(getResources().getDrawable(R.drawable.password_delete));
                imageButton.setBackgroundColor(getResources().getColor(R.color.colorClear));
                imageButton.setLayoutParams(buttonLp);
                imageButton.setTag(20 + i);
                imageButton.setOnClickListener(new OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        buttonAction(imageButton);
                    }
                });
                buttonView.addView(imageButton);
            }

        }
    }

    void commonInit() {
        password = "";
        passwordConfirm = "";
        isConfirm = false;
    }

    void buttonAction(View v) {
        if (!isConfirm) {
            password = passwordAction(v, password);
            if (password.length() == 4) {
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        isConfirm = true;
                        passwordViewLabel.setText("Confirm PIN Code");
                        for (int i = 0; i <= 3; i++) {
                            int circle_id = 1000000 + i;
                            ImageView circle = findViewById(circle_id);
                            circle.setImageResource(resource_base);
                        }
                    }
                }, 100);
            }
        } else {
            passwordConfirm = passwordAction(v, passwordConfirm);
            if (passwordConfirm.length() == 4) {
                if (password.equals(passwordConfirm)) {
                    Api.sharedApi().hIG_ResetSTBPIN(Api.sharedApi().hIG_GetSTBPIN(), passwordConfirm, new Api.OnSuccessCallbackBlock() {
                        @Override
                        public void OnSuccessCallback(Boolean aBoolean, String s) {
                            if (aBoolean) {
                                if (delegate != null) {
                                    delegate.setPasswordSuccess();
                                }
                            } else {
                                if (s.equals("New PIN cannot be the same as the old PIN")) {
                                    if (delegate != null) {
                                        delegate.setPasswordSuccess();
                                    }
                                } else {
                                    if (delegate != null) {
                                        delegate.setPasswordFail(s);
                                    }
                                }
                            }
                        }
                    });
                } else {
                    handler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            reset();
                        }
                    }, 100);
                }
            }
        }
    }

    String passwordAction(View v, String s) {
        int id = 1000000 + s.length() - 1;
        if (v.getTag().hashCode() == 31) {
            if (s.length() != 0) {
                ImageView circle = findViewById(id);
                circle.setImageResource(resource_base);
            } else if (s.length() == 0 && isConfirm) {
                isConfirm = false;
                password = "";
                passwordViewLabel.setText("Enter PIN Code");
            }
//            Remove the last character
            if (s.length() > 0) {
                s = s.substring(0, s.length() - 1);
            }
        } else {
            if (s.length() < 4) {
                Button button = (Button) v;
                s = s + button.getText();
                id = 1000000 + s.length() - 1;
                ImageView circle = findViewById(id);
                circle.setImageResource(resource_top);
            }
        }
        return s;
    }

    public void reset() {
        password = "";
        passwordConfirm = "";
        isConfirm = false;
        passwordViewLabel.setText("Enter PIN Code");
        for (int i = 0; i <= 3; i++) {
            int circle_id = 1000000 + i;
            ImageView circle = findViewById(circle_id);
            circle.setImageResource(resource_base);
        }
    }
}
