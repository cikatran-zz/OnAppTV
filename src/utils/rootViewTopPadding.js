import {
    Platform, Dimensions
} from 'react-native'

export function rootViewTopPadding() {
    if (Platform.OS === 'ios') {
        if (Dimensions.get('window').width == 315 && Dimensions.get('window').width == 812) {
            return 44;
        } else {
            return 24;
        }
    }
    return 0;
}