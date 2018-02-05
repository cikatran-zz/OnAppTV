package com.onapptv;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.github.mmin18.widget.RealtimeBlurView;

/**
 * Created by Cika on 2/2/18.
 */

public class ReactBlurViewManager extends SimpleViewManager<RealtimeBlurView> {
  public static final String REACT_CLASS = "RCTBlurView";
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected RealtimeBlurView createViewInstance(ThemedReactContext reactContext) {
    return new RealtimeBlurView(reactContext, null);
  }

  @ReactProp(name = "blurRadius", defaultFloat = 0f)
  public void setBlurRadius(RealtimeBlurView view, float blurRadius) {
    view.setBlurRadius(blurRadius);
  }

  @ReactProp(name = "overlayColor", defaultInt = 0)
  public void setOverlayColor(RealtimeBlurView view, int color) {
    view.setOverlayColor(color);
  }
}
