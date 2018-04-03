import React from 'react'
import Swiper from 'react-native-swiper'
import { Text, View, SectionList, TextInput, StyleSheet, FlatList } from 'react-native'
import { colors } from '../../utils/themeConfig'
import Bookmark from '../Bookmark/Bookmark'
import RecordList from '../RecordList/RecordList'
import { rootViewTopPadding } from '../../utils/rootViewTopPadding'

export default class Book extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getList()
  }

  _keyExtractor = (item, index) => index

  render() {

    return (
      <Swiper loop={false} horizontal={true} showsPagination={true} style={styles.pageViewStyle} removeClippedSubviews={false}>
        <Bookmark />
        <RecordList header={"MY RECORDS"}/>
        <RecordList header={"MY DOWNLOADS"}/>
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  pageViewStyle: {
    height: '100%',
    backgroundColor: colors.screenBackground
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})