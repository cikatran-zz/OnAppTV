import React, {Component} from 'react'
import {
    StyleSheet, Text, SectionList, View, Image, FlatList
} from 'react-native'
import {colors} from '../../utils/themeConfig'

class HeaderLabel extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        if (this.props.position == 'end') {
            return (
                <Text style={styles.endHeaderLabelStyle}>{this.props.text}</Text>
            )
        } else if (this.props.position == 'inside') {
            return (
                <Text style={styles.insideHeaderLabelStyle}>{this.props.text}</Text>
            )
        } else if (this.props.position == 'begin') {
            return (
                <Text style={styles.beginHeaderLabelStyle}>{this.props.text}</Text>
            )
        } else {
            return (
                <Text >{this.props.text}</Text>
            )
        }
    }
}

class CategoryPageView extends React.PureComponent{
    constructor(props){
        super(props);
    }
    _keyExtractor = (item, index) => item.id;
    _renderBanner = ({item}) => {
        console.log("Banner: " + item);
        return (
            <View style={styles.bannerContainer}>
            { item.map((it, index)=> {
                return (<Image
                    keyExtractor={this._keyExtractor + index}
                    style={styles.bannerImage}
                    source={{uri: it.cover_image}}/>
                )
            })}
            </View>
        )
    }

    render(){
        return (
            <View keyExtractor={this._keyExtractor} style={styles.rootView}>
                <HeaderLabel position={this.props.pagePosition} text={this.props.header} keyExtractor={this._keyExtractor}/>
                <SectionList
                    style={styles.container}
                    keyExtractor={this._keyExtractor}
                    sections={[
                        {data:[this.props.banner], renderItem: this._renderBanner}
                    ]}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({

    rootView: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.screenBackground
    },

    bannerImage: {
        width: '100%',
        aspectRatio: 2.0,
    },
    bannerContainer: {
        width: '100%',
        justifyContent: 'center',
        backgroundColor: colors.screenBackground,
        top: 0
    },
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: colors.screenBackground,
        marginTop: 30
    },
    hotContentImageStyle: {
        width: '100%',
        aspectRatio: 2.0,
        justifyContent: 'center'
    },
    beginHeaderLabelStyle : {
        width: '60%',
        height: 30,
        overflow: "hidden",
        left: '50%',
        borderRadius: 15,
        padding: 8,
        backgroundColor: colors.mainPink,
        fontSize: 13,
        color: colors.textWhitePrimary
    },
    endHeaderLabelStyle : {
        width: '60%',
        height: 30,
        overflow: "hidden",
        left: '-10%',
        borderRadius: 15,
        textAlign: 'right',
        padding: 8,
        backgroundColor: colors.mainPink,
        fontSize: 13,
        color: colors.textWhitePrimary
    },
    insideHeaderLabelStyle : {
        width: '100%',
        height: 30,
        left: 0,
        textAlign: 'center',
        padding: 8,
        backgroundColor: colors.mainPink,
        fontSize: 13,
        color: colors.textWhitePrimary
    }
});

export default CategoryPageView;