import React from "react";
import {StyleSheet, View, Modal, Animated, Image, Dimensions, Easing, TouchableOpacity, Text} from "react-native";
import BlurView from "../../../components/BlurView";
import {getBlurRadius} from "../../../utils/blurRadius";
import Carousel from 'react-native-snap-carousel';

export default class ChannelModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            currentIndex: 0,
            currentTitle: "",
            currentDescription: "",
            currentFavorite: "Favorite"
        };
        this.animationY = new Animated.Value(-Dimensions.get("window").height*0.5);
        this.carousel = null;
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



    _renderItem ({item, index}) {
        var image = 'https://www.roku.com/s/1522196307792/showcase_the-roku-channel/the-roku-channel.jpg'
        if (item.image != undefined) {
            image = item.image;
        }
        return (
            <View style={{width: 170, height: 170}}>
                <Image source={{uri: image}}
                       style={styles.channelItem}/>
            </View>
        );
    }

    _onSnapItem = (index) => {
        this.setState({currentTitle: this.props.channels[index].serviceName,
            currentDescription: this.props.channels[index].shortDescription,
            currentFavorite: (this.props.channels[index].favorite == 0) ? "Favorite" : "Unfavorite"});
        this.state.currentIndex = index;
    };

    _onFavoriteClick = () => {

        this.props.onFavoriteItem(this.props.channels[this.state.currentIndex].serviceID, (this.state.currentFavorite == "Favorite") ? true : false);
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
                            <Image source={require('../../../assets/ic_up_arrow.png')} style={{width: '50%', height: '100%', resizeMode: 'center', alignSelf: 'center'}}/>
                        </TouchableOpacity>
                        <Carousel
                            ref={(carousel) => this.carousel = carousel}
                            firstItem={this.state.currentIndex}
                            data={this.props.channels}
                            renderItem={this._renderItem}
                            sliderWidth={Dimensions.get("window").width}
                            itemWidth={170}
                            layout={'default'}
                            layoutCardOffset={30}
                            onSnapToItem={(slideIndex)=> {this._onSnapItem(slideIndex)}}
                        />
                        <Text style={styles.serviceName}>{this.state.currentTitle}</Text>
                        <Text style={styles.serviceDescription}>{this.state.currentDescription}</Text>
                        <View style={styles.controlView}>
                            <TouchableOpacity style={styles.upperTouch} onPress={this._onFavoriteClick}>
                                <Text style={styles.controlItem}>{this.state.currentFavorite}</Text>
                            </TouchableOpacity>
                            <View style={styles.line}/>
                            <TouchableOpacity style={styles.lowerTouch}>
                                <Text style={styles.controlItem}>Block</Text>
                            </TouchableOpacity>
                        </View>
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
        position: "absolute"
    },
    upArrow: {
        alignSelf: 'center',
        justifyContent: 'center',
        top: 0,
        width: 50,
        height: 20,
    },
    channelItem: {
        width: 130,
        height: 130,
        top: 25,
        resizeMode: 'stretch',
        alignSelf: 'center',
        borderRadius: 22,
        overflow: "hidden"
    },
    serviceName: {
        color: "#ffffff",
        alignSelf: 'center',
        fontSize: 20,
        top: 10
    },
    serviceDescription: {
        color: "#E3DFDF",
        alignSelf: 'center',
        fontSize: 16,
        marginTop: 26
    },
    controlView: {
        top: 30,
        borderRadius: 13,
        overflow: "hidden",
        backgroundColor: "#ffffff30",
        marginLeft: 45,
        marginRight: 45,
        paddingHorizontal: 25
    },
    controlItem: {
        color: "#ffffff",
        alignSelf: 'center',
        fontSize: 16,
    },
    line: {
        backgroundColor: "#ffffff0D",
        height: 2,
        width: "100%"
    },
    upperTouch: {
        width: "100%",
        paddingTop: 25,
        paddingBottom: 18
    },
    lowerTouch: {
        width: "100%",
        paddingTop: 18,
        paddingBottom: 25
    }
});