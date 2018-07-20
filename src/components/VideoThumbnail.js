import React from 'react'
import {
    StyleSheet, ImageBackground, View, Text, Image, TouchableOpacity
} from 'react-native'
import {
    CachedImage
} from 'react-native-cached-image';

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
        const {imageUrl, textCenter, isGenres, style} = this.props;
        let blurRadius = isGenres ? 1 : 0;
        let source = require('../assets/bg_category.png');
        if (imageUrl != null) {
            source = {uri: imageUrl};
        }
        return (
            <View style={[style]}>
                <View style={styles.placeHolder}>
                    <Text style={styles.textPlaceHolder}>On App TV</Text>
                </View>
                <View style={styles.imageContainer} blurRadius={blurRadius}>
                    <CachedImage style={styles.imageContainer} source={source} activityIndicatorProps={{opacity:0}}/>
                    <View style={[styles.progressView, this._runProgressView()]}/>
                    {console.log(source)}
                    <Text style={styles.textCenter}>{textCenter}</Text>
                </View>
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
    },
    placeHolder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        borderWidth: 0.5,
        borderColor: colors.textGrey,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPlaceHolder: {
        color: colors.textGrey
    }
});

export default VideoThumbnail;
