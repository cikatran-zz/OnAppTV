import React from 'react'
import {
    Text, View, StyleSheet, FlatList, SectionList, StatusBar, Platform, Dimensions
} from 'react-native'
import SettingItem from '../../components/SettingItem'

export default class STBSelfTests extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
        this.data = [
            {
                name: "Tuner",
                value: "OK"
            },
            {
                name: "HDMI",
                value: "OK"
            },
            {
                name: "Smartcard",
                value: "OK"
            },
            {
                name: "USB port",
                value: "OK"
            },
            {
                name: "Main chipset",
                value: "OK"
            },
        ];

    }

    componentDidMount() {
    }

    _keyExtractor = (item, index) => index;

    _renderSettingItem = ({item}) => {
        return (<SettingItem showIcon={false} showRightIcon={true} item={item}
                             onPress={() => {}}/>)
    };

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <FlatList
                    style={styles.sectionListContainer}
                    data={this.data}
                    renderItem={this._renderSettingItem}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={() => <View
                        style={{width: "100%", height: 1, backgroundColor: '#DADADE'}}/>}
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
        marginLeft: 30,
        marginRight: 15,
        marginTop: 60
    },
});