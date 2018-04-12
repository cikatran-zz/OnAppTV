package com.onapptv.custombrightcoveplayer;

import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;

import com.bumptech.glide.Glide;
import com.bumptech.glide.GlideBuilder;
import com.bumptech.glide.Registry;
import com.bumptech.glide.annotation.GlideModule;
import com.bumptech.glide.integration.okhttp3.OkHttpUrlLoader;
import com.bumptech.glide.load.DecodeFormat;
import com.bumptech.glide.load.engine.bitmap_recycle.LruBitmapPool;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.module.AppGlideModule;

import java.io.InputStream;

@GlideModule
public final class MyAppGlideModule extends AppGlideModule {

    @Override
    public void applyOptions(@NonNull Context context, @NonNull GlideBuilder builder) {
        super.applyOptions(context, builder);
        long bitmapPoolSizeBytes = 1024 * 1024 * 30; //30mb
        builder.setDecodeFormat(DecodeFormat.PREFER_RGB_565);
        builder.setBitmapPool(new LruBitmapPool(bitmapPoolSizeBytes));
        builder.setLogLevel(Log.DEBUG);
    }

    @Override
    public void registerComponents(@NonNull Context context, @NonNull Glide glide, @NonNull Registry registry) {
        OkHttpUrlLoader.Factory okHttpUrlLoaderFactory = new OkHttpUrlLoader.Factory(MyOkhttpModule.getInstance().getmOkHttpClient());
        registry.append(GlideUrl.class, InputStream.class, okHttpUrlLoaderFactory);
    }

    @Override
    public boolean isManifestParsingEnabled() {
        return false;
    }
}