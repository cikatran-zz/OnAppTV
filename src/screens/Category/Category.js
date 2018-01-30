import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import {
    FlatList, Image, StyleSheet, Text, View, ScrollView, ImageBackground,
} from 'react-native';
import {colors} from '../../utils/themeConfig'
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'
import CategoryPageView from "./CategoryPageView";

export default class Category extends Component {

    constructor(props) {
        super(props);
    };

    componentDidMount() {
        this.props.getCategory();
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
        const {category} = this.props;
        if (!category.data || category.isFetching) {
            return null;
        }
        _keyExtractor = (item, index) => item.id + index;
        return (
            <Swiper style={styles.pageViewStyle} loop={false} showsPagination={false}>
                { category.data.map((prop, index)=> {
                    console.log("DATA: " ,category.data);
                    return (<CategoryPageView pagePosition={ this._getPagePosition(index, category.data.length) } header={prop.header} slotMachines={prop.slot_machines} keyExtractor={this._keyExtractor}  />)
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

