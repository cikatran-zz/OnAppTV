import React from 'react'
import BrightcovePlayer from "../../components/BrightcovePlayer";
import Orientation from 'react-native-orientation';
import {Dimensions, NativeModules, View, findNodeHandle, StatusBar, Platform} from 'react-native'

export default class BrightcovePlayerScreen extends React.Component {
    // onLayout(e) {
    //     const {width, height} = Dimensions.get("window");
    //     if (width < height) {
    //         // const {callback} = this.props.navigation.state.params;
    //         // if (callback) callback();
    //         this.props.navigation.goBack()
    //     }
    // }

    _orientationDidChange = (orientation) => {
        console.log("PLAYER screen", orientation);
        if (orientation === 'PORTRAIT') {
            Orientation.removeSpecificOrientationListener(this._orientationDidChange);
            Orientation.lockToPortrait();
            this.props.navigation.goBack()
        } else {
            //this.setState({showBrightcove: false})
        }
    };

    componentWillMount() {
        Orientation.lockToLandscape();
    }

    componentWillUnmount() {
        Orientation.removeSpecificOrientationListener(this._orientationDidChange);
    }

    componentDidMount() {
        Orientation.addOrientationListener(this._orientationDidChange);
        Orientation.lockToLandscape();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
            Orientation.lockToLandscape();
        });
    }

    constructor(props) {
        super(props)
        this.brightcovePlayer = null;
        Orientation.lockToLandscape();
    }

    render() {
        const {videoId} = this.props.navigation.state.params;

        return (
            <View style={{backgroundColor: '#000000'}}>
                <BrightcovePlayer
                    ref={(brightcove) => this.brightcovePlayer = brightcove}
                    style={{width: '100%', height: '100%'}}
                    videoId={videoId}
                    accountId='5706818955001'
                    policyKey='BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I'
                    onFinished={(event)=>this.props.navigation.goBack()}
                />
            </View>
        )
    }

}