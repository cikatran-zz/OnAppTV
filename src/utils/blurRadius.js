import {
    Platform
} from 'react-native'

export function getBlurRadius(radius) {
    if (Platform.OS === 'ios') {
        return radius;
    }
    return radius * 5;
}