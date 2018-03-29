import React from "react";
import {StyleSheet, View, Modal, Animated, Image, Dimensions, Easing, TouchableOpacity} from "react-native";
import BlurView from "../../../components/BlurView";
import {getBlurRadius} from "../../../utils/blurRadius";

export default class ChannelModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
        };
        this.animationY = new Animated.Value(-Dimensions.get("window").height*0.5);
    }

    toggleModal = () => {

        // Show animation view
        if (this.state.isShow == false) {
            Animated.timing(
                this.animationY,
                {
                    toValue: Dimensions.get("window").height * 0.4,
                    duration: 500,
                    easing: Easing.linear
                }
            ).start();
            this.setState({isShow: !this.state.isShow});
        } else { // Hide animation view
            Animated.timing(
                this.animationY,
                {
                    toValue: -Dimensions.get("window").height * 0.5,
                    duration: 400,
                    easing: Easing.linear
                }
            ).start(()=> {
                this.setState({isShow: !this.state.isShow});
            });
        }

    };

    render() {
        return(
            <Modal animationType="fade"
                   transparent={true}
                   visible={this.state.isShow}
                   presentationStyle="overFullScreen"
                   onRequestClose={() => {
                       this.setState({isShow: !this.state.isShow});
                   }}>
                <View style={styles.container}>
                    <BlurView style={styles.blurView}
                              blurRadius={getBlurRadius(50)}
                              overlayColor={1} />
                    <Animated.View style={[...styles.animationView, {transform: [{translateY: this.animationY}]}]}>
                        <TouchableOpacity style={styles.upArrow} onPress={this.toggleModal}>
                            <Image source={require('../../../assets/ic_up_arrow.png')} style={{width: '50%', height: '50%', resizeMode: 'stretch', alignSelf: 'center'}}/>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    blurView: {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute'
    },
    animationView: {
        width: '100%',
        height: '50%',
        left: 0,
        justifyContent: 'center',
        backgroundColor: "#ff0000",
        position: "absolute"
    },
    upArrow: {
        alignSelf: 'center',
        justifyContent: 'center',
        // position: 'absolute',
        top: 0,
        width: 50,
        height: 20,
    }
});