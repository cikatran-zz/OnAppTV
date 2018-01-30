import React, {Component} from 'react';
import { Pages } from 'react-native-pages';
import {
    FlatList, Image, StyleSheet, Text, View, ScrollView, ImageBackground, SafeAreaView,
    Dimensions, Platform
} from 'react-native';
import {colors} from '../../utils/themeConfig'
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'
import CategoryPageView from "./CategoryPageView";

export default class Category extends Component {

    constructor(props) {
        super(props);
    };

    componentDidMount() {
    };

    _keyExtractor = (item, index) => item.id;


    render() {
        return (
            <Pages style={styles.pageViewStyle}>
                <CategoryPageView pagePosition='begin' header='SPORTS' />
                <CategoryPageView pagePosition='inside' header='MOVIES' />
                <CategoryPageView pagePosition='end' header='ENTERTAINMENT'/>
            </Pages>
        );
    }
}

const styles = StyleSheet.create({
    pageViewStyle: {
        paddingTop: rootViewTopPadding()
    }
});

