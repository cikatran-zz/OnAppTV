import React from 'react'
import {Platform, StyleSheet, Text, View} from 'react-native'
import {colors} from '../utils/themeConfig'

class PinkRoundedButton extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.labelStyle, this.props.style]}>
                <Text style={styles.textStyle}>
                    {this.props.text}
                </Text>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    labelStyle: {
        borderRadius: (Platform.OS === 'ios') ? 13 : 25,
        paddingHorizontal: 15,
        backgroundColor: colors.mainPink,
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        overflow: "hidden",
    },
    textStyle: {
        fontSize: 10,
        color: colors.textWhitePrimary,
    }
});

export default PinkRoundedButton;
