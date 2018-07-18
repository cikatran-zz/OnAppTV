package com.onapptv.ConnectionView.Controllers;

import android.database.ContentObserver;
import android.os.Handler;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;

import com.onapptv.ConnectionView.util.StatusBarUtil;
import com.onapptv.R;

public class BaseActivity extends AppCompatActivity {

    public int virtual_height;

    @Override
    public void setContentView(int layoutResID) {
        super.setContentView(layoutResID);
        setStatusBar();

        detectVirtualButton();
        getContentResolver().registerContentObserver(Settings.System.getUriFor
                ("navigationbar_is_min"), true, mNavigationStatusObserver);
    }

    private ContentObserver mNavigationStatusObserver = new ContentObserver(new Handler()) {
        @Override
        public void onChange(boolean selfChange) {

            detectVirtualButton();
        }
    };

    protected void setStatusBar() {
        StatusBarUtil.setColor(this, getResources().getColor(R.color.colorPrimary));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
        }
        return super.onOptionsItemSelected(item);
    }

    private void detectVirtualButton() {

        int isExist = Settings.System.getInt(getContentResolver(),
                "navigationbar_is_min", 0);
        if (isExist == 0) {
            int resourceId = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
            virtual_height = getResources().getDimensionPixelSize(resourceId);

            virtualKeyDisplay();
        } else {
            virtualKeyHidden();
        }
    }

    public void virtualKeyDisplay() {
    }

    public void virtualKeyHidden() {
    }

}
