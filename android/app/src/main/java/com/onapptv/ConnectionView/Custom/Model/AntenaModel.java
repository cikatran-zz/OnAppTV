package com.onapptv.ConnectionView.Custom.Model;

import com.onapptv.ConnectionView.Custom.View.Antena.AntenaArrayType;

import java.util.List;

import tv.hi_global.stbapi.Model.DatabaseTransponderModel;

public class AntenaModel {
    //    Title Name
    public String title;
    //    Array Type
    public AntenaArrayType arrayType;
    //    Sigle Array
    public String[] sigleArray;
    //    Transponder Array
    public List<DatabaseTransponderModel> transponderArray;
    //    Mixture Array 1
    public String[] mixtureArray1;
    //    Mixture Array 2
    public String[] mixtureArray2;
    //    Index
    public int index;
}
