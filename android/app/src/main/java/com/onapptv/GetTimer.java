package com.onapptv;

import android.os.AsyncTask;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.Log;

import java.lang.ref.WeakReference;

import tv.hi_global.stbapi.Api;

public class GetTimer extends AsyncTask<Void, Integer, Boolean> {
    Boolean isEnd = false;
    WeakReference<FragmentControlPage> mFragment;

    public GetTimer(FragmentControlPage fragment) {
        mFragment = new WeakReference<>(fragment);
    }

    @Override
    protected Boolean doInBackground(Void... voids) {
        if (!isCancelled()) {
            while (!isEnd) {
                Api.sharedApi().hIG_PlayMediaGetPosition((b, i) -> {
                    if (!b){
                        isEnd = true;
                    }
                    publishProgress(i);
                });
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
        return isEnd;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onProgressUpdate(Integer... values) {
        super.onProgressUpdate(values);
        Log.v("onProgressUpdate", String.valueOf(values[0]));
        mFragment.get().setProgress(values[0]);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onPostExecute(Boolean aBoolean) {
        super.onPostExecute(aBoolean);
        ((ControlActivity )mFragment.get().activity).nextPage();
    }
}
