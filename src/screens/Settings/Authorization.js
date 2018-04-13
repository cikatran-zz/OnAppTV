import React, {Component} from 'react';
import {
    FlatList,
    NativeModules,
    Platform,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {colors} from "../../utils/themeConfig";
import * as Orientation from "react-native-orientation";

export default class Privacy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminToggleState: null,
            blockedToggleState: null
        };

        this.data = [
            {
                name: "You",
                adminLevel: true,
                blocked: false
            },
            {
                name: "Valérie Camus",
                adminLevel: true,
                blocked: false
            },
            {
                name: "Agathe Camus",
                adminLevel: false,
                blocked: false
            },
            {
                name: "Auguste Camus",
                adminLevel: false,
                blocked: false
            },
            {
                name: "Claude Clavery",
                adminLevel: false,
                blocked: true
            }
        ];

        if (this.state.toggleState == null) {
            var adminToggles = {};
            var blockedToggles = {};
            for (var i = 0; i < this.data.length; i++) {
                adminToggles[this.data[i].name] = this.data[i].adminLevel;
                blockedToggles[this.data[i].name] = this.data[i].blocked;
            }
            this.state.adminToggleState = adminToggles;
            this.state.blockedToggleState = blockedToggles;
        }
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentDidMount() {

    };

    _changeBlocked(category, isChosen) {
        var toggles = this.state.blockedToggleState;
        toggles[category] = isChosen;
        this.setState({blockedToggleState: toggles});
    }

    _changeAdminLevel(category, isChosen) {
        var toggles = this.state.adminToggleState;
        toggles[category] = isChosen;
        this.setState({adminToggleState: toggles});
    }

    _renderSwitches(item) {
        if (Platform.OS == "ios") {

            return (
                <View style={styles.toggleView}>
                    <Switch value={this.state.adminToggleState[item.name] == 1} onValueChange={(value)=> this._changeAdminLevel(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>
                    <Switch value={this.state.blockedToggleState[item.name] == 1} onValueChange={(value)=> this._changeBlocked(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>
                </View>
            )
        }
        return (
            <View style={styles.toggleView}>
                <Switch value={this.state.adminToggleState[item.name] == 1} onValueChange={(value)=> this._changeAdminLevel(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} thumbTintColor={'#ffffff'}/>
                <Switch value={this.state.blockedToggleState[item.name] == 1} onValueChange={(value)=> this._changeBlocked(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} thumbTintColor={'#ffffff'}/>
            </View>)
    }

    _renderListItem = ({item}) => {
        return (
            <View style={styles.listItemContainer}>

                <Text>{item.name}</Text>
                {
                    this._renderSwitches(item)
                }
            </View>
        )
    }

    _keyExtractor = (item, index) => index;

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <View style={[styles.toggleView, {marginTop: 46, marginRight: 26}]}>
                    <Text style={{marginRight: 33}}>Admin Level</Text>
                    <Text>Blocked</Text>
                </View>
                <FlatList
                    style={styles.listContainer}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    renderItem={this._renderListItem}
                    data={this.data}
                    ItemSeparatorComponent={() => <View
                        style={{width: "100%", height: 1, backgroundColor: '#DADADE'}}/>}
                />

            </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    listContainer: {

        marginLeft: 32,
        marginBottom: 10
    },
    listItemContainer: {
        height: 43,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    toggleView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
        marginRight: 32,
    },
    toggleButton: {
        width: 45,
        height: 26,
        marginLeft: 50
    },
    itemName: {
        fontSize: 16,
        color: colors.textMainBlack,
    },
    descriptionText: {
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 84,
        fontSize: 13,
        color: colors.greyDescriptionText,
        textAlign: 'center',
    }
});