package com.onapptv.android_control_page;

import android.app.Dialog;
import android.app.DialogFragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ImageButton;
import android.widget.TextView;

import com.onapptv.android_stb_connect.R;

import jp.wasabeef.blurry.Blurry;

public class OTVDialog extends DialogFragment {

    public static OTVDialog shareInstance(String message) {
        OTVDialog otvDialog = new OTVDialog();
        Bundle args = new Bundle();
        args.putString("message", message);
        otvDialog.setArguments(args);
        return otvDialog;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout to use as dialog or embedded fragment
        View rootView = inflater.inflate(R.layout.stb_dialog, container, false);
        Blurry.with(getActivity()).radius(25).sampling(2).onto((ViewGroup) rootView);
        TextView errorText = rootView.findViewById(R.id.error_txt);
        String message = getArguments().getString("message");
        errorText.setText(message);
        ImageButton closeBtn = rootView.findViewById(R.id.close_button);
        closeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }
        });
        return rootView;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        Dialog dialog = super.onCreateDialog(savedInstanceState);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        return dialog;
    }
}
