package com.onapptv.ConnectionView.Custom.View.Blur;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import android.util.AttributeSet;
import android.view.View;

import com.onapptv.R;

public class BlurringView extends View {

    public BlurringView(Context context) {
        this(context, null);
        setWillNotDraw(false);
    }

    public BlurringView(Context context, AttributeSet attrs) {
        super(context, attrs);

        final Resources res = getResources();
        final int defaultBlurRadius = res.getInteger(R.integer.default_blur_radius);
        final int defaultDownsampleFactor = res.getInteger(R.integer.default_downsample_factor);
        final int defaultOverlayColor = res.getColor(R.color.default_overlay_color);

        initializeRenderScript(context);

        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.PxBlurringView);
        setBlurRadius(a.getInt(R.styleable.PxBlurringView_blurRadius, defaultBlurRadius));
        setDownsampleFactor(a.getInt(R.styleable.PxBlurringView_downsampleFactor,
                defaultDownsampleFactor));
        setOverlayColor(a.getColor(R.styleable.PxBlurringView_overlayColor, defaultOverlayColor));
        a.recycle();
    }

    public void setBlurredView(View blurredView) {
        mBlurredView = blurredView;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint maskPaint = new Paint();
        Paint zonePaint = new Paint();
        maskPaint.setAntiAlias(true);
        maskPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        zonePaint.setAntiAlias(true);
        zonePaint.setColor(Color.WHITE);
        RectF roundRect = new RectF();
        roundRect.set(0, 0, getWidth(), getHeight());
        canvas.saveLayer(roundRect, zonePaint, Canvas.ALL_SAVE_FLAG);
        canvas.drawRoundRect(roundRect, radius, radius, zonePaint);
        canvas.saveLayer(roundRect, maskPaint, Canvas.ALL_SAVE_FLAG);
        canvas.save();
        super.onDraw(canvas);
        if (mBlurredView != null) {
            if (prepare()) {
                // If the background of the blurred view is a color drawable, we use it to clear
                // the blurring canvas, which ensures that edges of the child views are blurred
                // as well; otherwise we clear the blurring canvas with a transparent color.
                if (mBlurredView.getBackground() != null && mBlurredView.getBackground() instanceof ColorDrawable) {
                    mBitmapToBlur.eraseColor(((ColorDrawable) mBlurredView.getBackground()).getColor());
                } else {
                    mBitmapToBlur.eraseColor(getResources().getColor(R.color.blurringColor));
                }

                mBlurredView.draw(mBlurringCanvas);

                blur();

                canvas.save();
                canvas.translate(mBlurredView.getX() - getX(), mBlurredView.getY() - getY());
                canvas.scale(mDownsampleFactor, mDownsampleFactor);
                canvas.drawBitmap(mBlurredBitmap, 0, 0, null);
                canvas.restore();
            }
            canvas.drawColor(mOverlayColor);
        }
    }

    public void setBlurRadius(int radius) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mBlurScript.setRadius(radius);
        }
    }

    public void setDownsampleFactor(int factor) {
        if (factor <= 0) {
            throw new IllegalArgumentException("Downsample factor must be greater than 0.");
        }

        if (mDownsampleFactor != factor) {
            mDownsampleFactor = factor;
            mDownsampleFactorChanged = true;
        }
    }

    public void setOverlayColor(int color) {
        mOverlayColor = color;
    }

    private void initializeRenderScript(Context context) {
        mRenderScript = RenderScript.create(context);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mBlurScript = ScriptIntrinsicBlur.create(mRenderScript, Element.U8_4(mRenderScript));
        }
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    protected boolean prepare() {
        final int width = mBlurredView.getWidth();
        final int height = mBlurredView.getHeight();

        if (mBlurringCanvas == null || mDownsampleFactorChanged
                || mBlurredViewWidth != width || mBlurredViewHeight != height) {
            mDownsampleFactorChanged = false;

            mBlurredViewWidth = width;
            mBlurredViewHeight = height;

            int scaledWidth = width / mDownsampleFactor;
            int scaledHeight = height / mDownsampleFactor;

            // The following manipulation is to avoid some RenderScript artifacts at the edge.
            scaledWidth = scaledWidth - scaledWidth % 4 + 4;
            scaledHeight = scaledHeight - scaledHeight % 4 + 4;

            if (mBlurredBitmap == null
                    || mBlurredBitmap.getWidth() != scaledWidth
                    || mBlurredBitmap.getHeight() != scaledHeight) {
                mBitmapToBlur = Bitmap.createBitmap(scaledWidth, scaledHeight,
                        Bitmap.Config.ARGB_8888);
                if (mBitmapToBlur == null) {
                    return false;
                }

                mBlurredBitmap = Bitmap.createBitmap(scaledWidth, scaledHeight,
                        Bitmap.Config.ARGB_8888);
                if (mBlurredBitmap == null) {
                    return false;
                }
            }

            mBlurringCanvas = new Canvas(mBitmapToBlur);
            mBlurringCanvas.scale(1f / mDownsampleFactor, 1f / mDownsampleFactor);
            mBlurInput = Allocation.createFromBitmap(mRenderScript, mBitmapToBlur,
                    Allocation.MipmapControl.MIPMAP_NONE, Allocation.USAGE_SCRIPT);
            mBlurOutput = Allocation.createTyped(mRenderScript, mBlurInput.getType());
        }
        return true;
    }

    protected void blur() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mBlurInput.copyFrom(mBitmapToBlur);
            mBlurScript.setInput(mBlurInput);
            mBlurScript.forEach(mBlurOutput);
            mBlurOutput.copyTo(mBlurredBitmap);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (mRenderScript != null) {
            mRenderScript.destroy();
        }
    }

    private int mDownsampleFactor;
    private int mOverlayColor;
    private int radius;
    private View mBlurredView;
    private int mBlurredViewWidth, mBlurredViewHeight;

    private boolean mDownsampleFactorChanged;
    private Bitmap mBitmapToBlur, mBlurredBitmap;
    private Canvas mBlurringCanvas;
    private RenderScript mRenderScript;
    private ScriptIntrinsicBlur mBlurScript;
    private Allocation mBlurInput, mBlurOutput;

}
