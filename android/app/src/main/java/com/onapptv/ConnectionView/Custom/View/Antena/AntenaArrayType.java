package com.onapptv.ConnectionView.Custom.View.Antena;

public enum AntenaArrayType {
    AntenaArrayType_none(0),
    AntenaArrayType_single(1),
    AntenaArrayType_transponder(2),
    AntenaArrayType_mixture(3);

    private int value;


    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    AntenaArrayType(int value) {
        this.value = value;
    }

    public static AntenaArrayType getType(int value) {
        for (AntenaArrayType antenaArrayType : AntenaArrayType.values()) {
            if (antenaArrayType.getValue() == value) {
                return antenaArrayType;
            }
        }
        return null;
    }
}
