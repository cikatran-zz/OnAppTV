import React from 'react'
import {
    StyleSheet, ImageBackground, View, Text, Image, TouchableOpacity
} from 'react-native'
import {colors, textWhiteDefault} from '../utils/themeConfig'
import {DotsLoader} from "react-native-indicator";

class VideoThumbnail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadImageError: false
        }
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

    _renderImageContent = () => {
        const {loading, loadImageError} = this.state;
        const {textCenter}  = this.props;
        if (loading) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <DotsLoader color={colors.textGrey} size={5} betweenSpace={10}/>
                </View>
            )
        }

        if (loadImageError) {
            return (
                <Text style={styles.errorMessage}>Cannot load data. Please check your internet connection</Text>
            )
        }


        return (
            <View>
                <View style={[styles.progressView, this._runProgressView()]}/>
                <Text style={styles.textCenter}>{textCenter}</Text>
            </View>
        )
    }

    render() {

        let source = require('../assets/bg_category.png');
        if (this.props.imageUrl != null) {
            source = {uri: this.props.imageUrl};
        }
        return (
            <View style={[this.props.style]}>
                <ImageBackground
                    onLoadStart={(e) => this.setState({loading: true})}
                    onLoad={() => this.setState({loading: false})}
                    onError={(error) => this.setState({loadImageError: true})}
                    imageStyle={{borderRadius: 3}} style={styles.imageContainer}
                    source={source}>
                    {this._renderImageContent()}
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
    },
    errorMessage: {
        height:'100%',
        color: colors.whiteBackground,
        fontSize: 20,
        width: '100%',
        textAlign: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 3
    },
});

export default VideoThumbnail;
