import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import SettingItem from '../../components/SettingItem'
import * as Orientation from "react-native-orientation";

export default class PersonalInformation extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    }

    _renderItem = ({item}) => {

        return (<SettingItem item={item}/>)
    };

    _keyExtractor = (item, index) => index

    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.listContainer}
                    horizontal={false}
                    keyExtractor={this._keyExtractor}
                    data={fakeData.list}
                    scrollEnabled={false}
                    renderItem={this._renderItem}
                />
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
        marginTop: 60,
        marginLeft: 32,
        marginRight: 17
    },
})

const fakeData = {
    title: "ON TV",
    list: [
        {
            name: "First Name",
            value: "Jean"
        },
        {
            name: "Last Name",
            value: "Camus"
        },
        {
            name: "Date of Birth",
            value: "05/10/1985"
        },
        {
            name: 'Account Number',
            value: '06X223YT-2017'
        },
        {
            name: 'Billing Address 1',
            value: '35 Avenue Rap'
        },
        {
            name: 'Billing Address 2',
            value: '75007 Paris'
        }]
}