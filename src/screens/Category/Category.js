import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import {StyleSheet, StatusBar, View, TouchableOpacity, Image, Text, Platform, InteractionManager} from 'react-native';
import {colors} from '../../utils/themeConfig'
import CategoryPageView from "./CategoryPageView";
import Orientation from "react-native-orientation";
import _ from 'lodash'
import {rootViewTopPadding} from "../../utils/rootViewPadding";

export default class Category extends Component {

    constructor(props) {
        super(props);
        this.names = null;
        this.startCategory = "";
        this.state = {
            position: undefined
        }
        this._debounceCategory = _.debounce(this._fetchCategories, 500);
    };

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('white');
        });
        const {data, fromItem} = this.props.navigation.state.params;
        let startIndex = _.findIndex(data, {'name': fromItem})
        InteractionManager.runAfterInteractions(() => {
            this._fetchCategories(startIndex);
        })
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    };

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

    _fetchCategories(index) {
        const {data} = this.props.navigation.state.params;
        const {vod, epg} = this.props;
        let genresId = data[index].id;
        let epgMap = epg.epgMap.get(genresId);
        let vodMap = vod.vodMap.get(genresId);
        if (!epgMap || !vodMap) {
            this.props.getEPG(10, 0, genresId, new Date());
            this.props.getVODByGenres(1, 10, genresId);
        }
    }

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

    _onIndexChanged = (index) => {
        const {data} = this.props.navigation.state.params;
        let pagePosition = this._getPagePosition(index, data.length);
        this.setState({
            position: pagePosition
        });
        this._debounceCategory(index);
    }

    _getBackBtnImage = () =>{
        const {position} = this.state;
        const {data, fromItem} = this.props.navigation.state.params;
        let startIndex = _.findIndex(data, {'name': fromItem});
        let pagePosition = this._getPagePosition(startIndex, data.length);
        let backBtnImage = null;
        if (position) {
            if (position == 'begin') {
                backBtnImage = require('../../assets/ic_left_arrow.png');
            } else {
                backBtnImage = require('../../assets/ic_white_left_arrow.png');
            }
        } else {
            if (pagePosition == 'begin') {
                backBtnImage = require('../../assets/ic_left_arrow.png');
            } else {
                backBtnImage = require('../../assets/ic_white_left_arrow.png');
            }
        }


        return (
            <Image source={backBtnImage} style={styles.backImage}/>
        )
    }

    render() {
        const {data, fromItem} = this.props.navigation.state.params;
        let startIndex = _.findIndex(data, {'name': fromItem})
        return (
            <View style={{width: '100%', height: '100%'}}>
                <StatusBar
                    translucent={true}
                    backgroundColor='white'
                    barStyle='dark-content'/>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
                    {this._getBackBtnImage()}
                </TouchableOpacity>
                <Swiper style={styles.pageViewStyle}
                        loop={false}
                        showsPagination={false}
                        index={startIndex}
                        onIndexChanged={this._onIndexChanged}>
                    {data.map((genres, index) => {
                        return (<CategoryPageView pagePosition={this._getPagePosition(index, data.length)}
                                                  header={genres.name}
                                                  genresId={genres.id}
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
    backButton: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        left: 2,
        top: rootViewTopPadding() + 17.5,
        position: 'absolute',
        zIndex: 10
    },
    backImage: {
        height: 13,
        resizeMode: 'cover'
    },

});

