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

export default class MyCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleState: null
        }
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentDidMount() {

    };

    _changeFavorite(category, isFavorite) {
        var toggles = this.state.toggleState;
        toggles[category] = isFavorite ? 1 : 0;
        this.setState({toggleState: toggles});
    }

    _renderSwitch(item) {
        if (Platform.OS == "ios") {
            return (<Switch value={this.state.toggleState[item.name] == 1} onValueChange={(value)=> this._changeFavorite(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>)
        }
        return (<Switch value={this.state.toggleState[item.name] == 1} onValueChange={(value)=> this._changeFavorite(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} thumbTintColor={'#ffffff'}/>)
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
    }

    _keyExtractor = (item, index) => index;

    _onUpdateFavoriteCategories = () => {
        let keys = Object.keys(this.state.toggleState);
        var favorites = []
        for (var i = 0; i < keys.length; i++) {
            if (this.state.toggleState[keys[i]]) {
                favorites.push({name: keys[i], favorite: 1});
            }
        }
        this.props.updateFavorite(favorites);
        NativeModules.RNUserKit.storeProperty("favorite_categories", this.state.toggleState, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results[0]);
            }
        });
    };

    render() {
        const {data} = this.props.navigation.state.params;
        if (!data)
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            );
        if (this.state.toggleState == null) {
            var toggles = {};
            for (var i = 0; i < data.length; i++) {
                toggles[data[i].name] = data[i].favorite;
            }
            this.state.toggleState = toggles;
        }
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
                    data={data}
                    ItemSeparatorComponent={() => <View
                        style={{width: "100%", height: 1, backgroundColor: '#DADADE'}}/>}
                />
                <TouchableOpacity onPress={() => this._onUpdateFavoriteCategories()}>
                    <Text style={styles.validateButton}>Validate</Text>
                </TouchableOpacity>
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
    },
    noInternetConnection: {
        color: colors.greyDescriptionText,
        textAlign: 'center',
        flexWrap: "wrap",
    },
});