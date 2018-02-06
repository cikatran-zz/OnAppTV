import React from 'react'
import {View, Text, Button} from 'react-native'

export default class VideoControlModal extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    )
  }
}