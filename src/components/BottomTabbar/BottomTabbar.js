import React, {Component} from 'react'
import {
    StyleSheet, Text, TouchableOpacity, View, NativeModules, DeviceEventEmitter, Modal, Platform,
    NativeEventEmitter
} from 'react-native'
import PropTypes from 'prop-types'
import {colors} from '../../utils/themeConfig'
import BlurView from '../BlurView'
import LottieView from 'lottie-react-native';

const {RNConnectionViewModule, STBManager} = NativeModules;

const tabs = [
    'Home',
    'Zappers',
    'Video',
    'Book',
    'Setting',
];

let checkSTBInterval;

class BottomTabbar extends Component {
    animation = null;

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: true
        };
    }

    componentDidMount() {
        STBManager.getSTBStatus((error, events) => {
            let statuses = JSON.parse(events[0])['statuses'];
            if (statuses.length !== 0)
                this._playAnimation();
        });


        DeviceEventEmitter.addListener('statusEvent',this._handleStatusEvent);
        DeviceEventEmitter.addListener('disconnectEvent',this._handleDisconnectEvent);
        if (Platform.OS === "ios") {
            const stbEmitter = new NativeEventEmitter(STBManager);
            stbEmitter.addListener("statusEvent", (event)=> this._handleStatusEvent(event));
            stbEmitter.addListener("disconnectEvent", this._handleDisconnectEvent)
        }
    }

    _handleStatusEvent = (e) => {
        const {data} = e;

        if (data !== undefined) {

            switch (data) {
                case 9:
                    this._resetAnimation();
                    break;
                case 8:
                    this._playAnimation();
                    break;
                case 3:
                    this._resetAnimation();
                    break;
                case 2:
                    this._playAnimation();
                    break;
                default:
                    this._playAnimation();
            }
        }
    };

    _handleDisconnectEvent = (e) => {
        console.log("Disconnect");
    };

    componentWillUnmount() {
        clearInterval(checkSTBInterval)
    }

    _resetAnimation() {
        if (this.animation != null)
            this.animation.reset();
    }

    _playAnimation() {
        if (this.animation != null)
            this.animation.play();
    }

    _renderTab = (tab, i) => {
        const {navigation} = this.props;
        let {index} = navigation.state;
        if (i == 2) {
            return (
                <TouchableOpacity
                    onPress={() => console.log('click')}
                    onLongPress={() => (Platform.OS === "ios") && RNConnectionViewModule.show()}
                    style={styles.tab}
                    key={tab}
                >
                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        source={require('../../assets/power_btn.json')}
                    />
                </TouchableOpacity>
            )
        } else {
            if (i > 2)
                index++;
            let isActive = i === index;
            return (
                <TouchableOpacity
                    onPress={() => {
                        let tabIndex = tabs.indexOf(tab);
                        if (tabIndex > 2) {
                            tabIndex -= 1;
                        }

                        if (navigation.state.index !== tabIndex) {
                            navigation.navigate(tab);
                        } else {
                            navigation.popToTop();
                        }
                    }}
                    style={styles.tab}
                    key={tab}
                >
                    <Text style={isActive ? styles.tabTextActive : styles.tabTextInActive}>{tab}</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <BlurView blurRadius={100} overlayColor={1} style={styles.blurview}/>
                {tabs.map((tab, i) =>
                    this._renderTab(tab, i)
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: colors.greyOpacity,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        height: '8%'
    },
    blurview: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%'
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    tabTextActive: {
        color: colors.mainPink,
        fontSize: 11,
        backgroundColor: 'transparent'
    },
    tabTextInActive: {
        color: colors.textWhitePrimary,
        fontSize: 11,
        backgroundColor: 'transparent'
    }
})
BottomTabbar.propTypes = {
    navigation: PropTypes.object.isRequired
}

export default BottomTabbar