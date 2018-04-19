import {colors} from "./themeConfig";
import {Image, TouchableOpacity} from "react-native";
import React from 'react';

export default defaultNavigationOptions = (title, navigation, canBack = false) => {
    var backButton = {
        headerLeft: <TouchableOpacity onPress={() => navigation.goBack(null)}
                                      style={{marginLeft: 18, paddingVertical: 10, paddingHorizontal: 10}}>
            <Image source={require('../assets/ic_left_arrow.png')}/>
        </TouchableOpacity>
    };
    if (!canBack) {
        backButton = {};
    }
    return {
        title: title,
        headerStyle: {
            backgroundColor: '#ffffff',
            shadowOpacity: 0,
            shadowOffset: {
                height: 0,
                width: 0
            },
            shadowColor: '#ffffff',
            shadowRadius: 0,
            elevation: 0,
            borderBottomWidth: 0
        },
        headerTitleStyle: {
            color: colors.greySettingLabel,
            //textAlign: 'center',
            //justifyContent: 'space-between',
            fontSize: 17,
            //alignSelf: 'center',
            fontWeight: "normal"
        },
        ...backButton
    }
};