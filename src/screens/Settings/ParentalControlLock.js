import React from 'react'
import {
  Text, Switch, View, StyleSheet, FlatList, Image, StatusBar,
  TouchableOpacity
} from 'react-native'
import { colors } from '../../utils/themeConfig'

export default class ParentalControlLock extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      input: 0
    }
  }

  _renderNumber = (num) => {
      return (
        <TouchableOpacity key={num} style={styles.numberContainer}>
          <View style={{width: '100%', height: '100%', backgroundColor: colors.whitePrimary, opacity: 0.14}}/>
          <View style={styles.numberText}>
            <Text style={styles.text}>{num ? num : 'Undefined'}</Text>
          </View>
        </TouchableOpacity>
      )
  }

  _renderDeleteButton = () => {
    return (
      <TouchableOpacity style={styles.numberContainer}>
        <View style={{width: '100%', height: '100%', backgroundColor: colors.whitePrimary, opacity: 0.14}}/>
        <View style={styles.numberText}>
          <Image source={require('../../assets/ic_delete.png')}/>
        </View>
      </TouchableOpacity>
    )
  }

  _renderNumberRow = (arr) => {
    return (
      <View style={styles.numberRowContainer}>
        {arr.map(num => {
          return this._renderNumber(num)
        })}
      </View>

    )
  }

  _onInputPincode = () => {
    const {input} = this.state


  }

  render() {
    const {navigation} = this.props

    return (
      <View style={styles.container}>
        <StatusBar/>
        <View style={styles.pinCodeContainer}>
          <View style={styles.pinCodeBackground}/>
          <View style={styles.pinCodeInputSection}>
            <Text style={styles.pinCodeText}>Enter PIN Code</Text>
            <View style={styles.pinCodes}>
              <PinCodeInput/>
            </View>
          </View>
        </View>
        <View style={styles.numbersSection}>
          {this._renderNumberRow([1,2,3])}
          {this._renderNumberRow([4,5,6])}
          {this._renderNumberRow([7,8,9])}
          <View style={styles.numberRowContainer}>
            <View style={styles.numberContainer}/>
            {this._renderNumber('0')}
            {this._renderDeleteButton()}
          </View>
        </View>
      </View>
    )
  }

}

export class PinCodeInput extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      pins: 0
    }
  }

  _onInput = () => {
    const {pins} = this.state


  }

  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <Image source={require('../../assets/ic_pincode.png')} style={{marginRight: 3}}/>
        <Image source={require('../../assets/ic_pincode.png')} style={{marginRight: 3}}/>
        <Image source={require('../../assets/ic_pincode.png')} style={{marginRight: 3}}/>
        <Image source={require('../../assets/ic_pincode.png')}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.greyParentalLock,
    alignItems: 'center'
  },
  headerContainer: {
    marginTop: 15,
    height: 36,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  pinCodeContainer: {
    flexDirection: 'row',
    marginTop: 197,
    height: '18%',
    width: '75%',
  },
  pinCodeBackground: {
    opacity: 0.14,
    backgroundColor: colors.whitePrimary,
    width: '100%',
    height: '100%',
    borderRadius: 13
  },
  pinCodeInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  pinCodeText: {
    fontSize: 15,
    color: colors.whitePrimary,
    marginLeft: 40
  },
  pinCodes: {
    marginLeft: 30,
    flexDirection: 'row'
  },
  backIcon: {
    position: 'absolute',
    left: 18
  },
  numbersSection: {
    position: 'absolute',
    top: '68%',
    left: 0,
    width: '100%',
    height: '32%',
    padding: 5
  },
  numberRowContainer: {
    flexDirection: 'row',
    marginLeft: 2.5,
    marginRight: 2.5,
    width: '100%',
    height: '24%'
  },
  numberContainer: {
    borderRadius: 2,
    width: '32%',
    flexDirection: 'row',
    margin: 2.5
  },
  numberText: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.whitePrimary,
    fontSize: 25
  }
})