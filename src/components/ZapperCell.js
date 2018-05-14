import React from 'react'
import {
    StyleSheet, Image, View, Text, Platform, TouchableOpacity
} from 'react-native'
import colors from '../utils/themeConfig'
class ZapperCell extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={this.props.style}>
                <View style={styles.placeHolder}>
                    <Text style={styles.textPlaceHolder}>On App TV</Text>
                </View>
                <Image source={{uri: this.props.image}} style={styles.icon}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    icon: {
        overflow: "hidden",
        borderRadius: 22,
        resizeMode: 'stretch',
        width: '100%',
        height: '100%',
        top:0,
        left: 0,
        position: 'absolute'
    },
    placeHolder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        borderWidth: 0.5,
        borderColor: colors.textGrey,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPlaceHolder: {
        color: colors.textGrey
    }
});

export default ZapperCell;
