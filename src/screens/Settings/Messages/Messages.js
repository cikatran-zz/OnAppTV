import React from 'react'
import {
    Text, View, StyleSheet, TextInput, ImageBackground, Image, FlatList, TouchableOpacity, Platform, StatusBar, NativeModules
} from 'react-native'
import {colors} from '../../../utils/themeConfig'
import * as Orientation from "react-native-orientation";
import _ from 'lodash';

export default class Messages extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            openedIndex: -1,
            message: 'default message',
            isFetching: false
        };
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        });
        this.props.getMessages();
    }

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _toggleOpen = (index, message) => {
        const {openedIndex} = this.state;

        if (openedIndex === index) this.setState({openedIndex: -1, message: 'default message'})
        else {
            this.setState({openedIndex: index, message: message})
            const {messages} = this.props;
            let messagesData = _.cloneDeep(messages.data);
            if (!messagesData[index].isRead) {
                messagesData[index].isRead = true;
                NativeModules.RNUserKit.storeProperty("notification", {"data": messagesData}, (error, results)=> {
                    if (!error) {
                        this.props.getMessages();
                        let badge = messagesData.filter(message => !message.isRead).length;
                        console.log("BADGE", badge);
                        console.log(NativeModules.RNNotificationCenter);
                        NativeModules.RNOANotification.updateBadge(badge);
                    }
                });
            }

        }


    };

    _renderMessageContent = (isOpen, message) => {
        if (isOpen) {
            return <Text style={styles.itemMessageText}>{message}</Text>
        }
        else return null
    };

    _renderMessage = ({item, index}) => {
        const {openedIndex} = this.state;

        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => this._toggleOpen(index, item.body)}>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    {!item.isRead && <Image source={require('../../../assets/ic_pincode_pink.png')}/> }
                    <Text style={styles.itemNameText}>{item.title}</Text>
                    <Image source={require('../../../assets/ic_three_dots.png')} style={styles.itemThreeDots}/>
                </View>
                {this._renderMessageContent(openedIndex === index, item.body)}
            </TouchableOpacity>
        )
    };

    render() {
        const {messages} = this.props;

        // if (!messages.fetched || messages.isFetching) {
        //     return null;
        // }
        //
        let messagesData = messages.data;
        if (messages.data == null || messages.error) {
            messagesData = [];
            // return (
            //     <View style={styles.container}>
            //         <StatusBar
            //             translucent={true}
            //             backgroundColor='#00000000'
            //             barStyle='dark-content'/>
            //         <Text style={styles.errorText}>There is no message</Text>
            //     </View>
            // )
        }


        return (
            <View style={styles.container}>
                <FlatList
                    refreshing={messages.isFetching}
                    onRefresh={() => this.props.getMessages()}
                    style={styles.listMess}
                    horizontal={false}
                    renderItem={this._renderMessage}
                    keyExtractor={(item, index) => index}
                    data={messagesData}
                    ItemSeparatorComponent={() => <View
                        style={{left: 45, width: "100%", height: 1, backgroundColor: '#DADADE'}}/>}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whiteBackground,
        position: 'relative',
        flexDirection: 'column',
    },
    errorText: {
        color: colors.textDarkGrey,
        textAlign: 'center',
        marginTop: 100,
        width: '100%',
        fontSize: 20
    },
    listMess: {
        width: '100%',
        marginTop: 40,
    },
    itemContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 17,
        minHeight: 42,
        paddingVertical: 10
    },
    itemNameText: {
        fontSize: 16,
        color: 'black',
        marginRight: 'auto',
        marginLeft: 12
    },
    itemMessageText: {
        fontSize: 17,
        color: 'black',
        marginTop: 24,
        marginBottom: 24
    },
    itemCircle: {
        tintColor: colors.mainPink
    },
    itemThreeDots: {
        marginRight: 15
    }
});