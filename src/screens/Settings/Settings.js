import React from 'react'
import {
    Text, View, StyleSheet, FlatList, SectionList, StatusBar, Platform
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import SettingItem from '../../components/SettingItem'
import _ from 'lodash'

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
                        icon: require('../../assets/ic_wifi.png')
                    },
                    {
                        name: "Video Format",
                        value: "4:3 Letter Box",
                        canBeNavigated: true,
                        screen: 'VideoFormat',
                        needSTB: true,
                        icon: require('../../assets/ic_wifi.png')
                    }]
            }
        ];

        this.changeableItems = {};

    }

    componentDidMount() {
        this.props.getSettings();
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
        }
    }

    _onChildChanged(value) {
        this.changeableItems[value.screen].setState({text: value.value});
    };

    _renderSettingItem = ({item}) => {
        return (<SettingItem ref={(settingItem) => {
            this.changeableItems[item.screen] = settingItem
        }} showIcon={true} icon={item.icon} item={item} onPress={() => this._navigateToItem(item)}/>)
    };

    _renderSection = ({item}) => {
        return (
            <View style={styles.container}>
                <FlatList
                    data={item}
                    renderItem={this._renderSettingItem}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={() => <View
                        style={{width: "100%", height: 1, backgroundColor: '#DADADE'}}/>}
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
                    newData[i].list[j].canBeNavigated = true;
                    newData[i].list[j].value = data[newData[i].list[j].screen];
                }
            }
        }

        this.data = newData;
    }

    render() {

        const {settings} = this.props;

        if (!settings.fetched || settings.isFetching) {
            return null;
        }

        if (settings.data == null || settings.error) {
            this._cannotConnectSTB();
        } else {
            this._configureData(settings.data);
        }

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <SectionList
                    style={styles.sectionListContainer}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    onEndReachedThreshold={20}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    sections={[
                        {
                            data: [this.data[0].list],
                            showHeader: true,
                            title: this.data[0].title,
                            renderItem: this._renderSection
                        }
                    ]}
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
        marginLeft: 15,
        marginRight: 15
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