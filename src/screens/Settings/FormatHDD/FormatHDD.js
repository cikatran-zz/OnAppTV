import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform, NativeModules, TouchableOpacity
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import SwitcherList from '../../../components/SwitcherList'
import AlertModal from "../../../components/AlertModal";
import * as Orientation from "react-native-orientation";
import IndicatorModal from "../../../components/IndicatorModal";

export default class FormatHDD extends React.PureComponent {

    constructor(props) {
        super(props);
        this.partition = null;
        this.data = [
            "FAT 32",
            "NTFS"
        ];
        this.alertVC = null;
        this.indicatorModal = null;
        this.state = {
            isChosen: false
        };
    }

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentDidMount() {
        this.props.getUSBDisks();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _keyExtractor = (item, index) => index;

    onChangeFormatType(index, value) {
        if (!value) {
            this.state.isChosen = false;
            return;
        }
        this.state.isChosen = true;
        this.partition.fileSystemType = index + 1;
        this.callbackMessage = "";
    }

    onFormatHDD() {
        if (!this.state.isChosen) {
            return
        }
        this.indicatorModal.setState({isShow: true});
        console.log(this.partition);
        NativeModules.STBManager.setUSBFormatPartitionWithJsonString(JSON.stringify(this.partition), (error, results)=> {
            if (JSON.parse(results[0]).return === "1") {
                this.callbackMessage = "Format HDD Success";
            } else {
                this.callbackMessage = "Format HDD Failure";
            }
            this.indicatorModal.setState({isShow: false});
        });
    }

    getPartition(partitions) {
        if (partitions.length > 0) {
            let disk = partitions[partitions.length - 1];
            if (disk.partitionArr != null && disk.partitionArr.length > 0) {
                this.partition = disk.partitionArr[disk.partitionArr.length -1];
            }
        }
    }

    onDismissIndicatorModal() {
        this.alertVC.setState({isShow: true, message: this.callbackMessage});
    }

    render() {
        const {usbDisks} = this.props;

        if (!usbDisks.fetched || usbDisks.isFetching) {
            return null;
        }
        if (usbDisks.data == null || usbDisks.error) {
            return (
                <View style={styles.container}>
                    <StatusBar
                        translucent={true}
                        backgroundColor='#00000000'
                        barStyle='dark-content'/>
                    <Text style={styles.errorText}>{usbDisks.errorMessage}</Text>
                </View>
            )
        }

        this.getPartition(usbDisks.data);

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <AlertModal ref={(modal)=>{this.alertVC = modal}}/>
                <IndicatorModal ref={(modal)=>{this.indicatorModal = modal}} onDismiss={this.onDismissIndicatorModal.bind(this)}/>
                <View style={styles.listContainer}>
                    <SwitcherList data={this.data}
                                  index={-1}
                                  onSwitch={(index, value) => {
                                      this.onChangeFormatType(index, value)
                                  }}/>
                </View>

                <View style={styles.customInfoView}>
                    <Text style={styles.guideText}>Select a file system,then press button below</Text>
                    <TouchableOpacity onPress={() => this.onFormatHDD()}>
                        <Text style={styles.validateButton}>Format HDD</Text>
                    </TouchableOpacity>
                    <Text style={styles.attentionText}>Attention ! All your data on your hard disk will be deleted</Text>
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
    listContainer: {
        marginTop: 46,
        marginLeft: 32,
        marginRight: 17,
        height: 132
    },
    errorText: {
        color: colors.textDarkGrey,
        textAlign: 'center',
        marginTop: 100,
        width: '100%',
        fontSize: 20
    },
    customInfoView: {
        marginBottom: 84,
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'column',
        flex: 1
    },
    attentionText: {
        marginLeft: 30,
        marginRight: 30,
        color: '#777777',
        fontSize: 17,
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    guideText: {
        marginLeft: 30,
        marginRight: 30,
        color: '#777777',
        fontSize: 17,
        marginBottom: 200,
        textAlign: 'center',
        fontFamily: 'Helvetica Neue'
    },
    validateButton: {
        marginLeft: 70,
        marginRight: 70,
        marginBottom: 37,
        borderRadius: (Platform.OS === 'ios') ? 17 : 30,
        backgroundColor: colors.mainPink,
        fontSize: 17,
        color: colors.textWhitePrimary,
        overflow: "hidden",
        textAlign: 'center',
        paddingTop: 8,
        paddingBottom: 8
    }
});