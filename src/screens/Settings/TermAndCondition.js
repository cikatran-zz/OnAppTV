import React, {Component} from 'react';
import {
    FlatList,
    NativeModules,
    Platform,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    Image, ScrollView
} from "react-native";
import {colors} from "../../utils/themeConfig";
import * as Orientation from "react-native-orientation";
import {rootViewTopPadding} from "../../utils/rootViewPadding";

const text = "ACCEPTING THE MOBILE APPS GENERAL TERMS AND CONDITIONS\n" +
    "By using an ON-MAD application, hereinafter referred to as “the App”, to enjoy the \n" +
    "related services, hereinafter referred to as “the Services”, you irrevocably agree to be\n" +
    " bound by the Mobile Apps general terms and conditions.\n" +
    "The French language version of the Mobile Apps general terms and conditions shall \n" +
    "prevail if there is any discrepancy between this version and versions translated into \n" +
    "other languages.\n" +
    "ADAPTING THE MOBILE APPS GENERAL TERMS AND CONDITIONS\n" +
    "ON-MAD reserves the right to adapt the Mobile Apps general terms and conditions, \n" +
    "the latest valid version of which can be viewed on the website www.ON-MAD.net, at any \n" +
    "time and before use.\n" +
    "Continuing to use the App after the Mobile Apps general terms and conditions have \n" +
    "been changed will imply that you have irrevocably accepted the new version.\n" +
    "You have the option at any time not to start or continue to use the App if you do \n" +
    "not accept the Mobile Apps general terms and conditions in the version in force \n" +
    "when it is used.\n" +
    "INTELLECTUAL PROPERTY\n" +
    "As long as you respect the Mobile Apps general terms and conditions, \n" +
    "ON-MAD grants you a non-exclusive, non-transferable and revocable licence \n" +
    "to use the App. ACCEPTING THE MOBILE APPS GENERAL TERMS AND CONDITIONS\n" +
    "By using an ON-MAD application, hereinafter referred to as “the App”, to enjoy the \n" +
    "related services, hereinafter referred to as “the Services”, you irrevocably agree to be\n" +
    " bound by the Mobile Apps general terms and conditions.\n" +
    "The French language version of the Mobile Apps general terms and conditions shall \n" +
    "prevail if there is any discrepancy between this version and versions translated into \n" +
    "other languages.\n" +
    "ADAPTING THE MOBILE APPS GENERAL TERMS AND CONDITIONS\n" +
    "ON-MAD reserves the right to adapt the Mobile Apps general terms and conditions, \n" +
    "the latest valid version of which can be viewed on the website www.ON-MAD.net, at any \n" +
    "time and before use.\n" +
    "Continuing to use the App after the Mobile Apps general terms and conditions have \n" +
    "been changed will imply that you have irrevocably accepted the new version.\n" +
    "You have the option at any time not to start or continue to use the App if you do \n" +
    "not accept the Mobile Apps general terms and conditions in the version in force \n" +
    "when it is used.\n" +
    "INTELLECTUAL PROPERTY\n" +
    "As long as you respect the Mobile Apps general terms and conditions, \n" +
    "ON-MAD grants you a non-exclusive, non-transferable and revocable licence \n" +
    "to use the App. ACCEPTING THE MOBILE APPS GENERAL TERMS AND CONDITIONS\n" +
    "By using an ON-MAD application, hereinafter referred to as “the App”, to enjoy the \n" +
    "related services, hereinafter referred to as “the Services”, you irrevocably agree to be\n" +
    " bound by the Mobile Apps general terms and conditions.\n" +
    "The French language version of the Mobile Apps general terms and conditions shall \n" +
    "prevail if there is any discrepancy between this version and versions translated into \n" +
    "other languages.\n" +
    "ADAPTING THE MOBILE APPS GENERAL TERMS AND CONDITIONS\n" +
    "ON-MAD reserves the right to adapt the Mobile Apps general terms and conditions, \n" +
    "the latest valid version of which can be viewed on the website www.ON-MAD.net, at any \n" +
    "time and before use.\n" +
    "Continuing to use the App after the Mobile Apps general terms and conditions have \n" +
    "been changed will imply that you have irrevocably accepted the new version.\n" +
    "You have the option at any time not to start or continue to use the App if you do \n" +
    "not accept the Mobile Apps general terms and conditions in the version in force \n" +
    "when it is used.\n" +
    "INTELLECTUAL PROPERTY\n" +
    "As long as you respect the Mobile Apps general terms and conditions, \n" +
    "ON-MAD grants you a non-exclusive, non-transferable and revocable licence \n" +
    "to use the App.\n" +
    "……..\n";

export default class Privacy extends Component {
    constructor(props) {
        super(props);
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    };

    componentWillUnmount() {
        this._navListener.remove();
    }



    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Text style={styles.mainText}>{text}</Text>
                </ScrollView>
            </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        paddingTop: rootViewTopPadding()
    },
    navigationView: {
        flex: 1,
        flexDirection: 'row',
    },
    titleText: {
        textAlign: 'center',
        width: '100%',
        fontSize: 17,
        color: '#777777',
        paddingTop: 10,
        position: 'absolute'
    },
    scrollView: {
        top: 28.5,
        marginLeft: 29,
        marginRight: 29,
        bottom: 50,
        position: 'absolute'
    },
    mainText: {
        color: '#95989A',
        fontSize: 8
    }
});