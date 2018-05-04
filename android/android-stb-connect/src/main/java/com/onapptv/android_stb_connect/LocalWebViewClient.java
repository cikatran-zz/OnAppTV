package com.onapptv.android_stb_connect;

import android.graphics.Bitmap;
import android.util.Log;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.webkit.WebView;
import android.widget.ImageView;

import com.github.lzyzsd.jsbridge.BridgeWebView;
import com.github.lzyzsd.jsbridge.BridgeWebViewClient;

/**
 * Created by oldmen on 5/4/18.
 */

public class LocalWebViewClient extends BridgeWebViewClient {
    public LocalWebViewClient(BridgeWebView webView) {
        super(webView);
    }

    private ImageView imageView;

    public LocalWebViewClient(BridgeWebView webView, ImageView imageView) {
        super(webView);
        this.imageView = imageView;
    }

    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
        startLaunchView();
    }



    @Override
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        stopLaunchView(url);
    }



    private void startLaunchView() {
        Log.v("startLaunchView", "Start");
    }
    private void stopLaunchView(String url) {
        Log.v("stopLaunchView", "Stop");
        //首先判断 url 是第一次加载
        if(url.endsWith("#")){
            imageView.setVisibility(View.GONE);
        } else {
            if(imageView.getAlpha() == 1.0){
                AlphaAnimation alphaAnimation = new AlphaAnimation(1.0f, 0.0f);
                alphaAnimation.setFillAfter(true);
                alphaAnimation.setDuration(800);
                imageView.startAnimation(alphaAnimation);
                alphaAnimation.setAnimationListener(new Animation.AnimationListener() {
                    @Override
                    public void onAnimationStart(Animation animation) {

                    }

                    @Override
                    public void onAnimationEnd(Animation animation) {
                        imageView.setVisibility(View.GONE);
                    }


                    @Override
                    public void onAnimationRepeat(Animation animation) {

                    }
                });
            }
        }
    }
}
