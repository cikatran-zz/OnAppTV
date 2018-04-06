import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import {StyleSheet,} from 'react-native';
import {colors} from '../../utils/themeConfig'
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'
import CategoryPageView from "./CategoryPageView";

export default class Category extends Component {

    constructor(props) {
        super(props);
        this.names = {}
    };

    componentDidMount() {
        const {data} = this.props.navigation.state.params;
        var ids = [];
        data.forEach((item)=>{
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
        console.log(keys);
        return (
            <Swiper style={styles.pageViewStyle} loop={false} showsPagination={false}>
                { keys.map((key, index)=> {
                    return (<CategoryPageView pagePosition={ this._getPagePosition(index, keys.length) } header={this.names[key]} slotMachines={genresContent.data[key].features} key={"category"+index}  />)
                })}
            </Swiper>
        );
    }
}


const styles = StyleSheet.create({
    pageViewStyle: {
        paddingTop: rootViewTopPadding(),
        backgroundColor: colors.screenBackground
    }
});

