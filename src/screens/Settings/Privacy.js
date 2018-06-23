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
import {rootViewTopPadding} from "../../utils/rootViewPadding";

export default class Privacy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleState: null
        };

        this.data = [
            {
                name: "Share my view with my friends",
                isChosen: true
            },
            {
                name: "Recommandations",
                isChosen: true
            },
            {
                name: "Targetted advertising",
                isChosen: false
            },
            {
                name: "Channel notification",
                isChosen: true
            },
            {
                name: "Bookmark notification",
                isChosen: true
            }
        ];

        if (this.state.toggleState == null) {
            var toggles = {};
            for (var i = 0; i < this.data.length; i++) {
                toggles[this.data[i].name] = this.data[i].isChosen;
            }
            this.state.toggleState = toggles;
        }
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    };

    componentWillUnmount() {
        this._navListener.remove();
    }


    _changePrivacy(category, isChosen) {
        var toggles = this.state.toggleState;
        toggles[category] = isChosen;
        this.setState({toggleState: toggles});
    }

    _renderSwitch(item) {
        if (Platform.OS == "ios") {
            return (<Switch value={this.state.toggleState[item.name] == 1} onValueChange={(value)=> this._changePrivacy(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>)
        }
        return (<Switch value={this.state.toggleState[item.name] == 1} onValueChange={(value)=> this._changePrivacy(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} thumbTintColor={'#ffffff'}/>)
    }

    _renderListItem = ({item}) => {
        return (
            <View style={styles.listItemContainer}>
                <Text>{item.name}</Text>
                {
                    this._renderSwitch(item)
                }

            </View>
        )
    };

    _keyExtractor = (item, index) => index;

    _navigateToTC() {
        const {navigation} = this.props;
        navigation.navigate('TermAndCondition');
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <FlatList
                    style={styles.listContainer}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    renderItem={this._renderListItem}
                    data={this.data}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View
                        style={{width: "100%", height: 1, backgroundColor: '#DADADE', opacity: 0.3}}/>}
                />
                <TouchableOpacity onPress={()=> this._navigateToTC()}>
                    <Text style={styles.descriptionText}>By authorizing notification, you will enjoy {"\n"}additionnal services provided by the{"\n"}channels for additional services related to{"\n"}the channels you are watching.</Text>
                </TouchableOpacity>
            </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    listContainer: {
        marginTop: 46,
        marginLeft: 32,
        marginBottom: 10
    },
    listItemContainer: {
        height: 43,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    toggleButton: {
        width: 45,
        height: 26,
        marginLeft: 'auto',
        marginRight: 32
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
        fontFamily: 'Helvetica Neue'
    }
});