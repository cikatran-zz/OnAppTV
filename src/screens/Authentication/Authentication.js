import React from 'react'
import {
    Text, View, StyleSheet, TextInput, ImageBackground, Image, Platform, TouchableOpacity, StatusBar
} from 'react-native'
import Swiper from 'react-native-swiper'
import {colors} from '../../utils/themeConfig'
import * as Orientation from "react-native-orientation";
import {rootViewBottomPadding} from "../../utils/rootViewPadding";
import {NavigationActions} from "react-navigation";

export default class Authentication extends React.PureComponent {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('#000000');
            Orientation.lockToPortrait();
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _goToHomeScreen() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: "Home"
                })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {

        return (
            <ImageBackground source={require('../../assets/login_bg.png')} style={styles.container}>
                <View style={styles.backgroundView}></View>
                <Image source={require('../../assets/logo_on.png')}
                       style={{alignSelf: 'center'}}/>
                <View style={{flex: 0.2, width: '100%', minHeight: 105}}>
                    <Swiper loop={true}
                            horizontal={true}
                            showsPagination={true}
                            style={styles.pageViewStyle}
                            removeClippedSubviews={false}
                            dot={<View style={{
                                backgroundColor: 'rgba(255,255,255,0.31)',
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                marginRight: 10
                            }}/>}
                            activeDot={<View style={{
                                backgroundColor: 'rgba(255,255,255,1.0)',
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                marginRight: 10
                            }}/>}
                            autoplay={true}
                            autoplayTimeout={2.5}
                            autoplayDirection={true}
                    >
                        <View style={styles.swipeContentContainer}>
                            <Text style={styles.redText}>The best of TV !</Text>
                            <Text style={styles.contentText}>Login and start playing on your TV without your remote control!</Text>
                        </View>
                        <View style={styles.swipeContentContainer}>
                            <Text style={styles.redText}>Don’t zapp anymore !</Text>
                            <Text style={styles.contentText}>Thanks to your smartphone, select your best program in one click !</Text>
                        </View>
                        <View style={styles.swipeContentContainer}>
                            <Text style={styles.redText}>Share !</Text>
                            <Text style={styles.contentText}>Watch on TV or on your Mobile</Text>
                        </View>

                    </Swiper>
                </View>
                <TouchableOpacity style={[styles.colorButton, {backgroundColor: '#3765A3'}]}>
                    <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Continue with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.colorButton, {backgroundColor: colors.mainPink}]}
                                  onPress={() => this.props.navigation.navigate("SignUp", {})}>
                    <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginBottom: 15, alignSelf: 'center'}} onPress={()=>this._goToHomeScreen()}>
                    <Text style={{color: '#ADABAB', fontSize: 17}}>Continue as Guest</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.colorButton, {backgroundColor: colors.whiteBackground}]}
                                  onPress={() => this.props.navigation.navigate("SignIn", {})}>
                    <Text style={{textAlign: 'center', color: "#000000", fontSize: 17}}>Log in</Text>
                </TouchableOpacity>

                <View style={styles.bottomTextView}>
                    <Text style={styles.bottomText}>by Elia Media & Technology</Text>
                    <Text style={styles.bottomText}>onstb.com</Text>
                </View>
            </ImageBackground>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%'
    },
    bottomTextView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 9,
        marginBottom: 8 + rootViewBottomPadding(),
        marginTop: 15
    },
    bottomText: {
        color: 'rgba(255,255,255,0.24)',
        fontSize: 11
    },
    pageViewStyle: {
    },
    redText: {
        fontSize: 18,
        marginTop: "4%",
        color: '#FC355B',
        marginBottom: 15
    },
    contentText: {
        color: '#F4FBFF',
        fontSize: 15,
        textAlign: 'center'
    },
    swipeContentContainer: {
        width: '84%',
        alignSelf: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    colorButton: {
        borderRadius: (Platform.OS === 'ios') ? 18 : 35,
        width: '62%',
        paddingVertical: 9,
        alignSelf: 'center',
        marginBottom: 20,
    },
    backgroundView: {
        backgroundColor: "#000000",
        opacity: 0.13,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
});