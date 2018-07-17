package com.onapptv.ConnectionView.Custom.View.Antena;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.BaseAdapter;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.onapptv.ConnectionView.Custom.Model.AntenaModel;
import com.onapptv.ConnectionView.util.DensityUtil;
import com.onapptv.ConnectionView.util.WindowManager;
import com.onapptv.R;

import java.util.List;

public class AntenaAdapter extends BaseAdapter {

    public int rowHeight;
    public List<AntenaModel> dataSource;
    public AntenaButtonDelegate delegate;

    private Context mContext;
    private RelativeLayout antenaItem;
    private TextView title;
    private TextView content;
    private ImageButton leftButton;
    private ImageButton rightButton;

    public AntenaAdapter(Context context) {
        mContext = context;
    }


    public AntenaAdapter(Context context, List<AntenaModel> datas) {
        mContext = context;
        dataSource = datas;
    }

    @Override
    public int getCount() {
        return dataSource != null ? dataSource.size() : 0;
    }

    @Override
    public Object getItem(int position) {
        return dataSource.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder = null;
        if (convertView == null) {
            viewHolder = new ViewHolder();
            convertView = getAntenaItem();
            viewHolder.content = content;
            viewHolder.title = title;
            viewHolder.leftButton = leftButton;
            viewHolder.rightButton = rightButton;

            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }
        viewHolder.setModel(dataSource.get(position));
        viewHolder.leftButton.setTag(position * 10 + 1);
        viewHolder.leftButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (delegate != null) {
                    delegate.onClick((ImageButton) v);
                }
            }
        });

        viewHolder.rightButton.setTag(position * 10 + 2);
        viewHolder.rightButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                buttonAction((ImageButton) v);
                if (delegate != null) {
                    delegate.onClick((ImageButton) v);
                }
            }
        });
        return convertView;
    }

    public RelativeLayout getAntenaItem() {
        setItemUI();
        return antenaItem;
    }

    void setItemUI() {
        antenaItem = new RelativeLayout(mContext);
        int antenaView_width = (int) (WindowManager.getScreenWidth(mContext) * (282.0 / 375.0));
        int antenaView_height = (int) (antenaView_width / (282.0 / 396.0));
        int listView_height = (int) (antenaView_height * 44 * 5 / 396.0);
        if (rowHeight == 0) {
            rowHeight = listView_height / 5;
        }
        ListView.LayoutParams antenaItemLp = new ListView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, rowHeight);
        antenaItem.setLayoutParams(antenaItemLp);
//        Bottom Line
        View bottomLine = new View(mContext);
        bottomLine.setBackgroundColor(mContext.getResources().getColor(R.color.colorWhite07));
        int bottomLine_width = (int) (antenaView_width * (282.0 - 23.0 * 2) / 282.0);
        int bottomLine_height = DensityUtil.dip2px(mContext, 1);
        RelativeLayout.LayoutParams bottomLineLp = new RelativeLayout.LayoutParams(bottomLine_width, bottomLine_height);
        bottomLineLp.addRule(RelativeLayout.CENTER_HORIZONTAL);
        bottomLineLp.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        antenaItem.addView(bottomLine, bottomLineLp);
//        Left Button
        leftButton = new ImageButton(mContext);
        leftButton.setImageDrawable(mContext.getResources().getDrawable(R.drawable.left_arrow));
        leftButton.setBackgroundColor(mContext.getResources().getColor(R.color.colorClear));
        int leftButton_width = (int) (antenaView_width * 16.05 / 282.0);
        int leftButton_height = rowHeight;
        RelativeLayout.LayoutParams leftButtonLp = new RelativeLayout.LayoutParams(leftButton_width, leftButton_height);
        leftButtonLp.addRule(RelativeLayout.CENTER_VERTICAL);
        leftButtonLp.leftMargin = (int) (antenaView_width * 130.77 / 282);
        antenaItem.addView(leftButton, leftButtonLp);
//        Right Button
        rightButton = new ImageButton(mContext);
        rightButton.setImageDrawable(mContext.getResources().getDrawable(R.drawable.right_arrow));
        rightButton.setBackgroundColor(mContext.getResources().getColor(R.color.colorClear));
        RelativeLayout.LayoutParams rightButtonLp = new RelativeLayout.LayoutParams(leftButton_width, leftButton_height);
        rightButtonLp.addRule(RelativeLayout.CENTER_VERTICAL);
        rightButtonLp.leftMargin = (int) (antenaView_width * 240.77 / 282);
        antenaItem.addView(rightButton, rightButtonLp);
//        Title
        title = new TextView(mContext);
        Typeface typeface = Typeface.createFromAsset(mContext.getAssets(), "fonts/SF-UI-Text-Regular.otf");
        title.setTypeface(typeface);
        title.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 15);
        title.setTextColor(Color.WHITE);
        RelativeLayout.LayoutParams titleLp = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        titleLp.addRule(RelativeLayout.CENTER_VERTICAL);
        titleLp.leftMargin = (int) (antenaView_width * 23.0 / 282.0);
        antenaItem.addView(title, titleLp);
//        Content
        content = new TextView(mContext);
        content.setTypeface(typeface);
        content.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 13);
        content.setTextColor(Color.WHITE);
        int content_width = rightButtonLp.leftMargin - leftButtonLp.leftMargin - leftButtonLp.width;
        RelativeLayout.LayoutParams contentLp = new RelativeLayout.LayoutParams(content_width, ViewGroup.LayoutParams.WRAP_CONTENT);
        contentLp.addRule(RelativeLayout.CENTER_VERTICAL);
        contentLp.leftMargin = leftButtonLp.leftMargin + leftButtonLp.width;
        content.setGravity(Gravity.CENTER);
        antenaItem.addView(content, contentLp);
    }

    static class ViewHolder {
        TextView title;
        TextView content;
        ImageButton leftButton;
        ImageButton rightButton;

        AntenaModel model;

        public void setModel(AntenaModel model) {
            this.model = model;

            title.setText(model.title);
            switch (model.arrayType) {
                case AntenaArrayType_none:
                    content.setText("");
                    break;
                case AntenaArrayType_single:
                    content.setText(model.sigleArray[model.index]);
                    break;
                case AntenaArrayType_transponder:
                    if (model.transponderArray != null) {
                        content.setText(model.transponderArray.get(model.index).frequency + "/" + model.transponderArray.get(model.index).symbolRate);
                    } else {
                        content.setText("0/0");
                    }
                    break;
                case AntenaArrayType_mixture:
                    int mix1 = model.index / model.mixtureArray2.length;
                    int mix2 = model.index % model.mixtureArray2.length;
                    content.setText(model.mixtureArray1[mix1] + "/" + model.mixtureArray2[mix2]);
                    break;
            }
        }
    }

}
