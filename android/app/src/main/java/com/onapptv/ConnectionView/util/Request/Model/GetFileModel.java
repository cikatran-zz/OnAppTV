package com.onapptv.ConnectionView.util.Request.Model;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class GetFileModel {
    public String fileID;
    public String name;
    public String fileDescription;
    public ArrayList<String> order;
    public ArrayList folders;
    public ArrayList folders_order;
    public long timestamp;
    public String owner;
    public Boolean filePublic;
    public ArrayList events;
    public ArrayList variables;
    public String auth;
    public ArrayList<RequestsModel> requests;

    public static GetFileModel initWithJsonString(String jsonString) {

        GetFileModel model = new GetFileModel();
        try {
            JSONObject jsonInfo = new JSONObject(jsonString);
            model.fileID = jsonInfo.getString("id");
            model.name = jsonInfo.getString("name");
            model.fileDescription = jsonInfo.getString("description");
            JSONArray order = jsonInfo.getJSONArray("order");
            for (int i = 0; i < order.length(); i++) {
                model.getOrder().add(order.getString(i));
            }
            JSONArray folders = jsonInfo.getJSONArray("folders");
            for (int i = 0; i < folders.length(); i++) {
                model.getFolders().add(folders.get(i));
            }
            JSONArray folders_order = jsonInfo.getJSONArray("folders_order");
            for (int i = 0; i < folders_order.length(); i++) {
                model.getFolders_order().add(folders_order.get(i));
            }
            model.timestamp = jsonInfo.getLong("timestamp");
            model.owner = jsonInfo.getString("owner");
            model.filePublic = jsonInfo.getBoolean("public");
            JSONArray events = jsonInfo.getJSONArray("events");
            for (int i = 0; i < events.length(); i++) {
                model.getEvents().add(events.get(i));
            }
            JSONArray variables = jsonInfo.getJSONArray("variables");
            for (int i = 0; i < variables.length(); i++) {
                model.getVariables().add(variables.get(i));
            }
            model.auth = jsonInfo.getString("auth").equals("null") ? null : jsonInfo.getString("auth");
            JSONArray requests = jsonInfo.getJSONArray("requests");
            for (int i = 0; i < requests.length(); i++) {
                RequestsModel requestsModel = RequestsModel.initWithJsonString(requests.getString(i));
                model.getRequests().add(requestsModel);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return model;
    }

    GetFileModel() {
        getOrder();
        getFolders();
        getFolders_order();
        getEvents();
        getVariables();
        getRequests();
    }

    public ArrayList<String> getOrder() {
        if (order == null) {
            order = new ArrayList();
        }
        return order;
    }

    public ArrayList getFolders() {
        if (folders == null) {
            folders = new ArrayList();
        }
        return folders;
    }

    public ArrayList getFolders_order() {
        if (folders_order == null) {
            folders_order = new ArrayList();
        }
        return folders_order;
    }

    public ArrayList getEvents() {
        if (events == null) {
            events = new ArrayList();
        }
        return events;
    }

    public ArrayList getVariables() {
        if (variables == null) {
            variables = new ArrayList();
        }
        return variables;
    }

    public ArrayList<RequestsModel> getRequests() {
        if (requests == null) {
            requests = new ArrayList();
        }
        return requests;
    }
}
