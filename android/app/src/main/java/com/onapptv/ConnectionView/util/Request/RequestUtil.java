package com.onapptv.ConnectionView.util.Request;

import android.util.Log;

import com.onapptv.ConnectionView.util.Request.Model.HeaderDataModel;
import com.onapptv.ConnectionView.util.Request.Model.RequestsModel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.cert.CertificateException;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.X509TrustManager;

public class RequestUtil {
    static String address = "https://www.getpostman.com/collections/4a4f812337898c2a3f7d";
    static String POST_URL = "http://contentkit-prod.ap-southeast-1.elasticbeanstalk.com/graphql";
    static String POST_AUTHORIZATION = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiI1YWRlZWJkMTVmNGEwNTAwMWU5Nzg5ZDQiLCJpYXQiOjE1MjQ1NTg4MDF9.pOyAXvsRaN3dj_dU5luKjgNyULnN6pNlpBnxGcHax0M";

    public static void hIG_GetRequest(CompletionHandler completionHandler) {
        try {
            URL url = new URL(address);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setReadTimeout(5 * 1000);
//            判断是否是Https请求
            if (connection instanceof HttpsURLConnection) {
                ((HttpsURLConnection) connection).setSSLSocketFactory(new SSL(trustAllCert));
            }
            String result = null;
            Boolean isSuccess;
            if (connection.getResponseCode() == 200) {
                result = streamToString(connection.getInputStream());
                isSuccess = true;
            } else {
                result = "Error:" + connection.getResponseCode();
                isSuccess = false;
            }
            if (completionHandler != null) {
                completionHandler.Callback(isSuccess, result);
            }
        } catch (MalformedURLException e) {
//            e.printStackTrace();
            if (completionHandler != null) {
                completionHandler.Callback(false, e.toString());
            }
        } catch (IOException e) {
//            e.printStackTrace();
            if (completionHandler != null) {
                completionHandler.Callback(false, e.toString());
            }
        }
    }

    public static void hIG_PostRequest(RequestsModel model, CompletionHandler completionHandler) {
        String bodyData = "";
        if (model.dataMode.equals("raw")) {
            bodyData = model.rawModeData;
        }
        try {
            URL url = new URL(model.url);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(5 * 1000);
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Length", String.valueOf(bodyData.length()));
            for (HeaderDataModel header : model.headerData) {
                if (header.enabled) {
                    connection.setRequestProperty(header.key, header.value);
                }
            }
            OutputStream os = connection.getOutputStream();
            os.write(bodyData.getBytes());

            String result = null;
            Boolean isSuccess;
            if (connection.getResponseCode() == 200) {
                result = streamToString(connection.getInputStream());
                isSuccess = true;
            } else {
                result = "Error:" + connection.getResponseCode();
                isSuccess = false;
            }
            if (completionHandler != null) {
                completionHandler.Callback(isSuccess, result);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            if (completionHandler != null) {
                completionHandler.Callback(false, e.toString());
            }
        } catch (IOException e) {
            e.printStackTrace();
            if (completionHandler != null) {
                completionHandler.Callback(false, e.toString());
            }
        }
    }

    public static void hIG_PostRequest(String bodyString, CompletionHandler completionHandler) {
        String bodyData = bodyString;
        try {
            URL url = new URL(POST_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(5000);
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Length", String.valueOf(bodyData.length()));
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", POST_AUTHORIZATION);

            OutputStream os = connection.getOutputStream();
            os.write(bodyData.getBytes());

            String result = null;
            Boolean isSuccess;
            if (connection.getResponseCode() == 200) {
                result = streamToString(connection.getInputStream());
                isSuccess = true;
            } else {
                result = "Error:" + connection.getResponseCode();
                isSuccess = false;
            }
            if (completionHandler != null) {
                completionHandler.Callback(isSuccess, result);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            if (completionHandler != null) {
                completionHandler.Callback(false, e.toString());
            }
        } catch (IOException e) {
            e.printStackTrace();
            if (completionHandler != null) {
                completionHandler.Callback(false, e.toString());
            }
        }
    }

    private static String streamToString(InputStream is) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int len = 0;
            while ((len = is.read(buffer)) != -1) {
                baos.write(buffer, 0, len);
            }
            baos.close();
            is.close();
            byte[] byteArray = baos.toByteArray();
            return new String(byteArray);
        } catch (Exception e) {
            Log.e("asd", e.toString());
            return null;
        }
    }

    private static final X509TrustManager trustAllCert = new X509TrustManager() {
        @Override
        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
        }

        @Override
        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
        }

        @Override
        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
            return new java.security.cert.X509Certificate[]{};
        }
    };

    public interface CompletionHandler {
        void Callback(Boolean isSuccess, String string);
    }
}
