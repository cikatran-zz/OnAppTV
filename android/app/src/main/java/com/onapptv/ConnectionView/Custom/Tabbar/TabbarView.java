package com.onapptv.ConnectionView.Custom.Tabbar;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.support.v4.graphics.drawable.RoundedBitmapDrawable;
import android.support.v4.graphics.drawable.RoundedBitmapDrawableFactory;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.onapptv.ConnectionView.Custom.Model.TabbarItemModel;
import com.onapptv.ConnectionView.Custom.View.Blur.BlurView;
import com.onapptv.ConnectionView.util.WindowManager;
import com.onapptv.R;

import java.util.ArrayList;

/**
 * Created by mac on 2018/5/9.
 */

public class TabbarView extends RelativeLayout {

    //根布局
    public LinearLayout linearLayoutRoot;
    //全局变量,记录当前选中的 item
    private LinearLayout selectLinerLayout;
    //全局变量,记录当前选中的 item 的 tag 值
    public int selectTag = 0;
    //delegate
    public TabbarViewDelegate delegate;
    //需要设置的 item 个数
    public ArrayList<TabbarItemModel> datas = new ArrayList<TabbarItemModel>();
    //未选中时候字体的颜色
    private int itemColor = R.color.colorBlackText;
    //选中时候字体的颜色
    private int selectItemColor = R.color.colorWhite;
    //背景色
    private int tabgroundColor = R.color.colorDarkGrey26;
    //Font size
    private int fontSize = 11;

    /**
     * 初始化函数
     *
     * @param context
     * @param attributeSet
     */
    public TabbarView(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);

        linearLayoutRoot = new LinearLayout(context);
        linearLayoutRoot.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        addView(linearLayoutRoot);
        loadUI(context);
        applyBlur(context);

    }

    /**
     * 加载 UI
     *
     * @param context
     */
    @SuppressLint("WrongConstant")
    public void loadUI(final Context context) {
        //根据数组长度初始化 item 个数
        for (int i = 0; i < datas.size(); i++) {
            TabbarItemModel model = datas.get(i);

            //实例化子布局
            final LinearLayout linearLayoutChild = new LinearLayout(context);
            linearLayoutChild.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.MATCH_PARENT, 1));
            linearLayoutChild.setWeightSum(1);
            linearLayoutChild.setBackgroundColor(Color.TRANSPARENT);
            linearLayoutChild.setTag(i);

            FrameLayout frameLayoutItem = new FrameLayout(context);
            frameLayoutItem.setBackgroundColor(Color.TRANSPARENT);
            frameLayoutItem.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            linearLayoutChild.addView(frameLayoutItem);

            LinearLayout linearLayoutItem = new LinearLayout(context);
            linearLayoutItem.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            linearLayoutItem.setGravity(Gravity.CENTER);
            linearLayoutItem.setOrientation(LinearLayout.VERTICAL);
            linearLayoutItem.setBackgroundColor(Color.TRANSPARENT);
            frameLayoutItem.addView(linearLayoutItem);

            //实例化图标
            //判断图标是否显示
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            lp.setMargins(0, 5, 0, 0);
            if (model.isShowImage) {
                ImageView imageView = new ImageView(context);
                imageView.setLayoutParams(lp);
                imageView.setImageResource(model.imageID);
                imageView.setBackgroundColor(Color.TRANSPARENT);
                imageView.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
                imageView.setAdjustViewBounds(true);
                imageView.setTag("image_" + i);
                linearLayoutItem.addView(imageView);
            }

            //实例化文字
            lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            lp.setMargins(0, 10, 0, 0);
            if (model.isShowTitle) {
                TextView textView = new TextView(context);
                Typeface typeface = Typeface.createFromAsset(context.getAssets(), "fonts/SF-UI-Text-Regular.otf");
                textView.setTypeface(typeface);
                textView.setText(model.titles);
                textView.setTextSize(fontSize);
                textView.setTextColor(getResources().getColor(this.itemColor));
                textView.setGravity(Gravity.CENTER);
                textView.setBackgroundColor(Color.TRANSPARENT);
                textView.setLayoutParams(lp);
                textView.setTag("text_" + i);
                linearLayoutItem.addView(textView);
            }
            //获取item的宽度
            final int itemWidth = WindowManager.getScreenWidth(context) / datas.size();
            final FrameLayout.LayoutParams lps = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            lps.gravity = Gravity.RIGHT | Gravity.TOP;
            if (model.mark != 0) {
                final TextView badge = new TextView(context);
                Typeface typeface = Typeface.createFromAsset(context.getAssets(), "fonts/SF-UI-Text-Regular.otf");
                badge.setTypeface(typeface);
                Resources resources = context.getResources();
                Drawable drawable = resources.getDrawable(R.drawable.badge);
                badge.setBackgroundDrawable(drawable);
                badge.setTextSize(fontSize);
                badge.setGravity(Gravity.CENTER);
                badge.setTextColor(Color.WHITE);
                badge.setText(String.valueOf(model.mark));
                badge.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
                    @Override
                    public void onGlobalLayout() {
                        int width = badge.getMeasuredWidth();
                        int height = badge.getMeasuredHeight();
                        lps.rightMargin = width / 2;
                        lps.topMargin = height / 2;
                        badge.setLayoutParams(lps);
                        getViewTreeObserver().removeOnGlobalLayoutListener(this);
                    }
                });
                badge.setLayoutParams(lps);
                badge.setTag("badge_" + i);
                frameLayoutItem.addView(badge);
            }

            //点击事件监听
            linearLayoutChild.setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View v) {
                    setSelected(v);
                    if (delegate != null) {
                        delegate.onThisClick((int) v.getTag());
                    }
                }
            });
            //long click listener
            linearLayoutChild.setOnLongClickListener(new OnLongClickListener() {
                @Override
                public boolean onLongClick(View v) {
                    setSelected(v);
                    if (delegate != null) {
                        delegate.onLongClickItem((int) v.getTag());
                    }
                    return true;
                }
            });
            //将该布局添加到根布局中
            linearLayoutRoot.addView(linearLayoutChild);
            if (i == selectTag) {
                //设置默认选中项
                selectLinerLayout = (LinearLayout) linearLayoutRoot.findViewWithTag(selectTag);
                //设置选中的图片
                if (((TabbarItemModel) datas.get(selectTag)).isShowImage) {
                    ImageView imageViews = (ImageView) selectLinerLayout.findViewWithTag("image_" + selectLinerLayout.getTag());
                    imageViews.setImageResource(model.imageID);
                }

                //设置选中字体的颜色
                if (((TabbarItemModel) datas.get(selectTag)).isShowTitle) {
                    TextView textView = (TextView) selectLinerLayout.findViewWithTag("text_" + selectLinerLayout.getTag());
                    textView.setTextColor(getResources().getColor(this.selectItemColor));
                }
            }
        }
    }

    public void setTabgroundColor(int tabgroundColor) {
        this.tabgroundColor = tabgroundColor;
        linearLayoutRoot.setBackgroundColor(getResources().getColor(tabgroundColor));
    }

    /**
     * 设置背景色
     */
    public void setBackgroundColor(int backgroundColor, int itemColor, int itemSelectColor, int fontSize) {
        this.tabgroundColor = backgroundColor;
        this.itemColor = itemColor;
        this.selectItemColor = itemSelectColor;
        this.fontSize = fontSize;
        linearLayoutRoot.setBackgroundColor(getResources().getColor(tabgroundColor));
        for (int i = 0; i < datas.size(); i++) {
            TabbarItemModel model = datas.get(i);
            LinearLayout linearLayoutChild = (LinearLayout) linearLayoutRoot.findViewWithTag(i);
            if (model.isShowTitle) {
                TextView textView = (TextView) linearLayoutChild.findViewWithTag("text_" + i);
                TextView badge = (TextView) linearLayoutChild.findViewWithTag("badge_" + i);
                //判断是否选中
                if (i == selectTag) {
                    textView.setTextColor(getResources().getColor(this.selectItemColor));
                }
                textView.setTextColor(getResources().getColor(this.itemColor));
                textView.setTextSize(this.fontSize);
                badge.setTextSize(this.fontSize);
            }
        }
    }

    /**
     * 设置选中和未选中状态的颜色
     *
     * @param view
     */
    private void setSelected(View view) {
        TabbarItemModel model = datas.get((int) view.getTag());
        if (selectTag != (int) view.getTag()) {
            TabbarItemModel selectModel = datas.get(selectTag);
            //首先判断是否显示图片
            if (selectModel.isShowImage) {
                //将上一次选中的图片恢复为未选中
                ImageView imageView = (ImageView) selectLinerLayout.findViewWithTag("image_" + selectTag);
                imageView.setImageResource(selectModel.imageID);
            }

            //设置选中的字体恢复到未选中
            if (selectModel.isShowTitle) {
                TextView textView = (TextView) selectLinerLayout.findViewWithTag("text_" + selectTag);
                textView.setTextColor(getResources().getColor(this.itemColor));
            }

            //重置选中的 tag
            selectTag = (int) view.getTag();
            //将选择的项存入全局变量，用于下一次点击更新控件
            selectLinerLayout = (LinearLayout) view;
            //将上一次选中的图片恢复为未选中
            if (model.isShowImage) {
                ImageView imageView = (ImageView) selectLinerLayout.findViewWithTag("image_" + selectTag);
                imageView.setImageResource(model.imageID);
            }

            //设置选中的字体恢复到未选中
            if (model.isShowTitle) {
                TextView textView = (TextView) selectLinerLayout.findViewWithTag("text_" + selectTag);
                textView.setTextColor(getResources().getColor(this.selectItemColor));
            }
        }
    }

    private void applyBlur(Context context) {
        View view = getRootView();
        view.setDrawingCacheEnabled(true);
        view.buildDrawingCache(true);

        linearLayoutRoot.postDelayed(new Runnable() {
            @Override
            public void run() {
//                获取当前窗口快照，相当于截屏
                Bitmap bmp1 = getBitmap(linearLayoutRoot);
                Bitmap bitmap2 = Bitmap.createBitmap(bmp1, 0, 0, bmp1.getWidth(), bmp1.getHeight());
                blur(bitmap2, linearLayoutRoot);
            }
        }, 100);
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    private void blur(Bitmap bitmap, View view) {
        long startMs = System.currentTimeMillis();
        float scaleFactor = 10;//图片缩放比例；
        float radius = 8;//模糊程度
        Bitmap overlay = Bitmap.createBitmap(
                (int) (view.getMeasuredWidth() / scaleFactor),
                (int) (view.getMeasuredHeight() / scaleFactor),
                Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(overlay);
        canvas.translate(-view.getLeft() / scaleFactor, -view.getTop() / scaleFactor);
        canvas.scale(1 / scaleFactor, 1 / scaleFactor);
        Paint paint = new Paint();
        paint.setFlags(Paint.FILTER_BITMAP_FLAG);
        canvas.drawBitmap(bitmap, 0, 0, paint);
        overlay = BlurView.doBlur(overlay, (int) radius, true);
        //创建得到 RoundedBitmapDrawable 对象
        RoundedBitmapDrawable roundImg = RoundedBitmapDrawableFactory.create(getResources(), overlay);
        //抗锯齿
        roundImg.setAntiAlias(true);
        //设置圆角
//        roundImg.setCornerRadius(50);
        view.setBackground(roundImg);
        /**
         * 打印高斯模糊处理时间，如果时间大约16ms，用户就能感到到卡顿，时间越长卡顿越明显，如果对模糊完图片要求不高，可是将scaleFactor设置大一些。
         */
    }

    /**
     * @param view 需要截取图片的view
     * @return 截图
     */
    private Bitmap getBitmap(View view) {
        View screenView = getRootView();
        screenView.setDrawingCacheEnabled(true);
        screenView.buildDrawingCache();
        //获取屏幕整张图片
        Bitmap bitmap = screenView.getDrawingCache();
        if (bitmap != null) {
            //需要截取的长和宽
            int outWidth = view.getWidth();
            int outHeight = view.getHeight();
            //获取需要截图部分的在屏幕上的坐标(view的左上角坐标）
            int[] viewLocationArray = new int[2];
            view.getLocationOnScreen(viewLocationArray);
            //从屏幕整张图片中截取指定区域
            bitmap = Bitmap.createBitmap(bitmap, viewLocationArray[0], viewLocationArray[1], outWidth, outHeight);
        }
        return bitmap;
    }

    public void setSelectTag(int selectTag) {
        this.selectTag = selectTag;
    }
}
