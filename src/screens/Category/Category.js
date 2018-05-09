import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import {StyleSheet, StatusBar, View, TouchableOpacity, Image, Text, Platform, ActivityIndicator} from 'react-native';
import {colors} from '../../utils/themeConfig'
import CategoryPageView from "./CategoryPageView";
import Orientation from "react-native-orientation";
import _ from 'lodash'

export default class Category extends Component {

    constructor(props) {
        super(props);
        this.names = null;
        this.startCategory = "";
    };

    componentDidMount() {
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
        const {data, fromItem} = this.props.navigation.state.params;
        let startIndex = _.findIndex(data, {'name': fromItem})

        return (
            <View style={{width: '100%', height: '100%'}}>
                <StatusBar
                    translucent={true}
                    backgroundColor='white'
                    barStyle='dark-content'/>
                <Swiper style={styles.pageViewStyle} loop={false} showsPagination={false} index={startIndex}>
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

});

