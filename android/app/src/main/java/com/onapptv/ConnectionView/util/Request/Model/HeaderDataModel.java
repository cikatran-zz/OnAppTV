package com.onapptv.ConnectionView.util.Request.Model;

import org.json.JSONException;
import org.json.JSONObject;

public class HeaderDataModel {
    public String key;
    public String value;
    public String headerDataDescription;
    public Boolean enabled;

    public static HeaderDataModel initWithJsonString(String jsonString) {

        HeaderDataModel model = new HeaderDataModel();
        try {
            JSONObject jsonInfo = new JSONObject(jsonString);
            model.key = jsonInfo.getString("key");
            model.value = jsonInfo.getString("value");
            model.headerDataDescription = jsonInfo.getString("description");
            model.enabled = jsonInfo.getBoolean("enabled");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return model;
    }
}
