import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform, NativeModules, Image, TouchableOpacity
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import _ from 'lodash'
import * as Orientation from "react-native-orientation";
import * as Progress from 'react-native-progress';

export default class TimeShiftConfig extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            timeShiftLimitSize: 0.0,
        };
        this.rerender = false;
    }

    componentDidMount() {
        this.props.getTimeShiftLimitSize()
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    }

    componentWillUnmount() {
        NativeModules.STBManager.setTimeshiftLimitSizeWithJsonString(JSON.stringify({timeshiftLimitSize: this.state.timeShiftLimitSize + ""}),(error, results)=> {})
        this._navListener.remove();
    }

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    _keyExtractor = (item, index) => index;

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    _onChangeTimeShift = (changeType) => {
        let timeShiftLimitSize = this.state.timeShiftLimitSize;

        if (changeType === 'down') {
            if (timeShiftLimitSize === 0.5) {
                timeShiftLimitSize = 4;
            } else {
                timeShiftLimitSize -= 0.5;
            }
        } else {
            if (timeShiftLimitSize === 4.0) {
                timeShiftLimitSize = 0.5;
            } else {
                timeShiftLimitSize += 0.5;
            }
        }
        this.setState({timeShiftLimitSize: timeShiftLimitSize});
    };

    render() {
        const {timeShiftLimitSize} = this.props;

        if (!timeShiftLimitSize.fetched || timeShiftLimitSize.isFetching) {
            return null;
        }
        if (timeShiftLimitSize.data == null || timeShiftLimitSize.error) {
            return (
                <View style={styles.container}>
                    <StatusBar
                        translucent={true}
                        backgroundColor='#00000000'
                        barStyle='dark-content'/>
                    <Text style={styles.errorText}>{satellite.errorMessage}</Text>
                </View>
            )
        }

        if (!this.rerender) {
            this.state.timeShiftLimitSize = timeShiftLimitSize.data;
            this.rerender = true;
        }

        return (
            <View style={styles.container}>
                <View style={styles.subView}>
                    <View style={styles.listItemContainer}>
                        <Text style={styles.itemName}>Size of Memory</Text>
                        <View style={styles.controlView}>
                            <TouchableOpacity style={styles.arrowIcon}
                                              onPress={() => this._onChangeTimeShift('down')}>
                                <Image source={require('../../../assets/leftArrow.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.valueText}>{this.state.timeShiftLimitSize + "GB"}</Text>
                            <TouchableOpacity style={styles.arrowIcon}
                                              onPress={() => this._onChangeTimeShift('up')}>
                                <Image source={require('../../../assets/rightArrow.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottomLine}></View>
                </View>
                <Text style={styles.descriptionText}>{"Define the memory size of the timeshift\nallocated to the timeshift."}</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.whiteBackground,
        justifyContent: 'space-between'
    },
    errorText: {
        color: colors.textDarkGrey,
        textAlign: 'center',
        marginTop: 100,
        width: '100%',
        fontSize: 20
    },
    bottomLine: {
        backgroundColor: colors.whiteBackground,
        width: '100%',
        height: 1,
        opacity: 0.07
    },
    subView: {
        marginTop: 45,
        marginRight: 45,
        marginLeft: 45,
        borderRadius: 13,
        height: '24.3%',
        overflow: 'hidden',
        flexDirection: 'column',
        backgroundColor: '#C1C1C1',
        paddingHorizontal: 25
    },
    listItemContainer: {
        marginTop: 42,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemName: {
        paddingVertical: 15,
        color: colors.textWhitePrimary,
        fontSize: 15
    },
    controlView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 110.5,
        backgroundColor: 'transparent'
    },
    arrowIcon: {
        alignSelf: 'center'
    },
    valueText: {
        color: colors.textWhitePrimary,
        fontSize: 13,
        alignSelf: 'center'
    },
    configView: {
        width: '100%',
        height: 220
    },
    descriptionText: {
        color: '#777777',
        fontSize: 17,
        marginBottom: 102,
        alignSelf: 'center'
    }
});