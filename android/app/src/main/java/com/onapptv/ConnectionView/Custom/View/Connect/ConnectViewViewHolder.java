package com.onapptv.ConnectionView.Custom.View.Connect;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.ImageButton;
import android.widget.TextView;

import com.onapptv.ConnectionView.Custom.Model.ConnectModel;
import com.onapptv.ConnectionView.Custom.View.SwitchView;
import com.onapptv.R;


/**
 * File description
 * Created by mac on 2018/5/15.
 */

public class ConnectViewViewHolder {

    private Context mContext;
    public TextView item_title;
    public SwitchView item_switch;
    public ImageButton item_button;
    public float parentHeight;
    public ConnectModel model;

    public ConnectViewViewHolder(Context context, View itemView) {
        this.mContext = context;
        int itemHeight = (int) (44.0 / 490.0 * parentHeight);
        AbsListView.LayoutParams params = new AbsListView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, itemHeight);
        itemView.setLayoutParams(params);
    }

    public void setModel(ConnectModel model) {
        this.model = model;
        if (model.name != null) {
            item_title.setText(model.name);
        } else {
            item_title.setText(" ");
        }

        if (model.isOnline) {
            item_button.setImageDrawable(mContext.getResources().getDrawable(R.drawable.connectview_dot_green));
            item_switch.setVisibility(View.VISIBLE);
            item_title.setAlpha(1);
        } else {
            item_button.setImageDrawable(mContext.getResources().getDrawable(R.drawable.connectview_dot_gray));
            item_switch.setVisibility(View.INVISIBLE);
            item_title.setAlpha(0.56f);
        }
        item_switch.setOpened(model.isSelect);
    }

    public void setParentHeight(float parentHeight) {
        this.parentHeight = parentHeight;
    }
}
