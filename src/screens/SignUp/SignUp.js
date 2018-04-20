import React from 'react'
import {
  Text, View, StyleSheet, TextInput, ImageBackground, Image, Platform, TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import { colors } from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import { rootViewTopPadding } from '../../utils/rootViewTopPadding'

export default class SignIn extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <ImageBackground source={require('../../assets/login_bg.png')} style={styles.container}>
        <Image source={require('../../assets/logo_on.png')} style={{height: '16.5%', width: '40%', alignSelf: 'center', marginTop: '22.5%'}}/>
        <Swiper loop={true} horizontal={true} showsPagination={true} style={styles.pageViewStyle} removeClippedSubviews={false}
        dot={<View style={{backgroundColor: 'rgba(255,255,255,0.31)', width: 8, height: 8, borderRadius: 4, marginRight: 10}}/>}
                activeDot={<View style={{backgroundColor: 'rgba(255,255,255,1.0)', width: 8, height: 8, borderRadius: 4, marginRight: 10}}/>}
        autoplay={true}
        autoplayTimeout={2.5}
        autoplayDirection={true}
        >
          <View style={styles.swipeContentContainer}>
            <Text style={styles.redText}>The best of TV !</Text>
            <Text style={styles.contentText}>Login and start playing on your TV without your remote control !</Text>
          </View>
          <View style={styles.swipeContentContainer}>
            <Text style={styles.redText}>Don’t zapp anymore !</Text>
            <Text style={styles.contentText}>Thanks to your smartphone, select your best program in one click !</Text>
          </View>
          <View style={styles.swipeContentContainer}>
            <Text style={styles.redText}>Share !</Text>
            <Text style={styles.contentText}>Watch on TV or on your Mobile</Text>
          </View>

        </Swiper>
        <View style={{flex: 2.13, flexDirection: 'column', alignItems: 'center'}}>
          <TouchableOpacity style={{borderRadius: (Platform.OS === 'ios') ? 15 : 30, width: '62%', backgroundColor: '#3765A3', marginTop: '18%', marginBottom: '7%', paddingTop: '2%', paddingBottom: '2%'}}
            >
            <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Continue with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{borderRadius: (Platform.OS === 'ios') ? 15 : 30, width: '62%', backgroundColor: colors.mainPink,  paddingTop: '2%', paddingBottom: '2%'}}
            onPress={() => this.props.navigation.navigate("CreateAccount", {})}>
            <Text style={{textAlign: 'center', color: colors.whitePrimary, fontSize: 17}}>Create account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: '10%'}}>
          <Text style={{color: '#ADABAB', fontSize: 17}}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageViewStyle: {
    paddingTop: rootViewTopPadding(),
  },
  redText: {
    fontSize: 18,
    marginTop: "4%",
    color: '#FC355B',
    marginBottom: 15
  },
  contentText: {
    color: '#F4FBFF',
    fontSize: 15,
    textAlign: 'center'
  },
  swipeContentContainer: {
    width: '84%',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  }
})