import React from 'react'
import {
    StyleSheet, Image, View, Text, Platform, TouchableOpacity
} from 'react-native'

class ZapperCell extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={this.props.style}>
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
    }
});

export default ZapperCell;
