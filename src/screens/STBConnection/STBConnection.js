/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import STBConnectionView from '../../components/STBConnectionView'
import Orientation from 'react-native-orientation';

export default class STBConnection extends Component {



    constructor(props) {
        super(props);
    };

    componentWillMount() {
        //Orientation.lockToPortrait();
    }

    _onFinished = (event) => {
        console.log("Test finish");
    }

    render() {
        const { navigate } = this.props.navigation;
        return (

            <STBConnectionView style={{width: '100%', height: '100%', left: 0, top: 0}} onFinished={(event) =>
                navigate('Home', {})
            }>

            </STBConnectionView>
        );
    }
}

const styles = StyleSheet.create({
});
