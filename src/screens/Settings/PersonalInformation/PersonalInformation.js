import React from 'react'
import {
    Text, View, StyleSheet, FlatList, StatusBar, Platform, TouchableOpacity, NativeModules
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import SettingItem from '../../../components/SettingItem'
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
        this.props.getProfile()
    }

    _renderItem = ({item}) => {

        return (
            <SettingItem item={item} showRightIcon={false}/>
        )
    };

    _keyExtractor = (item, index) => index;

    _signOut = () => {
        const {navigation} = this.props;
        NativeModules.RNUserKitIdentity.signOut();
        navigation.goBack();
    };

    render() {

        const {profile} = this.props;

        if (!profile.fetched || profile.isFetching) {
            return null;
        }



        let data = [
            {
                name: "First name",
                value: ""
            },
            {
                name: "Last name",
                value: ""
            },
            {
                name: "Email",
                value: ""
            },
            {
                name: "Age",
                value: ""
            },
            {
                name: "Gender",
                value: ""
            }
        ];

        if (profile.data != null) {
            data[0].value = profile.data.firstName;
            data[1].value = profile.data.lastName;
            data[2].value = profile.data.email;
            data[3].value = profile.data.age;
            data[4].value = profile.data.gender;
        }

        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.listContainer}
                    horizontal={false}
                    keyExtractor={this._keyExtractor}
                    data={data}
                    scrollEnabled={false}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={() => <View
                        style={{left: 0, width: "100%", height: 1, backgroundColor: '#DADADE'}}/>}
                />
                <TouchableOpacity onPress={() => this._signOut()}>
                    <Text style={styles.validateButton}>Sign out</Text>
                </TouchableOpacity>
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
    validateButton: {
        marginLeft: 70,
        marginRight: 70,
        marginBottom: 84,
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