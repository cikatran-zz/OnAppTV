import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import {StyleSheet, StatusBar, View, TouchableOpacity, Image, Text} from 'react-native';
import {colors} from '../../utils/themeConfig'
import CategoryPageView from "./CategoryPageView";

export default class Category extends Component {

    constructor(props) {
        super(props);
        this.names = {}
        this.startCategory = ""

        // Fetch data
        const {data, fromItem} = this.props.navigation.state.params;
        if (!data || !fromItem)
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            );
        let ids = [];
        this.startCategory = fromItem;
        data.forEach((item) => {
            ids.push(item.id);
            this.names[item.id] = item.name;
        });
        this.props.getGenresContent(ids);
        this.state = {
            backImage: null,
            currentIndex: null
        }
    };

    componentDidMount() {

    };

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
    }

    render() {
        const {genresContent} = this.props;
        if (!genresContent.fetched || genresContent.isFetching) {
            return null;
        }
        _keyExtractor = (item, index) => item.id + index;
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
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <Swiper style={styles.pageViewStyle} loop={false} showsPagination={false} index={startIndex}>
                    {keys.map((key, index) => {
                        return (<CategoryPageView pagePosition={this._getPagePosition(index, keys.length)}
                                                  header={this.names[key]}
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

