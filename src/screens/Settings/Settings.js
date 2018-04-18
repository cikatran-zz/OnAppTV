import React from 'react'
import {
    Text, View, StyleSheet, FlatList, SectionList, StatusBar, Platform, Dimensions
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import SettingItem from '../../components/SettingItem'
import _ from 'lodash'
import STBSelfTests from "./STBSelfTests";
import AlertModal from "../../components/AlertModal";

export default class Settings extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
        this.data = [
            {
                title: "ON TV",
                list: [
                    {
                        name: "Audio Language",
                        value: "English",
                        canBeNavigated: true,
                        screen: 'AudioLanguage',
                        needSTB: true,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "Subtitles",
                        value: "Off",
                        canBeNavigated: true,
                        screen: 'Subtitles',
                        needSTB: true,
                        icon: require('../../assets/ic_subtitle_black.png')
                    },
                    {
                        name: "Resolution",
                        value: "1080P",
                        canBeNavigated: true,
                        screen: 'Resolution',
                        needSTB: true,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Video Format",
                        value: "4:3 Letter Box",
                        canBeNavigated: true,
                        screen: 'VideoFormat',
                        needSTB: true,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "Parental Control",
                        value: "",
                        canBeNavigated: true,
                        screen: 'ParentalControl',
                        needSTB: true,
                        icon: require('../../assets/settings-lock.png')
                    },
                ]
            },
            {
                title: "ON ACCOUNT",
                list: [
                    {
                        name: "My personal information",
                        value: "",
                        canBeNavigated: true,
                        screen: 'PersonalInformation',
                        needSTB: false,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "My messages",
                        value: "",
                        canBeNavigated: true,
                        screen: 'Messages',
                        needSTB: false,
                        icon: require('../../assets/settings-number1.png')
                    },
                    {
                        name: "Privacy",
                        value: "Share my view",
                        canBeNavigated: true,
                        screen: 'Privacy',
                        needSTB: false,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Authorization",
                        value: "",
                        canBeNavigated: true,
                        screen: 'Authorization',
                        needSTB: false,
                        icon: require('../../assets/settings-lock.png')
                    },
                ]
            },
            {
                title: "ON SUPPORT",
                list: [
                    {
                        name: "Antenna configuration",
                        value: "",
                        canBeNavigated: true,
                        screen: 'AtennaTests',
                        needSTB: true,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Decoder self-check",
                        value: "",
                        canBeNavigated: true,
                        screen: 'STBSelfTests',
                        needSTB: false,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "Rights in my decoder",
                        value: "",
                        canBeNavigated: true,
                        screen: 'SelectOperator',
                        needSTB: false,
                        icon: require('../../assets/settings-number1.png')
                    },
                    {
                        name: "Format Hard Disk",
                        value: "",
                        canBeNavigated: true,
                        screen: 'FormatHDD',
                        needSTB: true,
                        icon: require('../../assets/ic_wifi.png'),
                        errorMessage: "No hard disk exists"
                    },
                    {
                        name: "Timeshift max size on Hard Disk",
                        value: "",
                        canBeNavigated: true,
                        screen: 'TimeShiftConfig',
                        needSTB: true,
                        icon: require('../../assets/ic_wifi.png')
                    },
                ]
            },
            {
                title: "ABOUT ON",
                list: [
                    {
                        name: "ON-MAD Version",
                        value: "1.0",
                        canBeNavigated: false,
                        screen: '',
                        needSTB: false,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Wifi",
                        value: "Not found",
                        canBeNavigated: false,
                        screen: 'WIFI',
                        needSTB: false,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "Manufacturer ID",
                        value: "",
                        canBeNavigated: false,
                        screen: 'ManufacturerID',
                        needSTB: true,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Model ID",
                        value: "50",
                        canBeNavigated: false,
                        screen: '',
                        needSTB: false,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "Serial Number",
                        value: "70550295000010",
                        canBeNavigated: false,
                        screen: '',
                        needSTB: false,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Hardware version",
                        value: "",
                        canBeNavigated: false,
                        screen: 'HardwareVersion',
                        needSTB: true,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "Boot Loader version",
                        value: "",
                        canBeNavigated: false,
                        screen: 'BootLoaderVersion',
                        needSTB: true,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "STB software version",
                        value: "",
                        canBeNavigated: false,
                        screen: 'STBSoftwareVersion',
                        needSTB: true,
                        icon: require('../../assets/settings-numberthree.png')
                    },
                    {
                        name: "Decoder ID",
                        value: "",
                        canBeNavigated: false,
                        screen: 'DecoderID',
                        needSTB: true,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Smartcard",
                        value: "10056144",
                        canBeNavigated: false,
                        screen: '',
                        needSTB: false,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "ACS",
                        value: "5841-6.1.0.9-AS+SC-E80050",
                        canBeNavigated: false,
                        screen: '',
                        needSTB: false,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Hard Disk file system",
                        value: "",
                        canBeNavigated: false,
                        screen: 'HardDiskFile',
                        needSTB: true,
                        icon: require('../../assets/settings-lock.png')
                    },
                    {
                        name: "Hard Disk size",
                        value: "",
                        canBeNavigated: false,
                        screen: 'HardDiskTotalSize',
                        needSTB: true,
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "Hard Disk size available",
                        value: "",
                        canBeNavigated: false,
                        screen: 'HardDiskFreeSize',
                        needSTB: true,
                        icon: require('../../assets/settings-lock.png')
                    },
                ]
            }
        ];

        this.changeableItems = {};
        this.alertVC = null;
    }

    componentDidMount() {
        this.props.getSettings();
        this.props.getWifiInfo();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _keyExtractor = (item, index) => index;

    _navigateToItem(item) {
        const {navigation} = this.props;
        if (item.canBeNavigated) {
            navigation.navigate(item.screen, {onChange: this._onChildChanged.bind(this)})
        } else if (item.errorMessage != null) {
            this._showModal(item.errorMessage);
        }
    }

    _onChildChanged(value) {
        this.changeableItems[value.screen].setState({text: value.value});
    };

    _renderSettingItem = ({item}) => {
        return (<SettingItem ref={(settingItem) => {
            this.changeableItems[item.screen] = settingItem
        }} showIcon={true} showRightIcon={item.canBeNavigated} icon={item.icon} item={item}
                             onPress={() => this._navigateToItem(item)}/>)
    };

    _renderSection = ({item}) => {
        return (
            <View style={styles.container}>
                <FlatList
                    data={item}
                    renderItem={this._renderSettingItem}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={() => <View
                        style={{left: 45, width: "100%", height: 1, backgroundColor: '#DADADE'}}/>}
                />
            </View>
        )
    };

    _renderSectionHeader = ({section}) => {
        if (section.showHeader) {
            return (
                <View style={styles.headerSectionContainer}>
                    <PinkRoundedLabel text={section.title} style={styles.headerSection}/>
                </View>
            )
        } else {
            return null;
        }
    };

    _cannotConnectSTB() {
        let newData = _.cloneDeep(this.data);
        for (let i = 0; i < newData.length; i++) {
            for (let j = 0; j < newData[i].list.length; j++) {
                if (newData[i].list[j].needSTB) {
                    newData[i].list[j].canBeNavigated = false;
                    newData[i].list[j].value = "No STB Connected";
                }
            }
        }

        this.data = newData;
    }

    _configureData(data) {
        let newData = _.cloneDeep(this.data);
        for (let i = 0; i < newData.length; i++) {
            for (let j = 0; j < newData[i].list.length; j++) {
                if (newData[i].list[j].needSTB) {
                    newData[i].list[j].value = data[newData[i].list[j].screen];
                }
            }
        }

        this.data = newData;
    }

    _renderListFooter = () => (
        <View style={{
            width: '100%',
            height: Dimensions.get("window").height * 0.08 + 20,
            backgroundColor: 'transparent'
        }}/>
    );

    _showModal = (message) => {
        this.alertVC.setState({isShow: true, message: message});
    };

    render() {

        const {settings, wifi} = this.props;

        if (!settings.fetched || settings.isFetching || !wifi.fetched || wifi.isFetching) {
            return null;
        }

        if (settings.data == null || settings.error) {
            this._cannotConnectSTB();
        } else {
            this._configureData(settings.data);
        }

        if (wifi.data != null) {
            let newData = _.cloneDeep(this.data);
            newData[3].list[1].value = (wifi.data.SSID == null) ? "Not found" : wifi.data.SSID;
            if (settings.data == null || settings.data.HardDiskFile !== "") {
                newData[2].list[3].errorMessage = null;
                newData[2].list[3].canBeNavigated = true;
            } else {
                newData[2].list[3].errorMessage = "No hard disk exists";
                newData[2].list[3].canBeNavigated = false;
            }
            this.data = newData;
        }

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <AlertModal ref={(modal)=>{this.alertVC = modal}}/>
                <SectionList
                    style={styles.sectionListContainer}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    onEndReachedThreshold={20}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={this._renderListFooter}
                    bounces={false}
                    sections={this.data.map((section) => {
                        return {
                            data: [section.list],
                            showHeader: true,
                            title: section.title,
                            renderItem: this._renderSection
                        }
                    })}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    sectionListContainer: {
        marginLeft: 15
    },
    headerSection: {
        fontSize: 10,
        color: colors.whitePrimary
    },
    headerSectionContainer: {
        flexDirection: 'row',
        marginBottom: 10
    }
});