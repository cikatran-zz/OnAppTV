import React from 'react'
import {
    Text, View, StyleSheet, TextInput, ImageBackground, Image, Platform, TouchableOpacity, StatusBar, ScrollView,
    NativeModules, Dimensions
} from 'react-native'
import {Dropdown} from 'react-native-material-dropdown';
import {colors} from '../../../utils/themeConfig'
import {rootViewTopPadding} from "../../../utils/rootViewPadding";
import RadioButton from '../../../components/RadioCheckbox/radioButton'
import RadioGroup from '../../../components/RadioCheckbox/radioGroup'
import * as Orientation from "react-native-orientation";
import _ from 'lodash'
import AlertModal from "../../../components/AlertModal";
import IndicatorModal from "../../../components/IndicatorModal";
import {NavigationActions} from "react-navigation";
import {facebookLogin} from "../../../utils/facebookLogin";

export default class SignUp extends React.PureComponent {

    constructor(props) {
        super(props);

        this.password = "";
        this.info = {
            gender: "Male",
            lastName: "",
            firstName: "",
            age: "",
            email: ""
        };
        this.alertVC = null;
        this.indicatorModal = null;
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

    _loginWithFacebook = () => {
        facebookLogin().then((value)=> {
            this._goToHomeScreen();
        }).catch((error)=> {
            console.log("ERROR", error);
        });
    };

    _signUp() {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.info.email)) {
            this.alertVC.setState({isShow: true, message: "Invalid email"});
            return;
        }
        this.indicatorModal.setState({isShow: true});
        NativeModules.RNUserKitIdentity.signUpWithEmail(this.info.email, this.password, {_base_info:this.info}, (error, results) => {
            if (error != null) {
                this.callbackMessage = JSON.parse(error).message;
                this.indicatorModal.setState({isShow: false});
            } else {
                this.indicatorModal.setState({isShow: false});
                this._goToHomeScreen();
            }
        })
    }

    onDismissIndicatorModal() {
        this.alertVC.setState({isShow: true, message: this.callbackMessage});
    }

    render() {
        let ageData = _.range(100).map(x => ({value: x.toString()}));
        return (
            <View style={styles.container}>
                <AlertModal ref={(modal)=>{this.alertVC = modal}}/>
                <IndicatorModal ref={(modal)=>{this.indicatorModal = modal}} onDismiss={this.onDismissIndicatorModal.bind(this)}/>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={false} alwaysBounceHorizontal={false}
                            bounces={false}>
                    <View style={styles.subView}>
                        <Text style={styles.titleText}>SIGN UP</Text>
                        <TouchableOpacity style={[styles.colorButton, {backgroundColor: '#3765A3', marginTop: 29.8}]} onPress={()=> this._loginWithFacebook()}>
                            <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Continue with Facebook</Text>
                        </TouchableOpacity>
                        <Text style={styles.descriptionText1}>Or create your account manually</Text>
                        <RadioGroup style={styles.radioGroup}
                                    size={24}
                                    thickness={1}
                                    color={'#D8D8D8'}
                                    selectedIndex={0}
                                    onSelect={(index, value)=> this.info.gender = value}>
                            <RadioButton value={'Male'}
                                         style={styles.radioButton}
                                         activeColor={colors.mainPink}>
                                <Text style={{color: 'black', fontSize: 14}}>Male</Text>
                            </RadioButton>
                            <RadioButton value={'Female'}
                                         style={styles.radioButton}
                                         activeColor={colors.mainPink}>
                                <Text style={{color: 'black', fontSize: 14}}>Female</Text>
                            </RadioButton>
                            <RadioButton value={'Non-binary'}
                                         style={styles.radioButton}
                                         activeColor={colors.mainPink}>
                                <Text style={{color: 'black', fontSize: 14}}>Non-binary</Text>
                            </RadioButton>
                        </RadioGroup>
                        <TextInput style={styles.inputText}
                                   placeholder={'E-mail (personal)'}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholderTextColor={'black'}
                                   onChangeText={(text)=> this.info.email = text}/>
                        <TextInput style={styles.inputText}
                                   placeholder={'Password'}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholderTextColor={'black'}
                                   secureTextEntry={true}
                                   onChangeText={(text)=> this.password = text}/>
                        <TextInput style={styles.inputText}
                                   placeholder={'Last Name'}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholderTextColor={'black'}
                                   onChangeText={(text)=> this.info.lastName = text}/>
                        <TextInput style={styles.inputText}
                                   placeholder={'First Name'}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholderTextColor={'black'}
                                   onChangeText={(text)=> this.info.firstName = text}/>
                        <View style={styles.dropdownView}>
                            <Dropdown
                                containerStyle={{
                                    height: 60,
                                    position: 'absolute',
                                    top: -25,
                                    paddingLeft: 30,
                                    width: '100%'
                                }}
                                overlayStyle={{paddingLeft: 30}}
                                pickerStyle={{paddingLeft: 30}}
                                data={ageData}
                                value={"Age"}
                                onChangeText={(value, index, data)=>this.info.age=value}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.colorButton, {backgroundColor: colors.mainPink, marginTop: 44.5}]} onPress={()=>this._signUp()}>
                            <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Validate your profile</Text>
                        </TouchableOpacity>
                        <Text style={styles.descriptionText2}>By validating, you accept the OnTV’s Terms & Conditions of Use{'\n'}and Privacy Policy</Text>
                    </View>
                </ScrollView>
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
        width: Dimensions.get('window').width,
        marginTop: rootViewTopPadding(),
        paddingBottom: 60
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
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignSelf: 'center',
        height: 44,
        marginTop: 30,
        marginBottom: 7
    },
    radioButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center'
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
    dropdownView: {
        width: '100%',
        height: 40,
        borderColor: 'rgba(152,152,152,0.32)',
        borderWidth: 1,
        borderRadius: (Platform.OS === 'ios') ? 20 : 40,
        marginTop: 19.4,
        overflow: 'hidden'
    },
    descriptionText2: {
        color: 'rgba(98,98,98,0.41)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 18.8
    }
});