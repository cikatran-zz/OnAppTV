import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform, NativeModules
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import SwitcherList from '../../../components/SwitcherList'
import _ from 'lodash'
import * as Orientation from "react-native-orientation";

export default class VideoFormat extends React.PureComponent {

    constructor(props) {
        super(props);
        this.data = ["4:3 Letter Box","4:3 Center Cut Out","4:3 Extended","16:9 Pillar Box","16:9 Full Screen","16:9 Extended"];
    }

    componentDidMount() {
        this.props.getVideoFormat();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    }

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _keyExtractor = (item, index) => index;

    onChangeVideoFormat(index, value) {
        if (!value) {
            index = 0;
        }
        const {onChange} = this.props.navigation.state.params;
        onChange({screen: 'VideoFormat', value: this.data[index]});
        NativeModules.STBManager.setAspectRatioWithJsonString(JSON.stringify({aspectRatio: index}), (error, events) => {
        });
    }

    render() {
        const {videoFormat} = this.props;

        if (!videoFormat.fetched || videoFormat.isFetching) {
            return null;
        }
        if (videoFormat.data == null || videoFormat.error) {
            return (
                <View style={styles.container}>
                    <StatusBar
                        translucent={true}
                        backgroundColor='#00000000'
                        barStyle='dark-content'/>
                    <Text style={styles.errorText}>{videoFormat.errorMessage}</Text>
                </View>
            )
        }
        let index = videoFormat.data;
        if (index < 0 || index >= this.data.length) {
            index = 0;
            NativeModules.STBManager.setAspectRatioWithJsonString(JSON.stringify({aspectRatio: 0}), (error, events) => {
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
                              index={index}
                              onSwitch={(index, value) => {
                                  this.onChangeVideoFormat(index, value)
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