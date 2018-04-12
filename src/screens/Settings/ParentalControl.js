import React from 'react'
import {
    Text, View, StyleSheet, StatusBar, Switch,
    FlatList, Platform, TouchableOpacity, NativeModules
} from 'react-native'
import {colors} from '../../utils/themeConfig'

export default class ParentalControl extends React.PureComponent {

    constructor(props) {
        super(props)
        const {navigation} = this.props;
        navigation.navigate("ParentalControlLock", {onBack: this._onDonePIN.bind(this)})

        this.state = {
            isParentalControl: false,
            data: [
                {
                    value: 10,
                    selected: false
                },
                {
                    value: 12,
                    selected: false
                },
                {
                    value: 16,
                    selected: false
                },
                {
                    value: 18,
                    selected: false
                }
            ]
        };

        this._getParentalControlInfo();
    }

    _getParentalControlInfo = () => {
        NativeModules.STBManager.getParentalGuideRatingInJson((error, results)=> {
            let jsonObj = JSON.parse(results[0]);
            let rating = parseInt(jsonObj.parentalGuideRating);
            if (rating == 0) {
                this.setState({isParentalControl: false});
                this._changeStateForAgeControl(0);
            } else {
                this.setState({isParentalControl: true});
                this._changeStateForAgeControl(rating);
            }
        });
    };

    _changeStateForAgeControl = (age) => {
        let data = this.state.data.map((item)=> {
            if (item.value == age) {
                return {value: item.value, selected: true}
            } else {
                return {value: item.value, selected: false}
            }
        });
        this.setState({data: data});
    };

    _onDonePIN(isMatched) {
        const {navigation} = this.props;
        if (!isMatched) {
            navigation.goBack();
        }
    }

    _keyExtractor = (item, index) => index;

    _onChangeOption = (age) => {
        if (!this.state.isParentalControl) {
            return;
        }
        let data = this.state.data.map((item)=> {
            if (item.value == age) {
                return {value: item.value, selected: true}
            } else {
                return {value: item.value, selected: false}
            }
        });
        this.setState({data: data});
        NativeModules.STBManager.setParentalGuideRatingWithJsonString(JSON.stringify({parentalGuideRating: age.toString()}), (error, results)=>{});
    };

    _renderOption = ({item, index}) => {

        let style = {
            width: 50,
            height: 50,
            borderRadius: 25,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.whitePrimary,
            marginLeft: index === 0 ? 0 : 12
        };
        if (item.selected) {
            style.borderColor = 'transparent';
            style.backgroundColor = colors.mainPink;
        }
        return (
            <TouchableOpacity onPress={()=> this._onChangeOption(item.value)}>
                <View style={style}>
                    <Text style={styles.optionText}>{item.value}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    _renderListOption = (data) => {
        return (
            <FlatList
                keyExtractor={this._keyExtractor}
                style={{width: '100%'}}
                horizontal={true}
                data={data}
                renderItem={this._renderOption}
            />
        )
    };

    _onChangeParentalControl(value) {

        if (value) {
            NativeModules.STBManager.setParentalGuideRatingWithJsonString(JSON.stringify({parentalGuideRating: "10"}), (error, results)=>{});
            this.setState({isParentalControl: true});
            this._changeStateForAgeControl(10);
        } else {
            NativeModules.STBManager.setParentalGuideRatingWithJsonString(JSON.stringify({parentalGuideRating: "0"}), (error, results)=>{});
            this.setState({isParentalControl: false});
            this._changeStateForAgeControl(0);
        }
    }

    _renderSwitch() {
        if (Platform.OS === "ios") {
            return (<Switch value={this.state.isParentalControl} onValueChange={(value)=> this._onChangeParentalControl(value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>)
        }
        return (<Switch value={this.state.isParentalControl} onValueChange={(value)=> this._onChangeParentalControl(value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} thumbTintColor={'#ffffff'}/>)
    }

    render() {
        const {navigation} = this.props

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <View style={styles.mainContainer}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchHeaderText}>Parental Control</Text>
                        {this._renderSwitch()}
                    </View>
                    <View style={styles.optionsContainer}>
                        {this._renderListOption(this.state.data)}
                    </View>
                </View>
                <Text style={styles.textBelow}>Select the level of parental control</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.whiteBackground
    },
    mainContainer: {
        margin: 45,
        marginBottom: 0,
        borderRadius: 13,
        height: '60%',
        width: '75%',
        backgroundColor: '#C0C0C0',
    },
    switchContainer: {
        margin: 23,
        paddingBottom: 23,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.whitePrimary
    },
    switchHeaderText: {
        fontSize: 15,
        color: colors.whitePrimary
    },
    toggleButton: {
        width: 40,
        height: 26,
        marginRight: 15
    },
    optionsContainer: {
        marginTop: 120,
        marginLeft: 23,
        marginRight: 23,
        width: '100%',
    },
    option: {
        width: 50,
        height: 50,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.whitePrimary
    },
    optionText: {
        color: colors.whitePrimary,
        fontSize: 26
    },
    textBelow: {
        marginTop: 15,
        alignSelf: 'center',
        fontSize: 13,
        color: colors.greyTextBelowParentControl
    }
});
