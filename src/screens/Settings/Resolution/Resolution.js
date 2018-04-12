import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform, NativeModules
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import SwitcherList from '../../../components/SwitcherList'
import _ from 'lodash'

export default class Resolution extends React.PureComponent {

    constructor(props) {
        super(props);
        this.data = ["1080P","1080I","720P","576P","576I"];
    }

    componentDidMount() {
        this.props.getResolution();
    }

    _keyExtractor = (item, index) => index;

    onChangeResolution(index, value) {
        if (!value) {
            index = 0;
        }
        const {onChange} = this.props.navigation.state.params;
        onChange({screen: 'Resolution', value: this.data[index]});
        NativeModules.STBManager.setResolutionWithJsonString(JSON.stringify({resolution: index}), (error, events) => {
        });
    }

    render() {
        const {resolution} = this.props;

        if (!resolution.fetched || resolution.isFetching) {
            return null;
        }
        if (resolution.data == null || resolution.error) {
            return (
                <View style={styles.container}>
                    <StatusBar
                        translucent={true}
                        backgroundColor='#00000000'
                        barStyle='dark-content'/>
                    <Text style={styles.errorText}>{resolution.errorMessage}</Text>
                </View>
            )
        }
        let index = resolution.data;
        if (index < 0 || index >= this.data.length) {
            index = 0;
            NativeModules.STBManager.setResolutionWithJsonString(JSON.stringify({resolution: 0}), (error, events) => {
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
                                  this.onChangeResolution(index, value)
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