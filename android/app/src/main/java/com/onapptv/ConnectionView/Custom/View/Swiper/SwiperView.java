package com.onapptv.ConnectionView.Custom.View.Swiper;

import android.content.Context;
import android.graphics.Typeface;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.onapptv.ConnectionView.Custom.Model.SwiperModel;
import com.onapptv.ConnectionView.util.DensityUtil;
import com.onapptv.R;

import java.util.ArrayList;
import java.util.List;

public class SwiperView extends RelativeLayout {

    public List<SwiperModel> datas;

    private static final int swiperview_viewPager = 0x1111111;
    private static final int swiperview_dots = 0x1111112;
    private static final int swiperview_dot = 0x1111113;
    private ViewPager viewPager;
    private LinearLayout dots;
    private List<View> pages;
    private RelativeLayout contentView;
    private int curIndex = 0;
    private SwiperDelegate delegate;

    public SwiperView(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView(context);
    }

    public void setDatas(List<SwiperModel> datas) {
        this.datas = datas;
        loadData(getContext());
    }

    private void initView(Context context) {
        viewPager = new ViewPager(context);
        LayoutParams viewPagerLp = new LayoutParams(LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT);
        viewPager.setId(swiperview_viewPager);
        addView(viewPager, viewPagerLp);

        dots = new LinearLayout(context);
        LayoutParams dotsLp = new LayoutParams(LayoutParams.WRAP_CONTENT,
                LayoutParams.WRAP_CONTENT);
        dotsLp.addRule(ALIGN_PARENT_TOP);
        dotsLp.addRule(RelativeLayout.CENTER_HORIZONTAL);
        dotsLp.topMargin = DensityUtil.dip2px(context, 506.3f);
        dots.setGravity(CENTER_HORIZONTAL);
        dots.setId(swiperview_dots);
        addView(dots, dotsLp);

        pages = new ArrayList<>();

        if (datas == null) {
            datas = new ArrayList<>();
        }
        loadData(context);
    }

    private void loadData(Context context) {
        viewPager.removeAllViews();
        for (int i = 0; i < datas.size(); i++) {

            contentView = new RelativeLayout(context);
            LayoutParams viewLp = new LayoutParams(LayoutParams.MATCH_PARENT,
                    LayoutParams.MATCH_PARENT);
            contentView.setLayoutParams(viewLp);
            ImageButton image = new ImageButton(context);
            image.setBackgroundColor(context.getResources().getColor(R.color.colorClear));
            LayoutParams imageLp = new LayoutParams(LayoutParams.WRAP_CONTENT,
                    LayoutParams.WRAP_CONTENT);
            imageLp.addRule(RelativeLayout.CENTER_HORIZONTAL);
            imageLp.width = DensityUtil.dip2px(context, 82);
            imageLp.height = DensityUtil.dip2px(context, 82);
            imageLp.topMargin = DensityUtil.dip2px(context, 243.5f);
            int finalI = i;
            image.setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (delegate != null) {
                        delegate.onButtonInClicked(finalI);
                    }
                }
            });
            contentView.addView(image, imageLp);

            Typeface typeface = Typeface.createFromAsset(context.getAssets(), "fonts/SF-UI-Text-Regular.otf");
            TextView title = new TextView(context);
            title.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 17);
            title.setTypeface(typeface);
            title.setTextColor(context.getResources().getColor(R.color.selfColorRed));
            LayoutParams titleLp = new LayoutParams(LayoutParams.WRAP_CONTENT,
                    LayoutParams.WRAP_CONTENT);
            titleLp.addRule(RelativeLayout.CENTER_HORIZONTAL);
            titleLp.topMargin = DensityUtil.dip2px(context, 106.5f);
            contentView.addView(title, titleLp);

            TextView content = new TextView(context);
            content.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 17);
            content.setGravity(Gravity.CENTER);
            content.setTypeface(typeface);
            content.setTextColor(context.getResources().getColor(R.color.colorBlackText57));
            LayoutParams contentLp = new LayoutParams(LayoutParams.WRAP_CONTENT,
                    LayoutParams.WRAP_CONTENT);
            contentLp.addRule(RelativeLayout.CENTER_HORIZONTAL);
            contentLp.topMargin = DensityUtil.dip2px(context, 135.5f);
            contentView.addView(content, contentLp);

            TextView subscription = new TextView(context);
            subscription.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 13);
            subscription.setGravity(Gravity.CENTER);
            subscription.setTypeface(typeface);
            subscription.setTextColor(context.getResources().getColor(R.color.colorBlackText57));
            LayoutParams subscriptionLp = new LayoutParams(LayoutParams.WRAP_CONTENT,
                    LayoutParams.WRAP_CONTENT);
            subscriptionLp.addRule(RelativeLayout.CENTER_HORIZONTAL);
            subscriptionLp.topMargin = DensityUtil.dip2px(context, 339.0f);
            contentView.addView(subscription, subscriptionLp);

            SwiperModel model = datas.get(i);

            if (model.isShowImageView) {
                image.setVisibility(VISIBLE);
            } else {
                image.setVisibility(INVISIBLE);
            }

            if (model.image != null) {
                image.setImageResource(getResources().getIdentifier(model.image, "drawable", getContext().getPackageName()));
            }

            if (model.title != null) {
                title.setText(model.title);
            }

            if (model.content != null) {
                content.setText(model.content);
            }

            if (model.subscription != null) {
                subscription.setText(model.subscription);
            }

            if (model.isContentTextCenter != null) {
                if (model.isContentTextCenter) {
                    content.setGravity(Gravity.LEFT);
                }
            }
            pages.add(contentView);
        }

        viewPager.setAdapter(new SwiperPagerAdapter(pages, context));

        setOvalLayout();
    }

    /**
     * 设置圆点
     */
    public void setOvalLayout() {
        dots.removeAllViews();
        for (int i = 0; i < datas.size(); i++) {
            View dot = new View(getContext());
            LinearLayout.LayoutParams dotLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
            dotLp.width = DensityUtil.dip2px(getContext(), 16.0f);
            dotLp.height = DensityUtil.dip2px(getContext(), 16.0f);
            dotLp.leftMargin = DensityUtil.dip2px(getContext(), 3f);
            dotLp.rightMargin = DensityUtil.dip2px(getContext(), 3f);
            dot.setBackgroundDrawable(getContext().getResources().getDrawable(R.drawable.dot));
            dot.setId(swiperview_dot);
            dot.setSelected(false);
            dots.addView(dot, dotLp);
        }
        if (datas.size() > 0) {
            // 默认显示第一页
            dots.getChildAt(0).findViewById(swiperview_dot).setSelected(true);
        }
        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                // 取消圆点选中
                dots.getChildAt(curIndex).findViewById(swiperview_dot).setSelected(false);
                // 圆点选中
                dots.getChildAt(position).findViewById(swiperview_dot).setSelected(true);
                curIndex = position;

                if (delegate != null) {
                    delegate.onPageScrolled(position, positionOffset, positionOffsetPixels);
                }
            }

            @Override
            public void onPageSelected(int position) {
                if (delegate != null) {
                    delegate.onPageSelected(position);
                }
            }

            @Override
            public void onPageScrollStateChanged(int state) {
                if (delegate != null) {
                    delegate.onPageScrollStateChanged(state);
                }
            }
        });
    }

    public void setDelegate(SwiperDelegate delegate) {
        this.delegate = delegate;
    }
}
