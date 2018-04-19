import React from 'react'
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native'
import {colors} from '../utils/themeConfig'

export default class SettingItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
    }

    _renderIcon = (showIcon) => {
        if (showIcon) return <Image source={this.props.icon} style={styles.settingItemIcon}/>
        else return null
    };

    componentDidMount() {
        this.setState({text: this.props.item.value});
    }

    render() {
        const {onPress, item, showIcon, showRightIcon} = this.props;

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.settingItemContainer}>
                    {this._renderIcon(showIcon)}
                    <Text style={styles.settingItemName}>{item.name}</Text>
                    <View style={styles.rightItems}>
                        <Text
                            style={[styles.settingItemValue, {marginRight: showRightIcon ? 12 : 0}]}>{this.state.text}</Text>
                        {showRightIcon &&
                        <Image source={require('../assets/ic_right_arrow.png')}/>
                        }
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    settingItemContainer: {
        width: '100%',
        flexDirection: 'row',
        height: 43,
        alignItems: 'center'
    },
    settingItemName: {
        fontSize: 16,
        color: 'black'
    },
    settingItemValue: {
        fontSize: 14,
        color: colors.greySettingItemText
    },
    settingItemIcon: {
        marginRight: 23
    },
    rightItems: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
        marginRight: 15
    }
});