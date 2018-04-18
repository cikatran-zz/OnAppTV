import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform
} from 'react-native'
import {colors} from '../utils/themeConfig'
import _ from 'lodash'

export default class SwitcherList extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            switchStates: []
        }

    }

    componentWillReceiveProps() {
        console.log("New props",this.props.index)
    }

    onSwitchItem(index, value) {
        let newStates = _.cloneDeep(this.state.switchStates);
        _.fill(newStates, false);
        newStates[index] = value;
        this.setState({switchStates: newStates});
        this.props.onSwitch(index, value);
    }

    componentDidMount() {
        this.updateInitIndex(this.props.index);
    }

    updateInitIndex(index) {
        let newStates = _.times(this.props.data.length, false);
        _.fill(newStates, false);

        if (index != -1) {
            newStates[index] = true;
        }
        this.setState({switchStates: newStates});
    }

    _renderSwitch(index) {
        if (Platform.OS == "ios") {
            return (<Switch value={this.state.switchStates[index]} onValueChange={(value) => this.onSwitchItem(index, value)}
                            style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}/>)
        }
        return (<Switch value={this.state.switchStates[index]} onValueChange={(value) => this.onSwitchItem(index, value)}
                        style={styles.toggleButton} onTintColor={colors.mainPink} tintColor={'#E2E2E2'}
                        thumbTintColor={'#ffffff'}/>)
    }

    _renderListItem = ({item, index}) => {
        return (
            <View style={styles.listItemContainer}>
                <Text>{item}</Text>
                {
                    this._renderSwitch(index)
                }

            </View>
        )
    };

    _keyExtractor = (item, index) => index;

    render() {

        return (
            <FlatList
                style={this.props.style}
                keyExtractor={this._keyExtractor}
                horizontal={false}
                renderItem={this._renderListItem}
                data={this.props.data}
                scrollEnabled={false}
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