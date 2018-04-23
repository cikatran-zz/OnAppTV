import React from 'react'
import {
  Text, View, StyleSheet, TextInput, ImageBackground, Image, Platform, TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import { Dropdown } from 'react-native-material-dropdown';
import { colors } from '../../../utils/themeConfig'
import PinkRoundedLabel from '../../../components/PinkRoundedLabel'
import { rootViewTopPadding } from '../../../utils/rootViewPadding'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

export default class SignIn extends React.PureComponent {

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
        <TouchableOpacity style={{width: 44, height: 44, borderRadius: 22, position: 'absolute', top: 10, right: 20, backgroundColor: 'rgba(11,11,11,0.31)'}}>
          <Image source={require('../../../assets/ic_modal_close.png')}/>
        </TouchableOpacity>
        <Text style={{marginTop: '13%', alignSelf: 'center', fontSize: 22, color: 'black', marginBottom: '9%', fontWeight: 'bold'}}>SIGN IN</Text>
        <TouchableOpacity style={{borderRadius: (Platform.OS === 'ios') ? 15 : 30, width: '62%', backgroundColor: '#3765A3',  paddingTop: '2%', paddingBottom: '2%', marginTop: '4.5%'}}>
          <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Continue with Facebook</Text>
        </TouchableOpacity>

        <Text style={{fontSize: 13, opacity: 0.66, color: 'black', marginTop: '5%', marginBottom: '5%'}}>Ou créez votre compte manuellement</Text>
        <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: '4.8%'}}>
        <RadioGroup
          size={24}
          thickness={2}
          color='#D8D8D8'
        >
          <RadioButton value={'item1'} >
            <Text style={{color: 'black', fontSize: 14}}>Madame</Text>
          </RadioButton>
        </RadioGroup>
        <RadioGroup
          size={24}
          thickness={2}
          color='#D8D8D8'
        >
          <RadioButton value={'item1'} >
            <Text style={{color: 'black', fontSize: 14}}>Monsieur </Text>
          </RadioButton>
        </RadioGroup>
        </View>
        <TextInput style={{width: '83%', height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%', paddingLeft: 30, marginTop: "3.7%"}} placeholder={'E-mail (personnel)'} underlineColorAndroid='rgba(0,0,0,0)' placeholderTextColor={'black'}/>
        <TextInput style={{width: '83%', height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%', paddingLeft: 30}} placeholder={'Nom'} secureTextEntry={true} underlineColorAndroid='rgba(0,0,0,0)' placeholderTextColor={'black'}/>
        <TextInput style={{width: '83%', height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%', paddingLeft: 30}} placeholder={'Prénom'} underlineColorAndroid='rgba(0,0,0,0)' placeholderTextColor={'black'}/>
        <View style={{width: '83%',height: '6%', borderColor: 'rgba(152,152,152,0.32)', borderWidth: 1, borderRadius: (Platform.OS === 'ios') ? 15 : 30, marginBottom: '6%'}}>
          <Dropdown containerStyle={{height: 60, position: 'absolute', top: -25, paddingLeft: 30, width: '100%'}}
                    overlayStyle={{paddingLeft: 30}}
                    pickerStyle={{paddingLeft: 30}}
                    data={genderData}
                    value={"Gender"}
          />
        </View>

        <TouchableOpacity style={{borderRadius: (Platform.OS === 'ios') ? 15 : 30, width: '62%', backgroundColor: colors.mainPink,  paddingTop: '2%', paddingBottom: '2%', marginTop: '5.5%'}}>
          <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Create account</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 10, color: 'rgba(98,98,98,0.41)', marginTop: 10}}>By validating, you accept the terms & conditions</Text>
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