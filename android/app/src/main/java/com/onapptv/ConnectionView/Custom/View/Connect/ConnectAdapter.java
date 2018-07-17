package com.onapptv.ConnectionView.Custom.View.Connect;

import android.content.Context;
import android.graphics.Typeface;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.onapptv.ConnectionView.Custom.Model.ConnectModel;
import com.onapptv.ConnectionView.Custom.View.SwitchView;
import com.onapptv.ConnectionView.util.DensityUtil;
import com.onapptv.R;

import java.util.ArrayList;
import java.util.List;

import tv.hi_global.stbapi.Api;


/**
 * File description
 * Created by mac on 2018/5/15.
 */

public class ConnectAdapter extends BaseAdapter {

    private Context mContext;
    public List<ConnectModel> datas = new ArrayList<ConnectModel>();
    public float height_Adapter;
    public ConnectViewSwithchListener listener;

    private LinearLayout connectItem;
    private ImageButton item_button;
    private TextView item_title;
    private SwitchView item_switch;

    public ConnectAdapter(Context context, List<ConnectModel> datas) {
        this.mContext = context;
        this.datas = datas;
    }

    @Override
    public int getCount() {
        return datas.size();
    }

    @Override
    public Object getItem(int position) {
        return datas.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        ConnectViewViewHolder connectViewViewHolder = null;
        if (convertView == null) {
            convertView = getConnectItem();
            connectViewViewHolder = new ConnectViewViewHolder(mContext, convertView);
            connectViewViewHolder.setParentHeight(height_Adapter);
            connectViewViewHolder.item_switch = item_switch;
            connectViewViewHolder.item_title = item_title;
            connectViewViewHolder.item_button = item_button;
            convertView.setTag(connectViewViewHolder);

        } else {
            connectViewViewHolder = (ConnectViewViewHolder) convertView.getTag();
        }

        connectViewViewHolder.setModel(datas.get(position));

        ConnectViewViewHolder finalConnectViewViewHolder = connectViewViewHolder;
        connectViewViewHolder.item_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Api.sharedApi().hIG_IsConnect() && Api.sharedApi().getCurrentSTBInfo().sTBID.equals(finalConnectViewViewHolder.item_title.getText().toString())) {
                    Api.sharedApi().hIG_STBStandby();
                }
            }
        });

        connectViewViewHolder.item_switch.setOnStateChangedListener(new SwitchView.OnStateChangedListener() {
            @Override
            public void toggleToOn(SwitchView view) {
                if (listener != null) {
                    listener.swithchStateChanged(position, true);
                }
            }

            @Override
            public void toggleToOff(SwitchView view) {
                listener.swithchStateChanged(position, false);
            }
        });
        return convertView;
    }


    public LinearLayout getConnectItem() {

        connectItem = new LinearLayout(mContext);
        ListView.LayoutParams connectItemLP = new ListView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        connectItem.setOrientation(LinearLayout.VERTICAL);
        connectItem.setLayoutParams(connectItemLP);

        RelativeLayout root = new RelativeLayout(mContext);
        RelativeLayout.LayoutParams rootLp = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, DensityUtil.dip2px(mContext, 44));
        root.setGravity(Gravity.CENTER_VERTICAL);
        connectItem.addView(root, rootLp);

        item_button = new ImageButton(mContext);
        RelativeLayout.LayoutParams buttonLp = new RelativeLayout.LayoutParams(DensityUtil.dip2px(mContext, 32), ViewGroup.LayoutParams.MATCH_PARENT);
        buttonLp.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
        item_button.setBackgroundColor(mContext.getResources().getColor(R.color.colorClear));
        root.addView(item_button, buttonLp);

        item_title = new TextView(mContext);
        RelativeLayout.LayoutParams titleLp = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.MATCH_PARENT);
        titleLp.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
        titleLp.leftMargin = DensityUtil.dip2px(mContext, 35);
        item_title.setGravity(Gravity.CENTER_VERTICAL);
        item_title.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 15);
        item_title.setTextColor(mContext.getResources().getColor(R.color.colorWhite));
        Typeface typeface = Typeface.createFromAsset(mContext.getAssets(), "fonts/SF-UI-Text-Regular.otf");
        item_title.setTypeface(typeface);

        root.addView(item_title, titleLp);

        item_switch = new SwitchView(mContext);
        RelativeLayout.LayoutParams switchLp = new RelativeLayout.LayoutParams(DensityUtil.dip2px(mContext, 45), ViewGroup.LayoutParams.WRAP_CONTENT);
        switchLp.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        switchLp.addRule(RelativeLayout.CENTER_VERTICAL);
        item_switch.setColor(mContext.getResources().getColor(R.color.selfColorRed), mContext.getResources().getColor(R.color.selfColorRedDark), mContext.getResources().getColor(R.color.colorWhite13), mContext.getResources().getColor(R.color.colorWhite13));
        root.addView(item_switch, switchLp);

        TextView bottom = new TextView(mContext);
        LinearLayout.LayoutParams bottomLP = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, DensityUtil.dip2px(mContext, 1));
        bottom.setBackgroundColor(mContext.getResources().getColor(R.color.colorWhite13));
        connectItem.addView(bottom, bottomLP);

        return connectItem;
    }

    @Override
    public boolean areAllItemsEnabled() {
        return false;
    }

    public void setHeight_Adapter(float height_Adapter) {
        this.height_Adapter = height_Adapter;
    }
}
