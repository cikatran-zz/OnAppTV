package com.onapptv;

import java.io.Serializable;

public class SingletonDataTransaction {
    private static SingletonDataTransaction mInstance = null;
    private Serializable mArr;

    private SingletonDataTransaction() {}
    public static SingletonDataTransaction getInstance() {
        if (mInstance == null)
            mInstance = new SingletonDataTransaction();
        return mInstance;
    }

    public void setDataSerialize(Serializable arrAsSerialize) {
        mArr = arrAsSerialize;
    }

    public Serializable getDataSerialize() {
        return mArr;
    }

}
