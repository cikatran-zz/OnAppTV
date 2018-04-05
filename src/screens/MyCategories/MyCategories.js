import React, {Component} from 'react';
import {NativeModules, Platform, StyleSheet, Switch, FlatList, View, StatusBar, Text, TouchableOpacity} from "react-native";
import {colors} from "../../utils/themeConfig";

export default class MyCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleState: null
        }
    };

    componentWillMount() {
        //Orientation.lockToPortrait();
    }

    componentDidMount() {

    };

    _changeFavorite(category, isFavorite) {
        var toggles = this.state.toggleState;
        toggles[category] = isFavorite;
        this.setState({toggleState: toggles});
    }

    _renderSwitch(item) {
        if (Platform.OS == "ios") {
            return (<Switch value={this.state.toggleState[item.name]} onValueChange={(value)=> this._changeFavorite(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>)
        }
        return (<Switch value={item.favorite} onValueChange={(value)=> this._changeFavorite(item.name, value)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} thumbTintColor={'#ffffff'}/>)
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

    _onUpdateFavoriteCategories = ()=> {
        const {updateFavorite} = this.props.navigation.state.params;
        let keys = Object.keys(this.state.toggleState);
        var favorites = []
        for(var i=0; i<keys.length; i++) {
            if (this.state.toggleState[keys[i]]) {
                favorites.push({name: keys[i], favorite: true});
            }
        }
        updateFavorite(favorites);
        NativeModules.RNUserKit.storeProperty("favorite_categories", this.state.toggleState, (error, results)=> {
            if (error) {
                console.log(error);
            } else {
                console.log(results[0]);
            }
        });
    };

    render() {
        const {data} = this.props.navigation.state.params;
        if (this.state.toggleState == null) {
            var toggles = {};
            for (var i = 0; i < data.length; i++) {
                toggles[data[i].name] = data[i].favorite;
            }
            this.state.toggleState = toggles;
            console.log(toggles);
        }
        return(
            <View style={styles.container}>
            <StatusBar/>
            <FlatList
                style={styles.listContainer}
                keyExtractor={this._keyExtractor}
                horizontal={false}
                renderItem={this._renderListItem}
                data={data}
                ItemSeparatorComponent={ () => <View style={{ width: "100%", height: 1, backgroundColor: '#DADADE'}}/> }
            />
            <TouchableOpacity onPress={()=> this._onUpdateFavoriteCategories()}>
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
    }
});