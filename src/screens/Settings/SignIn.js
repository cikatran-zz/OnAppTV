import React from 'react'
import {
  Text, View, StyleSheet, TextInput, ImageBackground, Image
} from 'react-native'
import { colors } from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import SettingItem from '../../components/SettingItem'
import SettingHeader from '../../components/SettingHeader'

export default class SignIn extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <View style={styles.container}>
        <SettingHeader text={'Sign in'} backButton={true} navigation={this.props.navigation}/>
        <Text style={styles.descriptionText}>Sign to validate your new subscription</Text>
        <TextInput style={styles.textInput} placeholder={'E-mail'} placeholderTextColor={'black'}/>
        <TextInput style={styles.textInput} placeholder={'Mot de passe'} placeholderTextColor={'black'}/>
        <Text style={styles.forgotPassText}>Mot de passe oublié ?</Text>
        <PinkRoundedLabel text={'Confirm'} style={styles.confirmButton}/>
        <Text style={styles.connectionIssue}>Connection issue</Text>
        <Image style={styles.adsContainer} source={{uri: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'}}/>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center'
  },
  descriptionText: {
    marginTop: 75,
    color: 'black',
    opacity: 0.66,
    marginBottom: 15
  },
  textInput: {
    height: '6%',
    width: 312,
    borderRadius: 30,
    borderColor: 'rgba(152,152,152,0.32)',
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 20,
  },
  forgotPassText: {
    fontSize: 13,
    color: 'black',
    opacity: 0.66,
    marginLeft: '31%',
    width: '84%',
    textAlign: 'center',
    marginBottom: 22
  },
  confirmButton: {
    textAlign: 'center',
    width: 232,
    height: 33,
    fontSize: 17
  },
  connectionIssue: {
    alignSelf: 'center',
    fontSize: 13,
    marginTop: 12,
    color: colors.mainPink
  },
  adsContainer: {
    marginTop: 42,
    width: '100%',
    height: '100%'
  }
})