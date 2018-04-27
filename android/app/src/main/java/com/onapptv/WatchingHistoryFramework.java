package com.onapptv;

import android.annotation.SuppressLint;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.gson.Gson;
import com.onapptv.custombrightcoveplayer.WatchingHistory;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;
import userkit.sdk.UserKit;
import userkit.sdk.model.QueryCommand;
import userkit.sdk.model.RemoveQueryCommand;

/**
 * Created by henry on 4/27/18.
 */

@SuppressLint("CheckResult")
public class WatchingHistoryFramework extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNWatchingHistory";
    Gson gson = new Gson();

    private static String ID = "id";
    private static String STOP_POSITION = "stop_position";
    private static String VIDEO_LENGTH = "video_length";
    private static String CONTINUE_WATCHING = "continue_watching";

    public WatchingHistoryFramework(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void remove(String id, Callback callback) {
        WatchingHistory.remove(id)
                .doOnComplete(() -> {
                    callback.invoke(null, null);
                }).doOnError(throwable -> {
            callback.invoke(gson.toJson(throwable), null);
        });
    }

    @ReactMethod
    public void getConsumedLength(String id, Callback callback) {
        UserKit.getInstance().getProfileManager().searchChildInArray(CONTINUE_WATCHING,
                QueryCommand.eq(ID, id),
                JSONObject.class).map(data -> {
            if (data.size() > 0)
                return (int) ((Map) data.get(0)).get(STOP_POSITION);

            else
                return 0;
        }).subscribe(length -> {
            callback.invoke(null, length);
        }, throwable -> {
            callback.invoke(gson.toJson(throwable), null);
        });
    }

    @ReactMethod
    public void updateWatchingHistory(String id, ReadableMap properties, Callback callback) {
        HashMap props = properties.toHashMap();
        if (props.containsKey(STOP_POSITION) && props.containsKey(ID) && props.containsKey(VIDEO_LENGTH)) {
            UserKit.getInstance().getProfileManager().removeChildInArray(CONTINUE_WATCHING, RemoveQueryCommand.eq(ID, id))
                    .doOnComplete(() -> {
                        UserKit.getInstance().getProfileManager().append(CONTINUE_WATCHING, props);
                        callback.invoke(null, gson.toJson(props));
                    }).doOnError(error -> {
                callback.invoke(null, null);
            });
        }
    }

    @ReactMethod
    public void getWatchingHistory(String id, Callback callback) {
        UserKit.getInstance().getProfileManager().searchChildInArray(CONTINUE_WATCHING,
                QueryCommand.eq(ID, id),
                JSONObject.class).map(data -> {
            if (data.size() > 0)
                return ((Map) data.get(0));
            else
                return new HashMap();
        }).subscribe(map -> {
            callback.invoke(null, gson.toJson(map));
        }, throwable -> {
            callback.invoke(gson.toJson(throwable), null);
        });
    }


}
