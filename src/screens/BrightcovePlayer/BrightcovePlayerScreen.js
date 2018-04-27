import React from 'react'
import BrightcovePlayer from "../../components/BrightcovePlayer";
import Orientation from 'react-native-orientation';
import {Dimensions, NativeModules, View, findNodeHandle} from 'react-native'

export default class BrightcovePlayerScreen extends React.Component {
    onLayout(e) {
        const {width, height} = Dimensions.get("window");
        if (width < height) {
            console.log("OnLayoutBrightcovePlayer");
            this._goBack();
        }
    }

    _goBack = ()=> {
        const {callback} = this.props.navigation.state.params;
        if (callback) callback();
        this.props.navigation.goBack()
    }

    componentDidMount() {
        const {callback} = this.props.navigation.state.params;

        if (callback) Orientation.lockToLandscape();
    }

    componentWillUnmount() {
        //NativeModules.RNBrightcove.onEmit(this.brightcovePlayer, "storeBrightCove")
    }

    constructor(props) {
        super(props)
    }

    render() {
        const {videoId} = this.props.navigation.state.params;

        return (
            <View onLayout={this.onLayout.bind(this)}>
                <BrightcovePlayer
                    ref={(brightcove) => this.brightcovePlayer = brightcove}
                    style={{width: '100%', height: '100%'}}
                    videoId={videoId}
                    accountId='5706818955001'
                    policyKey='BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I'
                    onFinished={(event)=> this._goBack()}
                />
            </View>
        )
    }

}