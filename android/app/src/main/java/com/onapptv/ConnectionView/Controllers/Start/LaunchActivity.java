package com.onapptv.ConnectionView.Controllers.Start;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

import com.onapptv.ConnectionView.Controllers.TabbarActivity;
import com.onapptv.R;

import tv.hi_global.stbapi.Api;

public class LaunchActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_launch);

        TextView on = findViewById(R.id.ontv_on);
        Typeface typeface = Typeface.createFromAsset(getAssets(), "fonts/HelveticaNeue-Bold.otf");
        on.setTypeface(typeface);

        TextView stb = findViewById(R.id.ontv_stb);
        typeface = Typeface.createFromAsset(getAssets(), "fonts/helveticaneue-regular.ttf");
        stb.setTypeface(typeface);

        SharedPreferences setting = getSharedPreferences("ONTVApp", MODE_PRIVATE);

        Api.sharedApi().hIG_setContext(LaunchActivity.this);

        Boolean isStarted = setting.getBoolean("isStarted", true);
        final Intent intent = new Intent();
        if (isStarted) {
            setting.edit().putBoolean("isStarted", false).commit();
            intent.setClass(LaunchActivity.this, SoftwareUpdateActivity.class);
            intent.putExtra("isFirst", true);

        } else {
            intent.setClass(LaunchActivity.this, TabbarActivity.class);
        }
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                startActivity(intent);
                finish();
            }
        }, 1000);
    }
}
