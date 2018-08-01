import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform, NativeModules, Image, TouchableOpacity
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import _ from 'lodash'
import * as Orientation from "react-native-orientation";
import * as Progress from 'react-native-progress';

export default class AtennaTests extends React.PureComponent {

    constructor(props) {
        super(props);
        this.dataSourceLowLOF = [5150, 5750, 9750];
        this.dataSourceHighLOF = [10600, 10750, 11300, 11475];
        this.dataSourceDiseqC10 = ["None", "LNB1", "LNB2", "LNB3", "LNB4"];
        let array = Array(16).fill().map((v, i) => ("LNB" + (i + 1)));
        array.splice(0, 0, "None");
        this.dataSourceDiseqC11 = array;
        this.dataSourceLNBValue = ["OFF", "ON", "AUTO"];
        this.state = {
            listConfigure: [
                {
                    name: "DiSEqC1.0",
                    value: "",
                    key: "diSEqC10"
                }, {
                    name: "DiSEqC1.1",
                    value: "",
                    key: "diSEqC11"
                },
                {
                    name: "LNB Type",
                    value: ""
                },
                {
                    name: "22 kHz",
                    value: "",
                    key: "lNBValue"
                },
                {
                    name: "Transponder",
                    value: ""
                },
            ],

            signalStrength: 0,
            signalQuality: 0,
            signalWidth: 0,
            timer: null
        };

        this.satellite = null;
        this.rerender = false;
        this.transponderModelIndex = 0;

        this.props.getSatellite();
    }

    _intervalGetSignal = () => {
        NativeModules.STBManager.getSignalCallbackInJson((error, results)=> {
            let jsonObj = JSON.parse(results[0]);
            if (jsonObj.signalQuality != null && jsonObj.signalLevel != null) {
                let signalStrength = parseFloat(jsonObj.signalLevel) / 100;
                let signalQuality = parseFloat(jsonObj.signalQuality) / 100;
                this.setState({signalStrength: signalStrength, signalQuality: signalQuality});
            }
        });
    };

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
        let timer = setInterval(this._intervalGetSignal, 1000);
        this.setState({timer});

        NativeModules.STBManager.isConnect((connectString)=>{
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.getSatelliteListInJson((error, results)=> {
                    let jsonObj = JSON.parse(results[0]);
                    if (jsonObj.length > 0) {
                        this.setDatasource(jsonObj[jsonObj.length -1]);
                    }
                });
            }
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
        clearInterval(this.state.timer);
    }

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    setDatasource(data) {
        let satelliteObj = _.cloneDeep(data);
        _.update(satelliteObj, 'lNBType', (item) => (1));
        _.update(satelliteObj, 'lNBPower', (item) => (0));
        _.update(satelliteObj, 'toneBurst', (item) => (0));
        if (satelliteObj.lowLOF === 0) {
            _.update(satelliteObj, 'lowLOF', (item) => (this.dataSourceLowLOF[this.dataSourceLowLOF.length - 1]));
            _.update(satelliteObj, 'diSEqCLevel', (item) => (2));
        }

        if (satelliteObj.highLOF === 0) {
            _.update(satelliteObj, 'highLOF', (item) => (this.dataSourceHighLOF[0]));
        }

        if (_.isEqual(data, satelliteObj)) {
            NativeModules.STBManager.setSatelliteWithJsonString(JSON.stringify(satelliteObj), (error, result) => {
            });
        }

        let transponderModel = data.transponderModelArr[0];

        NativeModules.STBManager.setFeTunWithJsonString(JSON.stringify({carrierID: transponderModel.carrierID}), (error, result) => {
        });

        let listData = _.cloneDeep(this.state.listConfigure);
        listData[0].value = this.dataSourceDiseqC10[satelliteObj.diSEqC10];
        listData[1].value = this.dataSourceDiseqC11[satelliteObj.diSEqC11];
        listData[2].value = satelliteObj.lowLOF + "/" + satelliteObj.highLOF;
        listData[3].value = this.dataSourceLNBValue[satelliteObj.lNBValue];
        listData[4].value  = transponderModel.frequency + "/" + transponderModel.symbolRate;
        this.state.listConfigure = listData;
        this.satellite = satelliteObj;
    }

    _onChangeSatellite = (idx, button) => {
        let dataSource = null;
        if (idx === 0) {
            dataSource = this.dataSourceDiseqC10;
        } else if (idx === 1) {
            dataSource = this.dataSourceDiseqC11;
        } else if (idx === 3) {
            dataSource = this.dataSourceLNBValue;
        }
        if (button === 'up') {
            if (dataSource != null) {
                let index = dataSource.indexOf(this.state.listConfigure[idx].value);
                if (index === dataSource.length - 1) {
                    index = 0;
                } else {
                    index += 1;
                }
                let config = this.state.listConfigure;
                config[idx].value = dataSource[index];
                this.setState({listConfigure: config});
                this.satellite[this.state.listConfigure[idx].key] = index;
            } else if (idx === 2) {
                let lowIndex = this.dataSourceLowLOF.indexOf(this.satellite.lowLOF);
                let highIndex = this.dataSourceHighLOF.indexOf(this.satellite.highLOF);
                if (lowIndex === this.dataSourceLowLOF.length - 1) {
                    if (highIndex === this.dataSourceHighLOF.length - 1) {
                        highIndex = 0
                    } else {
                        highIndex += 1;
                    }
                    lowIndex = 0;
                } else {
                    lowIndex += 1;
                }
                this.satellite.lowLOF = this.dataSourceLowLOF[lowIndex];
                this.satellite.highLOF = this.dataSourceHighLOF[highIndex];
                let config = this.state.listConfigure;
                config[idx].value = this.satellite.lowLOF + "/" + this.satellite.highLOF;
                this.setState({listConfigure: config});
            } else if (idx === 4) {
                let index = this.transponderModelIndex;
                if (index === this.satellite.transponderModelArr.length - 1) {
                    index = 0;
                } else {
                    index += 1;
                }
                let config = this.state.listConfigure;
                let transponderModel = this.satellite.transponderModelArr[index];
                config[idx].value = transponderModel.frequency + "/" + transponderModel.symbolRate;;
                this.setState({listConfigure: config});
                this.transponderModelIndex = index;
            }
        } else {
            if (dataSource != null) {
                let index = dataSource.indexOf(this.state.listConfigure[idx].value);
                if (index === 0) {
                    index = dataSource.length - 1;
                } else {
                    index -= 1;
                }
                let config = this.state.listConfigure;
                config[idx].value = dataSource[index];
                this.setState({listConfigure: config});
                this.satellite[this.state.listConfigure[idx].key] = index;
            } else if (idx === 2) {
                let lowIndex = this.dataSourceLowLOF.indexOf(this.satellite.lowLOF);
                let highIndex = this.dataSourceHighLOF.indexOf(this.satellite.highLOF);
                if (lowIndex === 0) {
                    if (highIndex === 0) {
                        highIndex = this.dataSourceHighLOF.length - 1;
                    } else {
                        highIndex -= 1;
                    }
                    lowIndex = this.dataSourceLowLOF.length - 1;
                } else {
                    lowIndex -= 1;
                }
                this.satellite.lowLOF = this.dataSourceLowLOF[lowIndex];
                this.satellite.highLOF = this.dataSourceHighLOF[highIndex];
                let config = this.state.listConfigure;
                config[idx].value = this.satellite.lowLOF + "/" + this.satellite.highLOF;
                this.setState({listConfigure: config});
            } else if (idx === 4) {
                let index = this.transponderModelIndex;
                if (index === 0) {
                    index = this.satellite.transponderModelArr.length - 1;
                } else {
                    index -= 1;
                }
                let config = this.state.listConfigure;
                let transponderModel = this.satellite.transponderModelArr[index];
                config[idx].value = transponderModel.frequency + "/" + transponderModel.symbolRate;;
                this.setState({listConfigure: config});
                this.transponderModelIndex = index;
            }
        }

        let seqC10 = this.dataSourceDiseqC10.indexOf(this.state.listConfigure[0].value);
        let seqC11 = this.dataSourceDiseqC11.indexOf(this.state.listConfigure[1].value)
        if (seqC10 === 0 && seqC11 !== 0) {
            this.satellite.diSEqCLevel = 0;
        } else if (seqC10 !== 0 && seqC11 !== 0) {
            this.satellite.diSEqCLevel = 1;
        } else if (seqC10 === 0 && seqC11 !== 0) {
            this.satellite.diSEqCLevel = 2;
        } else {
            this.satellite.diSEqCLevel = 5;
        }
        NativeModules.STBManager.setSatelliteWithJsonString(JSON.stringify(this.satellite), (error, result) => {
            if (JSON.parse(result[0]) === "1") {
                let transponderModel = this.satellite.transponderModelArr[this.transponderModelIndex];
                NativeModules.STBManager.setFeTunWithJsonString(JSON.stringify({carrierID: transponderModel.carrierID}), (error, result) => {

                });
            }
        });
    };

    _renderListItem = ({item, index}) => {
        return (
            <View style={styles.listItemContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.controlView}>
                    <TouchableOpacity style={styles.arrowIcon}
                                      onPress={() => this._onChangeSatellite(index, 'down')}>
                        <Image source={require('../../../assets/leftArrow.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.valueText}>{item.value}</Text>
                    <TouchableOpacity style={styles.arrowIcon} onPress={() => this._onChangeSatellite(index, 'up')}>
                        <Image source={require('../../../assets/rightArrow.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    _keyExtractor = (item, index) => index;

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        // const {satellite} = this.props;
        //
        // if (!satellite.fetched || satellite.isFetching) {
        //     return null;
        // }
        // if (satellite.data == null || satellite.error) {
        //     return (
        //         <View style={styles.container}>
        //             <StatusBar
        //                 translucent={true}
        //                 backgroundColor='#00000000'
        //                 barStyle='dark-content'/>
        //             <Text style={styles.errorText}>{satellite.errorMessage}</Text>
        //         </View>
        //     )
        // }
        //
        // if (!this.rerender) {
        //     this.setDatasource(satellite.data);
        //     this.rerender = true;
        // }

        return (
            <View style={styles.container}>
                <View style={styles.subView}>
                    <View style={styles.configView}>
                        <FlatList
                            style={styles.listConfigure}
                            keyExtractor={this._keyExtractor}
                            horizontal={false}
                            renderItem={this._renderListItem}
                            data={this.state.listConfigure}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View
                                style={{width: "100%", height: 1, backgroundColor: colors.whiteBackground}}/>}
                        />
                    </View>
                    <View style={styles.signalView}>
                        <Text style={styles.signalText}>Signal Strength</Text>
                        <Progress.Bar progress={this.state.signalStrength} style={{width: '100%', marginTop: 13.78, marginBottom: 9.5}} color={colors.mainPink} width={null} unfilledColor={'#AEAEAE'} borderWidth={0} />
                        <Text style={styles.signalText}>Signal Quality</Text>
                        <Progress.Bar progress={this.state.signalQuality} style={{width: '100%', marginTop: 13.78, marginBottom: 45}} color={colors.mainPink} width={null} unfilledColor={'#AEAEAE'} borderWidth={0} />
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
        backgroundColor: colors.whiteBackground
    },
    errorText: {
        color: colors.textDarkGrey,
        textAlign: 'center',
        marginTop: 100,
        width: '100%',
        fontSize: 20
    },
    subView: {
        marginTop: 45,
        marginRight: 45,
        marginLeft: 45,
        borderRadius: 13,
        height: 'auto',
        overflow: 'hidden',
        flexDirection: 'column',
        backgroundColor: '#C1C1C1'
    },
    listConfigure: {
        marginTop: 44,
        marginLeft: 23,
        marginRight: 23,
    },
    listItemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemName: {
        paddingVertical: 15,
        color: colors.textWhitePrimary,
        fontSize: 15
    },
    controlView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 132.5,
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
        height: 250
    },
    signalView: {
        marginTop: 34,
        marginLeft: 23,
        marginRight: 23,
        flexDirection: 'column',
    },
    signalText: {
        color: colors.textWhitePrimary,
        fontSize: 13,
        fontFamily: 'Helvetica Neue'
    }
});