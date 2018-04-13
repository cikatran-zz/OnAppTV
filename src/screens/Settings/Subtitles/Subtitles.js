import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform, NativeModules
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import SwitcherList from '../../../components/SwitcherList'
import _ from 'lodash'

export default class Subtitles extends React.PureComponent {

    constructor(props) {
        super(props);
        this.data = ["English", "French", "Spanish", "Italian", "Chinese", "Off"];
        this.languageCode = ["eng", "fre", "spa", "ita", "chi", "000"];
    }

    componentDidMount() {
        this.props.getSubtitles();
    }

    _keyExtractor = (item, index) => index;

    onChangeSubtitles(index, value) {
        if (!value) {
            index = 0;
        }
        const {onChange} = this.props.navigation.state.params;
        onChange({screen: 'Subtitles', value: this.data[index]});
        NativeModules.STBManager.setPreferSubtitleLanguageWithJsonString(JSON.stringify({subtitleLanguageCode: this.languageCode[index]}), (error, events) => {
        });
    }

    render() {
        const {subtitles} = this.props;

        if (!subtitles.fetched || subtitles.isFetching) {
            return null;
        }
        if (subtitles.data == null || subtitles.error) {
            return (
                <View style={styles.container}>
                    <StatusBar
                        translucent={true}
                        backgroundColor='#00000000'
                        barStyle='dark-content'/>
                    <Text style={styles.errorText}>{subtitles.errorMessage}</Text>
                </View>
            )
        }
        let foundIndex = this.languageCode.indexOf(subtitles.data);
        if (foundIndex == -1) {
            foundIndex = 0;
            NativeModules.STBManager.setPreferSubtitleLanguageWithJsonString(JSON.stringify({subtitleLanguageCode: this.languageCode[0]}), (error, events) => {
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
                                  this.onChangeSubtitles(index, value)
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