import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, Image, StatusBar,
    TouchableOpacity, NativeModules, Platform
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import {rootViewTopPadding} from "../../utils/rootViewTopPadding";
import * as Orientation from "react-native-orientation";

const passwordBase = require('../../assets/ic_pincode.png');
const passwordTop = require('../../assets/password-top.png');

export default class ParentalControlLock extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            PINCode: "",
            showError: false
        }
    }

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _onInputPincode = (num) => {
        let input = this.state.PINCode;
        if (num != -1) {
            if (input.length >= 4) {
                return;
            }
            input += num;
        } else if (input.length > 0) {
            input = input.substring(0, input.length - 1);
        }

        if (input.length == 4) {
            NativeModules.STBManager.checkSTBPINWithJsonString(JSON.stringify({PIN:input}), (error, results)=> {
                console.log(results);
                let res = JSON.parse(results[0]).return;
                if (res == "1") {
                    // Success
                    const {navigation} = this.props;
                    const {onBack} = this.props.navigation.state.params;
                    navigation.goBack();
                    onBack(true);
                } else {
                    // Error

                }
            });
        }

        this.setState({PINCode: input});
    };

    _onBack = () => {
        const {navigation} = this.props;
        const {onBack} = this.props.navigation.state.params;
        navigation.goBack();
        onBack(false);
    };

    _renderNumber = (num) => {
        return (
            <TouchableOpacity key={num} style={styles.numberContainer} onPress={()=> this._onInputPincode(num)}>
                <View style={{width: '100%', height: '100%', backgroundColor: colors.whitePrimary, opacity: 0.14}}/>
                <View style={styles.numberText}>
                    <Text style={styles.text}>{num ? num : 'Undefined'}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderDeleteButton = () => {
        return (
            <TouchableOpacity style={styles.numberContainer} onPress={()=> this._onInputPincode(-1)}>
                <View style={{width: '100%', height: '100%', backgroundColor: colors.whitePrimary, opacity: 0.14}}/>
                <View style={styles.numberText}>
                    <Image source={require('../../assets/ic_delete.png')}/>
                </View>
            </TouchableOpacity>
        )
    }

    _renderNumberRow = (arr) => {
        return (
            <View style={styles.numberRowContainer}>
                {arr.map(num => {
                    return this._renderNumber(num)
                })}
            </View>

        )
    };

    _renderInputImage = () => {
        let source = [passwordBase, passwordBase, passwordBase, passwordBase];
        for (let i = 0; i < this.state.PINCode.length; i++) {
            source[i] = passwordTop;
        }

        return (
            <View style={{flexDirection: 'row'}}>
                {
                    source.map((img, index)=>{
                        if (index < 3) {
                            return (<Image source={img} style={{marginRight: 3}}/>);
                        } else {
                            return (<Image source={img}/>);
                        }
                    })
                }
            </View>
        );
    };

    render() {
        const {navigation} = this.props

        return (
            <View style={styles.container}>
                <StatusBar/>
                <TouchableOpacity style={styles.topLeftButton} onPress={()=>this._onBack()}>
                    <Image source={require('../../assets/settings-leftArrow-White.png')}/>
                </TouchableOpacity>
                <View style={styles.pinCodeContainer}>
                    <View style={styles.pinCodeBackground}/>
                    <View style={styles.pinCodeInputSection}>
                        <Text style={styles.pinCodeText}>Enter PIN Code</Text>
                        <View style={styles.pinCodes}>
                            {this._renderInputImage()}
                        </View>
                    </View>
                </View>
                <View style={styles.numbersSection}>
                    {this._renderNumberRow([1, 2, 3])}
                    {this._renderNumberRow([4, 5, 6])}
                    {this._renderNumberRow([7, 8, 9])}
                    <View style={styles.numberRowContainer}>
                        <View style={styles.numberContainer}/>
                        {this._renderNumber('0')}
                        {this._renderDeleteButton()}
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.greyParentalLock,
        alignItems: 'center'
    },
    topLeftButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        top: rootViewTopPadding(),
        left: 0,
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    headerContainer: {
        marginTop: 15,
        height: 36,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    pinCodeContainer: {
        flexDirection: 'row',
        marginTop: 197,
        height: '18%',
        width: '75%',
    },
    pinCodeBackground: {
        opacity: 0.14,
        backgroundColor: '#717171',
        width: '100%',
        height: '100%',
        borderRadius: 13
    },
    pinCodeInputSection: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
    pinCodeText: {
        fontSize: 15,
        color: colors.whitePrimary,
        marginLeft: 40
    },
    pinCodes: {
        marginLeft: 30,
        flexDirection: 'row'
    },
    backIcon: {
        position: 'absolute',
        left: 18
    },
    numbersSection: {
        position: 'absolute',
        top: '68%',
        left: 0,
        width: '100%',
        height: '32%',
        padding: 5
    },
    numberRowContainer: {
        flexDirection: 'row',
        marginLeft: 2.5,
        marginRight: 2.5,
        width: '100%',
        height: '24%'
    },
    numberContainer: {
        borderRadius: 2,
        width: '32%',
        flexDirection: 'row',
        margin: 2.5,
        overflow: "hidden"
    },
    numberText: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: colors.whitePrimary,
        fontSize: 25
    }
})