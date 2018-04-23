import React from 'react'
import {
    Text, View, StyleSheet, TextInput, ImageBackground, Image, Platform, TouchableOpacity, StatusBar, NativeModules
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import {rootViewTopPadding} from "../../../utils/rootViewPadding";
import * as Orientation from "react-native-orientation";
import AlertModal from "../../../components/AlertModal";
import IndicatorModal from "../../../components/IndicatorModal";
import {NavigationActions} from "react-navigation";

export default class SignIn extends React.PureComponent {

    constructor(props) {
        super(props);
        this.alertVC = null;
        this.indicatorModal = null;
        this.state = {
            email: "",
            password: ""
        };
        this.callbackMessage = "";
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('#ffffff');
            Orientation.lockToPortrait();
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _signIn =()=> {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            this.alertVC.setState({isShow: true, message: "Invalid email"});
            return;
        }
        this.indicatorModal.setState({isShow: true});
        NativeModules.RNUserKitIdentity.signInWithEmail(this.state.email, this.state.password, (error, results) => {
            if (error != null) {
                this.callbackMessage = JSON.parse(error).message;
                this.indicatorModal.setState({isShow: false});
            } else {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: "Home"
                        })
                    ]
                });
                this.indicatorModal.setState({isShow: false});
                this.props.navigation.dispatch(resetAction);
            }
        })
    };

    onDismissIndicatorModal() {
        this.alertVC.setState({isShow: true, message: this.callbackMessage});
    }

    render() {

        return (
            <View style={styles.container}>
                <AlertModal ref={(modal)=>{this.alertVC = modal}}/>
                <IndicatorModal ref={(modal)=>{this.indicatorModal = modal}} onDismiss={this.onDismissIndicatorModal.bind(this)}/>
                <View style={styles.subView}>
                    <View style={styles.partView}>
                        <Text style={styles.titleText}>LOG IN</Text>
                        <TouchableOpacity style={[styles.colorButton, {backgroundColor: '#3765A3', marginTop: 29.8}]}>
                            <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Continue with Facebook</Text>
                        </TouchableOpacity>
                        <Text style={styles.descriptionText1}>Or sign in with manually</Text>
                    </View>
                    <View style={styles.partView}>
                        <TextInput style={styles.inputText}
                                   placeholder={'E-mail (personal)'}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholderTextColor={'black'}
                                   onChangeText={(text)=> this.setState({email: text})}/>
                        <TextInput style={styles.inputText}
                                   placeholder={'Password'}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholderTextColor={'black'}
                                   secureTextEntry={true}
                                   onChangeText={(text)=> this.setState({password: text})}/>
                    </View>
                    <View style={styles.partView}>
                        <TouchableOpacity>
                            <Text style={{textAlign: 'center', color: '#ADABAB', fontSize: 17}}>Forgot your password ?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.colorButton, {backgroundColor: colors.mainPink, marginTop: 22.8}]} onPress={()=>this._signIn()}>
                            <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.closeButton}
                                  onPress={() => this.props.navigation.goBack()}>
                    <Image source={require('../../../assets/ic_modal_close.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    closeButton: {
        width: 44,
        height: 44,
        position: 'absolute',
        top: 10 + rootViewTopPadding(),
        right: 20,
        backgroundColor: 'rgba(11,11,11,0.31)',
        borderRadius: 22
    },
    titleText: {
        alignSelf: 'center',
        fontSize: 22,
        color: 'black',
        fontWeight: 'bold'
    },
    subView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 31,
        paddingTop: 40.5,
        width: '100%',
        marginTop: rootViewTopPadding(),
        paddingBottom: 60,
        justifyContent: 'space-between'
    },
    colorButton: {
        borderRadius: (Platform.OS === 'ios') ? 18 : 35,
        width: '85%',
        paddingVertical: 9,
        alignSelf: 'center'
    },
    descriptionText1: {
        opacity: 0.66,
        color: 'black',
        fontSize: 13,
        marginTop: 32.8
    },
    inputText: {
        width: '100%',
        height: 40,
        paddingHorizontal: 23.5,
        borderColor: 'rgba(152,152,152,0.32)',
        borderWidth: 1,
        borderRadius: (Platform.OS === 'ios') ? 20 : 40,
        marginTop: 19.4
    },
    descriptionText2: {
        color: 'rgba(98,98,98,0.41)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 18.8
    },
    partView: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center'
    }
});