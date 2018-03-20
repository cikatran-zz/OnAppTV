import {requireNativeComponent, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

let stbConnectionView = {
    name: 'STBConnectionView',
    propTypes: {
        onFinished: PropTypes.func,
        ...ViewPropTypes, // include the default view properties
    },
};

module.exports = requireNativeComponent('RNTSTBConnectionView', stbConnectionView);