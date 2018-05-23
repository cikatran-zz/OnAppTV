import React from "react";
import {StyleSheet, Text, TouchableOpacity, Image, View, Platform} from "react-native";
import {colors} from "../utils/themeConfig";

export default class HeaderLabel extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        if (this.props.position === 'end') {
            return (
                <View style={styles.headerView}>
                    <View style={[styles.backgroundHeaderView, styles.endHeaderView]}/>
                    <Text style={styles.headerLabel}>{this.props.text.toUpperCase()}</Text>
                    {this.props.showBackButton &&
                    (<TouchableOpacity onPress={() => this.props.goBack()} style={styles.backButton}>
                        <Image source={require('../assets/ic_white_left_arrow.png')} style={styles.backImage}/>
                    </TouchableOpacity>)
                    }
                </View>

            )
        } else if (this.props.position === 'inside') {
            return (
                <View style={styles.headerView}>
                    <View style={[styles.backgroundHeaderView, styles.insideHeaderView]}/>
                    <Text style={styles.headerLabel}>{this.props.text.toUpperCase()}</Text>
                    { this.props.showBackButton &&
                    (<TouchableOpacity onPress={()=>this.props.goBack()} style={styles.backButton} >
                        <Image source={require('../assets/ic_white_left_arrow.png')} style={styles.backImage}/>
                    </TouchableOpacity>)
                    }

                </View>
            )
        } else if (this.props.position === 'begin') {
            return (
                <View style={styles.headerView}>
                    <View style={[styles.backgroundHeaderView, styles.beginHeaderView]}/>
                    <Text style={styles.headerLabel}>{this.props.text.toUpperCase()}</Text>
                    {this.props.showBackButton &&
                    (<TouchableOpacity onPress={() => this.props.goBack()} style={styles.backButton}>
                        <Image source={require('../assets/ic_left_arrow.png')} style={styles.backImage}/>
                    </TouchableOpacity>)
                    }
                </View>
            )
        } else {
            return (
                <Text >{this.props.text}</Text>
            )
        }
    }
}

const styles = StyleSheet.create({

    headerLabel: {
        fontSize: 10,
        alignSelf: 'center',
        paddingTop: 7,
        paddingBottom: 6,
        backgroundColor: colors.mainPink,
        borderRadius: (Platform.OS === 'ios') ? 13 : 25,
        overflow: "hidden",
        color: colors.whitePrimary,
        paddingHorizontal: 15,
        height: 25
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 17.5,
        marginBottom: 27,
        height: 25
    },
    backgroundHeaderView: {
        backgroundColor: colors.mainPink,
        position: 'absolute',
        top: 0,
        height: '100%'
    },
    beginHeaderView : {
        left: '50%',
        width: '50%'
    },
    endHeaderView : {
        left: 0,
        width: '50%'
    },
    insideHeaderView : {
        left: 0,
        width: '100%'
    },
    backButton: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        top: 17.5,
        left: 0,
        position: 'absolute'
    },
    backImage: {
        height: 13,
        resizeMode: 'cover'
    },
});