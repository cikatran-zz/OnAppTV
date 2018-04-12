import React from 'react'
import Swiper from 'react-native-swiper'
import { StatusBar, StyleSheet, View } from 'react-native'
import {colors} from '../../utils/themeConfig'
import Bookmark from '../Bookmark/Bookmark'
import RecordList from '../RecordList/RecordList'
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'

export default class Book extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
     this.props.getList()
  }

  _keyExtractor = (item, index) => index

  render() {
    const {books} = this.props
    console.log(books)

    return (
      <View style={{width: '100%', height: '100%'}}>

        <Swiper loop={false} horizontal={true} showsPagination={true} style={styles.pageViewStyle} removeClippedSubviews={false}>
          <Bookmark books={books}/>
          <RecordList header={"MY RECORDS"} books={books}/>
          <RecordList header={"MY DOWNLOADS"} books={books}/>
        </Swiper>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pageViewStyle: {
    paddingTop: rootViewTopPadding(),
    backgroundColor: colors.screenBackground
  }
})