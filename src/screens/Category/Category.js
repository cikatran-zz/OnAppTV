import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import {StyleSheet, StatusBar, View, TouchableOpacity, Image, Text, Platform, ActivityIndicator} from 'react-native';
import {colors} from '../../utils/themeConfig'
import CategoryPageView from "./CategoryPageView";
import Orientation from "react-native-orientation";
import {DotsLoader} from "react-native-indicator";

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

        navigation.navigate('DetailsPage', {
            item: item,
            isLive: isLive
        })
    };

    _keyExtractor = (item, index) => item.id + index;

    _goBack = ()=> {
        const {navigation} = this.props;
        console.log("GO BACK", navigation);
        navigation.goBack();
    };

    render() {
        const {genresContent} = this.props;
        if (!genresContent.fetched || genresContent.isFetching) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <DotsLoader color={colors.textGrey} size={20} betweenSpace={10}/>
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
                    backgroundColor='white'
                    barStyle='dark-content'/>
                <Swiper style={styles.pageViewStyle} loop={false} showsPagination={false} index={startIndex}>
                    {keys.map((key, index) => {
                        return (<CategoryPageView pagePosition={this._getPagePosition(index, keys.length)}
                                                  header={this.names[key] ? this.names[key] : ""}
                                                  slotMachines={genresContent.data[key].features}
                                                  vod={genresContent.data[key].VOD}
                                                  epgs={genresContent.data[key].EPGs}
                                                  key={"category" + index}
                                                  goBack={()=>{this._goBack()}}
                                                  onVideoPress={(item, isLive)=> this._onVideoPress(item, isLive)}/>)
                    })}
                </Swiper>

            </View>
        );
    }
}


const styles = StyleSheet.create({

    pageViewStyle: {
        backgroundColor: colors.whiteBackground
    },

});

