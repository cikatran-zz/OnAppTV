package com.onapptv.ConnectionView.Custom.View.Swiper;

public interface SwiperDelegate {

    void onPageScrolled(int position, float positionOffset, int positionOffsetPixels);


    void onPageSelected(int position);

    void onPageScrollStateChanged(int state);

    void onButtonInClicked(int currentIndex);
}
