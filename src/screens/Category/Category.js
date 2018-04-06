import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import {StyleSheet, StatusBar, View} from 'react-native';
import {colors} from '../../utils/themeConfig'
import CategoryPageView from "./CategoryPageView";

export default class Category extends Component {

    constructor(props) {
        super(props);
        this.names = {}
        this.startCategory = ""
    };

    componentDidMount() {
        const {data, fromItem} = this.props.navigation.state.params;
        var ids = [];
        this.startCategory = fromItem;
        data.forEach((item) => {
            ids.push(item.id);
            this.names[item.id] = item.name;
        });
        this.props.getGenresContent(ids);
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
                                                  key={"category" + index}/>)
                    })}
                </Swiper>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    pageViewStyle: {
        backgroundColor: colors.screenBackground
    }
});

