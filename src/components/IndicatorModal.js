import React from "react";
import {StyleSheet, View, Modal, Animated, Image, Dimensions, Easing, TouchableOpacity, Text} from "react-native";
import BlurView from "./BlurView";
import {getBlurRadius} from "../utils/blurRadius";
import {rootViewTopPadding} from "../utils/rootViewPadding";
import {colors} from "../utils/themeConfig";
import {DotsLoader} from 'react-native-indicator';

export default class IndicatorModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            message: ""
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isShow === false && this.state.isShow === true) {
            this.props.onDismiss();
        }
        return true;
    }

    render() {
        return(
            <Modal animationType="fade"
                   transparent={true}
                   visible={this.state.isShow}
                   presentationStyle="overFullScreen"
                   onDismiss={()=> this.props.onDismiss()}
                   onRequestClose={() => {}}>>
                <View style={styles.container}>
                    <BlurView style={styles.blurView}
                              blurRadius={getBlurRadius(50)}
                              overlayColor={0x75000000} />
                    <View style={styles.dots}>
                        <DotsLoader color={colors.textWhitePrimary} size={20} betweenSpace={10}/>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#00000075',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blurView: {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute'
    },
    dots: {
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
});