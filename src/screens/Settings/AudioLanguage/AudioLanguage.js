import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform, NativeModules
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import SwitcherList from '../../../components/SwitcherList'
import _ from 'lodash'

export default class AudioLanguage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.data = ["English", "French", "Spanish", "Italian", "Chinese"];
        this.audiolanguageCode = ["eng", "fre", "spa", "ita", "chi", "000"];
    }

    componentDidMount() {
        this.props.getAudioLanguage();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _keyExtractor = (item, index) => index;

    onChangeAudioLanguage(index, value) {
        if (!value) {
            index = 0;
        }
        const {onChange} = this.props.navigation.state.params;
        onChange({screen: 'AudioLanguage', value: this.data[index]});
        NativeModules.STBManager.setPreferAudioLanguageWithJsonString(JSON.stringify({audioLanguageCode: this.audiolanguageCode[index]}), (error, events) => {
        });
    }

    render() {
        const {audioLanguage} = this.props;

        if (!audioLanguage.fetched || audioLanguage.isFetching) {
            return null;
        }
        if (audioLanguage.data == null || audioLanguage.error) {
            return (
                <View style={styles.container}>
                    <StatusBar
                        translucent={true}
                        backgroundColor='#00000000'
                        barStyle='dark-content'/>
                    <Text style={styles.errorText}>{audioLanguage.errorMessage}</Text>
                </View>
            )
        }
        let foundIndex = this.audiolanguageCode.indexOf(audioLanguage.data);
        if (foundIndex == -1) {
            foundIndex = 0;
            NativeModules.STBManager.setPreferAudioLanguageWithJsonString(JSON.stringify({audioLanguageCode: this.audiolanguageCode[0]}), (error, events) => {
            });
        }

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <SwitcherList style={styles.listContainer}
                              data={this.data}
                              index={foundIndex}
                              onSwitch={(index, value) => {
                                  this.onChangeAudioLanguage(index, value)
                              }}/>
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
    listContainer: {
        marginTop: 46,
        marginLeft: 32,
        marginRight: 17
    },
    errorText: {
        color: colors.textDarkGrey,
        textAlign: 'center',
        marginTop: 100,
        width: '100%',
        fontSize: 20
    }
});