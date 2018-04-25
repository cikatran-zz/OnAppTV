import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import {StyleSheet, StatusBar, View, TouchableOpacity, Image, Text, Platform} from 'react-native';
import {colors} from '../../utils/themeConfig'
import CategoryPageView from "./CategoryPageView";
import Orientation from "react-native-orientation";

export default class Category extends Component {

    constructor(props) {
        super(props);
        this.names = null;
        this.startCategory = "";
    };

    componentDidMount() {
        // Fetch data
        const {data, fromItem} = this.props.navigation.state.params;

        let ids = [];

        data.forEach((item) => {
            ids.push(item.id);

        });
        this.props.getGenresContent(ids);
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('white');
            this.props.getChannel(-1);
        });
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _getPagePosition = (index, length) => {
        if (index === 0) {
            return 'begin';
        } else if (index === length - 1) {
            return 'end';
        } else {
            return 'inside';
        }
    };

    _onVideoPress = (item, isLive) => {
        const {navigation} = this.props;

        navigation.navigate('LowerPageComponent', {
            item: item,
            isLive: isLive
        })
    };

    _keyExtractor = (item, index) => item.id + index;

    render() {
        const {genresContent} = this.props;
        if (!genresContent.fetched || genresContent.isFetching) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            );
        }

        const {data, fromItem} = this.props.navigation.state.params;
        this.startCategory = fromItem;
        this.names = data.reduce((map, obj)=> {
            map[obj.id] = obj.name;
            return map;
        }, {});

        let keys = Object.keys(genresContent.data);
        console.log("GENRES CONTENT",genresContent.data);
        var startIndex = 0;
        keys.forEach((key, index) => {
            if (this.names[key] == this.startCategory) {
                startIndex = index;
            }
        });

        return (
            <View style={{width: '100%', height: '100%'}}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <Swiper style={styles.pageViewStyle} loop={false} showsPagination={false} index={startIndex}>
                    {keys.map((key, index) => {
                        console.log("NAME", key, "NAMES", this.names);
                        return (<CategoryPageView pagePosition={this._getPagePosition(index, keys.length)}
                                                  header={this.names[key] ? this.names[key] : ""}
                                                  slotMachines={genresContent.data[key].features}
                                                  vod={genresContent.data[key].VOD}
                                                  epgs={genresContent.data[key].EPGs}
                                                  key={"category" + index}
                                                  goBack={()=>this.props.navigation.goBack()}
                                                  onVideoPress={(item, isLive)=> this._onVideoPress(item, isLive)}/>)
                    })}
                </Swiper>

            </View>
        );
    }
}


const styles = StyleSheet.create({

    pageViewStyle: {
        backgroundColor: colors.screenBackground
    },

});

