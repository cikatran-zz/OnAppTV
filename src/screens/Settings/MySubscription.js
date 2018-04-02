import React from 'react'
import {
  Text, View, StyleSheet, FlatList, SectionList, StatusBar, Switch, TouchableOpacity, ImageBackground
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import SettingItem from '../../components/SettingItem'
import SettingHeader from '../../components/SettingHeader'
import BlurView from '../../components/BlurView'

export default class MySubscription extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  //TODO: Pink Rounded Label fixing style

  _keyExtractor = (item, index) => index

  _renderInfoItem = ({item}) => {
    return (
      <SettingItem item={item} showIcon={false}/>
    )
  }

  _renderInfoSection = ({item}) => {
    console.log(item)
    return (
      <FlatList
        keyExtractor={this._keyExtractor}
        style={styles.listInfoContainer}
        horizontal={false}
        data={item}
        renderItem={this._renderInfoItem}
      />
    )
  }

  _renderSwitchItem = ({item}) => {
    return (
      <View style={styles.switchItemContainer}>
        <Text style={styles.switchItemName}>{item.name}</Text>
        <Text style={styles.switchItemPriceText}>{item.price}</Text>
        <Switch style={styles.switchItemToggle} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} value={item.value}/>
      </View>
    )
  }

  _renderListSwitch = ({item}) => {

    return (
      <FlatList
        keyExtractor={this._keyExtractor}
        style={styles.switchList}
        horizontal={false}
        renderItem={this._renderSwitchItem}
        data={item}
      />
    )
  }

  _renderPackageItem = ({item}) => {

    return (
      <View>
        <ImageBackground source={{uri: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'}} style={styles.imageBackground}>
          <BlurView blurRadius={10} style={styles.blurView}/>
          <View style={styles.packageInfoContainer}>
            <Text style={styles.packageNameText}>{item.name}</Text>
            <Text style={styles.packagePriceText}>{item.price}</Text>
          </View>
          <Switch style={styles.switchPackageToggle} onTintColor={colors.mainPink} tintColor={'#E2E2E2'} value={item.value}/>
        </ImageBackground>
      </View>
    )
  }

  _renderPackagesSection = ({item}) => {
    return (
      <FlatList
        keyExtractor={this._keyExtractor}
        style={styles.packageListContainer}
        horizontal={false}
        renderItem={this._renderPackageItem}
        data={item}
      />
    )
  }

  _renderSectionHeader = ({section}) => {
    if (section.showHeader) {
      return (
        <View style={styles.headerSection}>
          <PinkRoundedLabel text={section.title}/>
        </View>
      )
    } else {
      return null
    }
  }

  _renderValidate = () => {
    return (
      <TouchableOpacity>
        <PinkRoundedLabel text={'Validate'} style={styles.validateButton}/>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <SettingHeader text={'My Subscription'} backButton={true} navigation={this.props.navigation}/>
        <SectionList
          style={{position: 'relative', flex: 1}}
          keyExtractor={this._keyExtractor}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={this._renderSectionHeader}
          sections={[
            {data: [fakeData.list], showHeader: false, renderItem: this._renderInfoSection},
            {data: [fakeSwitchItem], showHeader: true, title: 'PACKAGES', renderItem: this._renderPackagesSection},
            {data: [fakeSwitchItem], showHeader: true, title: 'IN OPTIONS', renderItem: this._renderListSwitch},
            {data: [fakeSwitchItem], showHeader: false, renderItem: this._renderValidate}
          ]}
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  listInfoContainer: {
    marginTop: 60,
    marginLeft: 32,
    marginRight: 17,
    marginBottom: 25
  },
  packageListContainer: {
    width: '100%',
    marginBottom: 25
  },
  sectionListContainer: {
    marginLeft: 15,
    marginRight: 15
  },
  switchList: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 25
  },
  switchItemContainer: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 12
  },
  switchItemName: {
    fontSize: 16,
    color: 'black',
  },
  switchItemPriceText: {
    fontSize: 15,
    color: colors.greySettingItemText,
    marginLeft: 'auto',
    marginRight: 28
  },
  switchItemToggle: {
    marginRight: 8,
    width: 44,
    height: 25
  },
  imageBackground: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    height: 150
  },
  blurView: {
    width: '50%',
    height: '100%'
  },
  packageInfoContainer: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    top: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  packageNameText: {
    alignSelf: 'center',
    fontSize: 15,
    color: colors.whitePrimary
  },
  packagePriceText: {
    padding: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    color: colors.whitePrimary
  },
  switchPackageToggle: {
    width: 44,
    height: 26,
    marginRight: 20
  },
  validateButton: {
    width: 232,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 17,
    marginBottom: 68
  },
  headerSection: {
    width: '100%',
    flexDirection: 'row',
    marginLeft: 14,
    marginBottom: 33
  }
})

const fakeData = {
  title: "ON TV",
  list: [
    {
      name: "Test",
      value: "Value"
    },
    {
      name: "Test",
      value: "Value"
    },
    {
      name: "Test",
      value: "Value"
    }]
}

const fakeSwitchItem = [{
  name: 'Bein sport',
  price: '5 US$',
  value: true
},
  {
    name: 'Bein sport',
    price: '5 US$',
    value: true
  },
  {
    name: 'Bein sport',
    price: '5 US$',
    value: true
  }]