import React from 'react'
import {
    StyleSheet, ImageBackground, View, Text, Image, TouchableOpacity
} from 'react-native'
import {colors, textWhiteDefault} from '../utils/themeConfig'

class VideoThumbnail extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    _renderRedlineProgress = () => {
        const {showProgress} = this.props;
        if (showProgress) {
            return (<View style={[styles.redLine, this._runProgressRedline()]}/>)
        }
    }

    _runProgressView = () => {
        const {progress} = this.props;
        return {
            width: progress
        }
    }

    _runProgressRedline = () => {
        const {progress} = this.props;
        return {
            left: progress
        }
    }

    render() {

        let source = require('../assets/bg_category.png');
        if (this.props.imageUrl !== null) {
            source = {uri: this.props.imageUrl};
        }
        return (
            <View style={[this.props.style]}>
                <ImageBackground imageStyle={{borderRadius: 3}} style={styles.imageContainer} source={source}>
                    <View style={[styles.progressView, this._runProgressView()]}/>
                    <Text style={styles.textCenter}>{this.props.textCenter}</Text>
                </ImageBackground>
                {this._renderRedlineProgress()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 150,
        marginBottom: 18,
        marginHorizontal: 10
    },
    imageContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressView: {
        backgroundColor: colors.progressColor,
        height: '100%',
        width: '0%'
    },
    redLine: {
        position: 'absolute',
        backgroundColor: colors.mainPink,
        height: 16,
        width: 1.5,
        left: '0%',
        bottom: -8
    },
    textCenter: {
        ...textWhiteDefault,
        textAlign: 'center',
        alignSelf: 'center',
        width: 150
    }
});

export default VideoThumbnail;
