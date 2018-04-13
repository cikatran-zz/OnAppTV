import React from "react";
import {StyleSheet, View, Modal, Animated, Image, Dimensions, Easing, TouchableOpacity, Text} from "react-native";
import BlurView from "./BlurView";
import {getBlurRadius} from "../utils/blurRadius";
import {rootViewTopPadding} from "../utils/rootViewTopPadding";
import {colors} from "../utils/themeConfig";

export default class AlertModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            message: ""
        };
    }

    render() {
        return(
            <Modal animationType="fade"
                   transparent={true}
                   visible={this.state.isShow}
                   presentationStyle="overFullScreen"
                   onRequestClose={() => {
                       this.setState({isShow: false});
                   }}>
                <View style={styles.container}>
                    <BlurView style={styles.blurView}
                              blurRadius={getBlurRadius(50)}
                              overlayColor={1} />
                    <TouchableOpacity onPress={()=> {this.setState({isShow: false})}} style={styles.closeButton}>
                        <Image source={require("../assets/listEdit-round.png")} style={{resizeMode: 'stretch'}}/>
                    </TouchableOpacity>
                    <Text style={styles.message}>
                        {this.state.message}
                    </Text>

                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#00000075'
    },
    blurView: {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute'
    },
    closeButton: {
        marginRight: 18,
        marginTop: 30 + rootViewTopPadding(),
        marginLeft: 'auto',
        width: 44,
        height: 44
    },
    message: {
        color: colors.textWhitePrimary,
        marginHorizontal: 40,
        marginTop: 200,
        textAlign: 'center',
        fontSize: 40
    }
});