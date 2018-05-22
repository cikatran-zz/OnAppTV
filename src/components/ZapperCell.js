import React from 'react'
import {
    StyleSheet, Image, View, Text, Platform, TouchableOpacity
} from 'react-native'
import {colors} from '../utils/themeConfig'
class ZapperCell extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={this.props.style} renderToHardwareTextureAndroid={true}>
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
        borderRadius: Platform.OS === 'ios' ? 11 : 22,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        top:0,
        left: 0,
        position: 'absolute'
    },
    placeHolder: {
        position: 'absolute',
        overflow: "hidden",
        top: 0.5,
        left: 0.5,
        right: 0.5,
        bottom: 0.5,
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
