import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform
} from 'react-native'
import { colors } from '../utils/themeConfig'
import _ from 'lodash'

export default class ChoosingScreen extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            switchStates: [

            ]
        }

    }

    componentDidMount() {
         this.state.switchStates = _.times(this.props.data.length, false);
         this.state.switchStates[this.props.index] = true;
    }

    onSwitchItem(index){
        _.fill(this.state.switchStates, false);
        this.state.switchStates[index] = true;
        this.props.onSwitch(index);
    }

    _renderSwitch(item, index) {
        if (Platform.OS == "ios") {
            return (<Switch value={this.state.switchStates[index]} onValueChange={(value)=> this.onSwitchItem(index)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>)
        }
        return (<Switch value={this.state.switchStates[index]} onValueChange={(value)=> this.onSwitchItem(index)} style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} thumbTintColor={'#ffffff'}/>)
    }

    _renderListItem = ({item, index}) => {
        return (
            <View style={styles.listItemContainer}>
                <Text>{item.title}</Text>
                {
                    this._renderSwitch(item, index)
                }

            </View>
        )
    }

    _keyExtractor = (item, index) => index

    render() {

        return (
            <FlatList
                style={{...this.props.style}}
                keyExtractor={this._keyExtractor}
                horizontal={false}
                renderItem={this._renderListItem}
                data={this.props.data}
                ItemSeparatorComponent={() => <View
                    style={{width: "100%", height: 1, backgroundColor: '#DADADE'}}/>}
            />
        )
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
        marginRight: 17
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
        marginRight: 17
    },
    itemName: {
        fontSize: 16,
        color: colors.textMainBlack,
    }
});