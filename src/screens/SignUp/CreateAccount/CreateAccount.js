import React from 'react'
import {
  Text, View, StyleSheet, TextInput, ImageBackground, Image, Platform, TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import { Dropdown } from 'react-native-material-dropdown';
import { colors } from '../../../utils/themeConfig'
import PinkRoundedLabel from '../../../components/PinkRoundedLabel'
import { rootViewTopPadding } from '../../../utils/rootViewPadding'

export default class CreateAccount extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    let genderData = [{
      value: 'Male',
    }, {
      value: 'Female',
    }, {
      value: 'Middle',
    }];
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{width: 44, height: 44, borderRadius: 22, position: 'absolute', top: 10, right: 20, backgroundColor: 'rgba(11,11,11,0.31)'}}
          onPress={() => this.props.navigation.goBack(null)}>
          <Image source={require('../../../assets/ic_modal_close.png')}/>
        </TouchableOpacity>
        <Text style={{marginTop: '13%', alignSelf: 'center', fontSize: 22, color: 'black', marginBottom: '9%', fontWeight: 'bold'}}>CREATE ACCOUNT</Text>
        <TextInput style={{width: '83%', height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%', paddingLeft: 30}} placeholder={'E-mail'} underlineColorAndroid='rgba(0,0,0,0)' placeholderTextColor={'black'}/>
        <TextInput style={{width: '83%', height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%', paddingLeft: 30}} placeholder={'Password'} secureTextEntry={true} underlineColorAndroid='rgba(0,0,0,0)' placeholderTextColor={'black'}/>
        <TextInput style={{width: '83%', height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%', paddingLeft: 30}} placeholder={'Name'} underlineColorAndroid='rgba(0,0,0,0)' placeholderTextColor={'black'}/>
        <TextInput style={{width: '83%', height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%', paddingLeft: 30}} placeholder={'First Name'} underlineColorAndroid='rgba(0,0,0,0)' placeholderTextColor={'black'}/>
        <View style={{width: '83%',height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%'}}>
        <Dropdown containerStyle={{height: 60, position: 'absolute', top: -25, paddingLeft: 30, width: '100%'}}
                  overlayStyle={{paddingLeft: 30}}
                  pickerStyle={{paddingLeft: 30}}
                  data={genderData}
                  value={"Age"}
        />
        </View>
        <View style={{width: '83%',height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%'}}>
          <Dropdown containerStyle={{height: 60, position: 'absolute', top: -25, paddingLeft: 30, width: '100%'}}
                    overlayStyle={{paddingLeft: 30}}
                    pickerStyle={{paddingLeft: 30}}
                    data={genderData}
                    value={"Gender"}
          />
        </View>
        <TouchableOpacity style={{borderRadius: (Platform.OS === 'ios') ? 15 : 30, width: '62%', backgroundColor: colors.mainPink,  paddingTop: '2%', paddingBottom: '2%', marginTop: '13%'}}>
          <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Create account</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  }
})