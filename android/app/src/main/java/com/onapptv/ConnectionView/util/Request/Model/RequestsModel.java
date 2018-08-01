package com.onapptv.ConnectionView.util.Request.Model;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class RequestsModel {
    public String requestsID;
    public String headers;
    public ArrayList<HeaderDataModel> headerData;
    public String url;
    public ArrayList queryParams;
    public ArrayList pathVariables;
    public ArrayList pathVariableData;
    public ArrayList events;
    public String auth;
    public String method;
    public String collectionId;
    public ArrayList data;
    public String dataMode;
    public String name;
    public String requestsDescription;
    public String descriptionFormat;
    public long time;
    public int version;
    public ArrayList responses;
    public String currentHelper;
    public String helperAttributes;
    public String rawModeData;

    public static RequestsModel initWithJsonString(String jsonString) {

        RequestsModel model = new RequestsModel();
        try {
            JSONObject jsonInfo = new JSONObject(jsonString);
            model.requestsID = jsonInfo.getString("id");
            model.headers = jsonInfo.getString("headers");
            JSONArray headerData = jsonInfo.getJSONArray("headerData");
            for (int i = 0; i < headerData.length(); i++) {
                HeaderDataModel headerDataModel = HeaderDataModel.initWithJsonString(headerData.getString(i));
                model.getHeaderData().add(headerDataModel);
            }
            model.url = jsonInfo.getString("url");
            JSONArray queryParams = jsonInfo.getJSONArray("queryParams");
            for (int i = 0; i < queryParams.length(); i++) {
                model.getQueryParams().add(queryParams.get(i));
            }
            JSONArray pathVariables = jsonInfo.getJSONArray("pathVariables");
            for (int i = 0; i < pathVariables.length(); i++) {
                model.getPathVariables().add(pathVariables.get(i));
            }
            JSONArray pathVariableData = jsonInfo.getJSONArray("pathVariableData");
            for (int i = 0; i < pathVariableData.length(); i++) {
                model.getPathVariableData().add(pathVariableData.get(i));
            }
            JSONArray events = jsonInfo.getJSONArray("events");
            for (int i = 0; i < events.length(); i++) {
                model.getEvents().add(events.get(i));
            }
            model.auth = jsonInfo.getString("auth").equals("null") ? null : jsonInfo.getString("auth");
            model.method = jsonInfo.getString("method");
            model.collectionId = jsonInfo.getString("collectionId");
            JSONArray data = jsonInfo.getJSONArray("data");
            for (int i = 0; i < data.length(); i++) {
                model.getData().add(data.get(i));
            }
            model.dataMode = jsonInfo.getString("dataMode");
            model.name = jsonInfo.getString("name");
            model.requestsDescription = jsonInfo.getString("description");
            model.descriptionFormat = jsonInfo.getString("descriptionFormat");
            model.time = jsonInfo.getLong("time");
            model.version = jsonInfo.getInt("version");
            JSONArray responses = jsonInfo.getJSONArray("responses");
            for (int i = 0; i < responses.length(); i++) {
                model.getResponses().add(responses.get(i));
            }
            model.currentHelper = jsonInfo.getString("currentHelper").equals("null") ? null : jsonInfo.getString("currentHelper");
            model.helperAttributes = jsonInfo.getString("helperAttributes").equals("null") ? null : jsonInfo.getString("helperAttributes");
            model.rawModeData = jsonInfo.getString("rawModeData");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return model;
    }

    RequestsModel() {
        getHeaderData();
        getQueryParams();
        getPathVariables();
        getPathVariableData();
        getEvents();
        getData();
        getResponses();
    }

    public ArrayList<HeaderDataModel> getHeaderData() {
        if (headerData == null) {
            headerData = new ArrayList<>();
        }
        return headerData;
    }

    public ArrayList getQueryParams() {
        if (queryParams == null) {
            queryParams = new ArrayList();
        }
        return queryParams;
    }

    public ArrayList getPathVariables() {
        if (pathVariableData == null) {
            pathVariables = new ArrayList();
        }
        return pathVariables;
    }

    public ArrayList getPathVariableData() {
        if (pathVariableData == null) {
            pathVariableData = new ArrayList();
        }
        return pathVariableData;
    }

    public ArrayList getEvents() {
        if (events == null) {
            events = new ArrayList();
        }
        return events;
    }

    public ArrayList getData() {
        if (data == null) {
            data = new ArrayList();
        }
        return data;
    }

    public ArrayList getResponses() {
        if (responses == null) {
            responses = new ArrayList();
        }
        return responses;
    }
}
