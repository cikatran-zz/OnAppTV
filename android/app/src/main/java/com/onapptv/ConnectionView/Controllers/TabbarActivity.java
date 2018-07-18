package com.onapptv.ConnectionView.Controllers;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ValueAnimator;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.widget.AbsListView;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;

import com.onapptv.ConnectionView.Controllers.Start.SoftwareUpdateActivity;
import com.onapptv.ConnectionView.Controllers.Start.WifiConnectActivity;
import com.onapptv.ConnectionView.Custom.Model.TabbarItemModel;
import com.onapptv.ConnectionView.Custom.Tabbar.TabbarView;
import com.onapptv.ConnectionView.Custom.Tabbar.TabbarViewDelegate;
import com.onapptv.ConnectionView.Custom.View.Connect.ConnectView;
import com.onapptv.ConnectionView.Custom.View.Connect.ConnectViewDelegate;
import com.onapptv.ConnectionView.util.StatusBarUtil;
import com.onapptv.ConnectionView.util.WindowManager;
import com.onapptv.R;

import java.util.ArrayList;
import java.util.List;


public class TabbarActivity extends BaseActivity implements ConnectViewDelegate, TabbarViewDelegate {

    //当前显示的 fragment
    private static final String CURRRNT_FRAGMENT = "STATE_FRAGMENT_SHOW";
    private RotateAnimation rotateAnimation;
    View centerView = null;
    private boolean isAnimation;
    private FragmentManager manager;
    //当前显示的视图
    private Fragment currentFragment = new Fragment();
    private List<Fragment> fragments = new ArrayList<>();
    //当前选中的下标
    private int currentIndex = 2;
    private ConnectView connectView;
    private TabbarView tabbarView;
    private double duration = 0.5 * 1000;

    private LinearLayout linearLayoutRoot;
    private FrameLayout frameLayoutRoot;
    private View mRootView;
    private float beginPoint;
    private Boolean isInside;
    private float connectViewParams;
    private float mListTouchDownY;
    private int POSITION_CURRENT_STATE = 0; //listView 滑动到顶部还是底部的状态
    private boolean mScrolling;
    private boolean isAdded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.getWindow().clearFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_tabbar);
        LinearLayout rootContent = findViewById(R.id.tabbar_RoorContentView);
        tabbarView = findViewById(R.id.tabbarView);
        linearLayoutRoot = (LinearLayout) findViewById(R.id.tabbar_ContentView);
        mRootView = findViewById(R.id.tabbar_rootView);
        frameLayoutRoot = findViewById(R.id.tabbar_frameLayout);

        //拿到事务管理器并且开启事务
        manager = getSupportFragmentManager();

        if (savedInstanceState != null) {
            //获取"内存重启"时候保存的索引下标
            currentIndex = savedInstanceState.getInt(CURRRNT_FRAGMENT, 0);
            fragments.removeAll(fragments);
            fragments.add(manager.findFragmentByTag(String.valueOf(0)));
            fragments.add(manager.findFragmentByTag(String.valueOf(1)));
            fragments.add(manager.findFragmentByTag(String.valueOf(2)));
            fragments.add(manager.findFragmentByTag(String.valueOf(3)));
            fragments.add(manager.findFragmentByTag(String.valueOf(4)));

            //恢复 fragment页面
            restoreFragment();
        } else {
            fragments.add(new Fragment());
            fragments.add(new Fragment());
            fragments.add(new Fragment());
            showFragment();
        }

        displayConnectionView();
    }

    private void displayConnectionView() {
        if (connectView == null) {
            connectView = new ConnectView(this, tabbarView.getMeasuredHeight(), frameLayoutRoot, mRootView);
            connectView.delegate = this;
            connectView.add.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    addButtonAction();
                }
            });
            Animation loadAnimation = new AlphaAnimation(0.0f, 1.0f);
            loadAnimation.setDuration((long) duration);
            loadAnimation.setFillAfter(true);
            connectView.startAnimation(loadAnimation);
            connectViewParams = ((FrameLayout.LayoutParams) connectView.getLayoutParams()).topMargin;
            int count = connectView.linearLayoutRoot.getChildCount();
            for (int i = 0; i < count; i++) {
                if (connectView.linearLayoutRoot.getChildAt(i) instanceof ListView) {
                    ListView listView = (ListView) connectView.linearLayoutRoot.getChildAt(i);
                    listView.setOnScrollListener(new AbsListView.OnScrollListener() {
                        @Override
                        public void onScrollStateChanged(AbsListView view, int scrollState) {

                        }

                        @Override
                        public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
                            //判断滚动到顶部
                            if (firstVisibleItem == 0) {
                                View firstVisibleItemView = listView.getChildAt(0);
                                if (firstVisibleItemView != null && firstVisibleItemView.getTop() == 0) {
                                    POSITION_CURRENT_STATE = 0;
                                    //判断是否可以滚动
                                    if (listView.getFirstVisiblePosition() == 0 && listView.getCount() == listView.getLastVisiblePosition() + 1) {
                                        POSITION_CURRENT_STATE = 2;
                                    }
                                }
                            } else if ((firstVisibleItem + visibleItemCount) == totalItemCount) { //滚动到底部
                                View lastVisiableItemView = listView.getChildAt(listView.getChildCount() - 1);
                                if (lastVisiableItemView != null && lastVisiableItemView.getBottom() == listView.getHeight()) {
                                    POSITION_CURRENT_STATE = 1;
                                }
                            }
                        }
                    });
                    listView.setOnTouchListener((v, event) -> {
                        if (v instanceof ListView) {
                            switch (event.getAction()) {
                                case MotionEvent.ACTION_DOWN:
                                    mListTouchDownY = event.getRawY();
                                    mScrolling = false;
                                    break;
                                case MotionEvent.ACTION_MOVE:
                                    switch (POSITION_CURRENT_STATE) {
                                        case 0:
                                            //滑到顶部
                                            if (event.getRawY() - mListTouchDownY > 0) {
                                                connectView.setViewPosition((int) (event.getRawY() - mListTouchDownY));
                                                listView.setStackFromBottom(false);
                                                mScrolling = true;
                                            }
                                            break;
                                        case 1:
                                            //滑到底部
                                            if (event.getRawY() - mListTouchDownY < 0) {
                                                connectView.setViewPosition((int) (event.getRawY() - mListTouchDownY));
                                                listView.setOverScrollMode(View.OVER_SCROLL_NEVER);
                                                mScrolling = true;
                                            }
                                            break;
                                        case 2:
                                            //不可滑动
                                            connectView.setViewPosition((int) (event.getRawY() - mListTouchDownY));
                                            mScrolling = false;
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                case MotionEvent.ACTION_UP:
                                    mListTouchDownY = event.getRawY();
                                    connectViewDisappearsAnimation();
                                    mScrolling = false;
                                    break;
                            }
                        }
                        return mScrolling;
                    });
                }
            }
        }
    }

    void addButtonAction() {
        isAdded = true;
        Intent intent = new Intent();
        intent.setClass(TabbarActivity.this, WifiConnectActivity.class);
        startActivity(intent);
    }

    private void rotationAnimation(View centerView) {
        ImageView centerButton = (ImageView) centerView.findViewWithTag("image_" + currentIndex);
        if (centerButton != null) {
            if (rotateAnimation == null) {
                rotateAnimation = new RotateAnimation(0.0f, 360f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
                rotateAnimation.setInterpolator(new LinearInterpolator()); //不停顿
                rotateAnimation.setZAdjustment(Animation.RELATIVE_TO_SELF);
                rotateAnimation.setDuration(3000);
                rotateAnimation.setFillEnabled(false);
                rotateAnimation.setFillAfter(true);
                rotateAnimation.setFillBefore(false);
                rotateAnimation.setRepeatCount(-1);
                centerButton.startAnimation(rotateAnimation);
                isAnimation = true;
            } else if (rotateAnimation != null) {
                if (isAnimation && rotateAnimation.hasStarted()) {
                    pauseAnimation(centerButton);
                } else if (!isAnimation && rotateAnimation.hasEnded()) {
                    centerButton.startAnimation(rotateAnimation);
                    isAnimation = true;
                }
            }
        }
    }

    private void pauseAnimation(View centerView) {
        if (rotateAnimation != null && rotateAnimation.hasStarted()) {
            rotateAnimation.cancel();
            isAnimation = false;
        }
    }

    /**
     * 使用 show、hide切换页面
     */
    private void showFragment() {
        FragmentTransaction transaction = manager.beginTransaction();
        //如果之前没有添加过
        if (currentIndex == 2) {
            linearLayoutRoot.setVisibility(View.VISIBLE);
            transaction.hide(currentFragment).commit();
        } else {
            linearLayoutRoot.setVisibility(View.GONE);
            if (!fragments.get(currentIndex).isAdded()) {
                transaction.hide(currentFragment).add(R.id.tabbar_rootView, fragments.get(currentIndex), String.valueOf(currentIndex));
            } else {
                transaction.hide(currentFragment).show(fragments.get(currentIndex));
            }
            currentFragment = fragments.get(currentIndex);
            transaction.commit();
        }
    }

    /**
     * 恢复 fragment
     */
    private void restoreFragment() {
        FragmentTransaction fragmentTransaction = manager.beginTransaction();
        if (currentIndex != 2) {
            linearLayoutRoot.setVisibility(View.GONE);
            for (int i = 0; i < fragments.size(); i++) {
                if (i == currentIndex && currentIndex != 2) {
                    fragmentTransaction.show(fragments.get(i));
                } else {
                    fragmentTransaction.hide(fragments.get(i));
                }
            }
            fragmentTransaction.commit();
            currentFragment = fragments.get(currentIndex);
        } else {
            linearLayoutRoot.setVisibility(View.VISIBLE);
        }
    }

    /**
     * Disappeared ConnectView
     */
    private void disappearedConnectionView() {
        Animation animation = new AlphaAnimation(1.0f, 0.0f);
        animation.setDuration((long) duration);
        animation.setFillAfter(true);
        animation.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {
                connectView.removeFromSuperview();
                connectView = null;
            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        });
        if (connectView != null) {
            connectView.startAnimation(animation);
        }
        finish();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (isAdded) {
            finish();
        }
    }

    /**
     * 加载数据
     *
     * @return
     */
    private ArrayList<TabbarItemModel> loadData() {
        //加载数据
        ArrayList<TabbarItemModel> tabarData = new ArrayList<TabbarItemModel>();
        TabbarItemModel model1 = new TabbarItemModel();
        model1.isShowTitle = true;
        model1.isShowImage = false;
        model1.titles = "Home";
        model1.selectTitle = "Home";
        tabarData.add(model1);

        TabbarItemModel model2 = new TabbarItemModel();
        model2.isShowTitle = true;
        model2.isShowImage = false;
        model2.titles = "Zappers";
        model2.selectTitle = "Zappers";
        tabarData.add(model2);

        TabbarItemModel model3 = new TabbarItemModel();
        model3.isShowTitle = false;
        model3.isShowImage = true;
        model3.imageID = R.drawable.tabbar_home;
        model3.selectImageID = R.drawable.tabbar_home;
        tabarData.add(model3);

        TabbarItemModel model4 = new TabbarItemModel();
        model4.isShowTitle = true;
        model4.isShowImage = false;
        model4.titles = "Book";
        model4.selectTitle = "Book";
        tabarData.add(model4);

        TabbarItemModel model5 = new TabbarItemModel();
        model5.isShowTitle = true;
        model5.isShowImage = false;
        model5.titles = "Settings";
        model5.selectTitle = "Settings";
        tabarData.add(model5);
        return tabarData;
    }

    @Override
    protected void setStatusBar() {
        StatusBarUtil.setTransparent(this);
    }

    @Override
    public void connectSuccess(Boolean isSave) {
        connectView = null;
        if (!isSave) {
            isAdded = true;
            Intent intent = new Intent();
            intent.setClass(TabbarActivity.this, SoftwareUpdateActivity.class);
            startActivity(intent);
        }
    }

    @Override
    public void connectFail(Error error) {

    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                if (connectView != null) {
                    if (event.getX() >= connectView.getX()
                            && event.getX() <= connectView.getX() + connectView.getConnectView_Width()
                            && event.getY() >= connectView.getY()
                            && event.getY() <= connectView.getY() + connectView.getConnectView_Height()) {
                        beginPoint = event.getY();
                        isInside = true;
                    } else {
                        isInside = false;
                    }
                } else {
                    isInside = false;
                }
                break;
            case MotionEvent.ACTION_MOVE:
                if (isInside == null) {
                    isInside = true;
                }
                if (connectView != null && isInside) {
                    connectView.setViewPosition((int) (event.getY() - beginPoint));
                }
                break;
            case MotionEvent.ACTION_UP:
                isInside = false;
                if (connectView != null) {
                    connectViewDisappearsAnimation();
                }
                break;
        }
        return super.onTouchEvent(event);
    }

    void connectViewDisappearsAnimation() {
        FrameLayout.LayoutParams lp = (FrameLayout.LayoutParams) connectView.getLayoutParams();
        float dy;
        Boolean isRemove;
        if (lp.topMargin - connectViewParams > WindowManager.getScreenHeight(this) / 3) {
            dy = WindowManager.getScreenHeight(this);
            isRemove = true;
            disappearedConnectionView();
        } else {
            dy = (int) connectViewParams;
            isRemove = false;
        }

        ValueAnimator animator = ValueAnimator.ofFloat(lp.topMargin, dy);
        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                if (connectView != null) {
                    connectView.setViewPosition((int) Math.round((Float) animation.getAnimatedValue()));
                }
            }
        });
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.setDuration((long) duration);
        animatorSet.play(animator);
        animatorSet.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                super.onAnimationEnd(animation);
                if (isRemove) {
                    disappearedConnectionView();
                }
            }
        });
        animatorSet.start();
    }

    @Override
    public void onThisClick(int selectTag) {
        currentIndex = selectTag;
        if (selectTag == 2) {
            centerView = tabbarView.linearLayoutRoot.findViewWithTag(selectTag);
            rotationAnimation(centerView);
        } else if (isAnimation && rotateAnimation != null && rotateAnimation.hasStarted()) {
            pauseAnimation(centerView);
        }
        showFragment();
    }

    @Override
    public void onLongClickItem(int selctTag) {
        currentIndex = selctTag;
        if (selctTag == 2) {
            //pop view
            displayConnectionView();
        } else {
            showFragment();
        }
        if (rotateAnimation != null && rotateAnimation.hasStarted()) {
            pauseAnimation(centerView);
        }
    }
}
