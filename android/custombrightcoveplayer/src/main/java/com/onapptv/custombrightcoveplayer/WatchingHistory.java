package com.onapptv.custombrightcoveplayer;

import android.util.Log;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import io.reactivex.Completable;
import io.reactivex.Observable;
import userkit.sdk.UserKit;
import userkit.sdk.model.RemoveQueryCommand;

/**
 * Created by henry on 4/27/18.
 */
public class WatchingHistory {

    private static final String TAG = "WatchingHistory";

    private static String CONTINUE_WATCHING = "continue_watching";
    private static String STOP_POSITION = "stop_position";
    private static String ID = "id";

    public static Completable remove(String id) {
        return UserKit.getInstance().getProfileManager().removeChildInArray(CONTINUE_WATCHING, RemoveQueryCommand.eq(ID, id))
                .doOnComplete(() -> {
                })
                .doOnError(error -> Log.d(TAG, error.toString()));
    }

    public static Completable storeVideo(String id, Map metadata, double videoLength, double currentSeconds) {
        if (currentSeconds < videoLength - 30) {
            return UserKit.getInstance().getProfileManager().removeChildInArray(CONTINUE_WATCHING, RemoveQueryCommand.eq(ID, id))
                    .doOnComplete(() -> {
                        HashMap<String, Object> movieJson = new HashMap<>();
                        movieJson.put(STOP_POSITION, currentSeconds);
                        movieJson.put(ID, id);
                        movieJson.putAll(metadata);
                        UserKit.getInstance().getProfileManager().append(CONTINUE_WATCHING, movieJson);
                    }).doOnError(error -> Log.d(TAG, error.toString()));
        } else {
            return UserKit.getInstance().getProfileManager().removeChildInArray(CONTINUE_WATCHING, RemoveQueryCommand.eq(ID, id))
                    .doOnComplete(() -> {
                    })
                    .doOnError(error -> Log.d(TAG, error.toString()));
        }
    }

    public static Observable<Integer> getWatchingHistory(String id) {
        return UserKit.getInstance().getProfileManager().searchChildInArray(CONTINUE_WATCHING,
                RemoveQueryCommand.eq(ID, id),
                JSONObject.class).map(data -> {
            if (data.size() > 0)
                return (int) ((Map) data.get(0)).get(STOP_POSITION);
            else
                return 0;
        });
    }
}
