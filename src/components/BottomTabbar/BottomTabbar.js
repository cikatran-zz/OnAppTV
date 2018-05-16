import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View, NativeModules} from 'react-native'
import PropTypes from 'prop-types'
import {colors} from '../../utils/themeConfig'
import BlurView from '../BlurView'
import LottieView from 'lottie-react-native';

const tabs = [
    'Home',
    'Zappers',
    'Video',
    'Book',
    'Setting',
];



class BottomTabbar extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            isPlaying: true
        }
    }

    componentDidMount() {
        setInterval(() => {
            NativeModules.STBManager.isConnect((connectStr) => {
                let json = JSON.parse(connectStr).is_connected
                if (json === true) {
                    NativeModules.STBManager.getSTBStatus((error, events) => {
                        try {
                            let result = JSON.parse(events[0]);
                            if (result['return'] === "1") {
                                if (result['statuses'].length === 0 || (result['status'])['ACTIVE_STANDBY'] === undefined || (result['status'])['ACTIVE_STANDBY'] === null) {
                                    this.setState({
                                        isPlaying: false
                                    })
                                    this.animation.reset();
                                }
                                else {
                                    this.setState({
                                        isPlaying: true
                                    })
                                    this.animation.play();
                                }
                            }
                            else {
                                this.setState({
                                    isPlaying: false
                                })
                                this.animation.reset();
                            }
                        }
                        catch (e) {
                            console.log('Error when reading STB status');
                        }

                    })
                }
                else {
                    this.setState({
                        isPlaying: false
                    })
                    this.animation.reset();
                }
            })
        }, 2000);
    }
    _renderTab = (tab, i) => {
        const {navigation} = this.props;
        let {index} = navigation.state;
        if (i == 2) {
            return (
                <TouchableOpacity
                    onPress={() => console.log('click')}
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

                        if (navigation.state.index != tabIndex) {
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
        position:'absolute',
        right: 0,
        left: 0,
        bottom:0,
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
        right:0,
        height: '100%'
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'transparent'
    },
    tabTextActive: {
        color: colors.mainPink,
        fontSize: 11,
        backgroundColor:'transparent'
    },
    tabTextInActive: {
        color: colors.textWhitePrimary,
        fontSize: 11,
        backgroundColor:'transparent'
    }
})
BottomTabbar.propTypes = {
    navigation: PropTypes.object.isRequired
}

export default BottomTabbar