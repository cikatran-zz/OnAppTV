package com.onapptv.ConnectionView.Custom.View.Connect;

public interface ConnectViewDelegate {

    void connectSuccess(Boolean isSave);

    void connectFail(Error error);
}
