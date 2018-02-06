import React from 'react'
import {Modal} from 'react-native'

export default class VideoControlModal extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Modal
        visible={this.props.video.show}
        animationType={'slide'}
        onRequestClose={() => this.props.showVideoModal(false)}
      />
    )
  }
}