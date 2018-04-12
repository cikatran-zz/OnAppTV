package com.onapptv.custombrightcoveplayer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import userkit.sdk.SpecificRequiredItem;

/**
 * Created by henry on 4/10/18.
 */
public class TrackUserkit {
    public static SpecificRequiredItem createItemFromBrightcove(Map<String, Object> metadata) {

        String contentId = "";
        if (metadata.get("contentId") != null) {
            contentId = metadata.get("contentId").toString();
        }

        String showTitle = "";
        if (metadata.get("title") != null) {
            showTitle = metadata.get("title").toString();
        }

        String type = "standalone";
        if (metadata.get("type") != null) {
            type = metadata.get("type").toString().toLowerCase();
        }
        List<String> genres = new ArrayList<>();
        if (metadata.get("genres") != null) {
            genres = (List) metadata.get("genres");
        }
        switch (type) {
            case "episode_season": {
                int seasonNumber = -1;
                if (metadata.get("seasonIndex") != null) {
                    seasonNumber = (int) metadata.get("seasonIndex");
                }
                int episodeNumber = -1;
                if (metadata.get("episodeIndex") != null) {
                    episodeNumber = (int) metadata.get("episodeIndex");
                }

                String episodeTitle = showTitle;
                if (metadata.get("episodeTitle") != null) {
                    episodeTitle = (metadata.get("episodeTitle")).toString();
                }
                return SpecificRequiredItem.ofEpisodeSeason(contentId, genres, showTitle, seasonNumber, episodeNumber, episodeTitle);
            }
            case "episode_non_season": {
                int episodeNumber = -1;
                if (metadata.get("episodeIndex") != null) {
                    episodeNumber = (int) metadata.get("episodeIndex");
                }

                String episodeTitle = showTitle;
                if (metadata.get("episodeTitle") != null) {
                    episodeTitle = (metadata.get("episodeTitle")).toString();
                }
                return SpecificRequiredItem.ofEpisodeNonSeason(contentId, genres, showTitle, episodeNumber, episodeTitle);
            }
            case "series": {
                return SpecificRequiredItem.ofSeries(contentId, genres, showTitle);
            }
            default: {
                return SpecificRequiredItem.ofStandalone(contentId, genres, showTitle);
            }
        }
    }
}
