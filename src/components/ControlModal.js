import {requireNativeComponent, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

let controlModal = {
    name: 'ControlModal',
    propTypes: {
        index: PropTypes.number,
        isLive: PropTypes.bool,
        items: PropTypes.array,
        onClose: PropTypes.func,
        onDetail: PropTypes.func,
        onAlert: PropTypes.func,
        onShare: PropTypes.func,
        ...ViewPropTypes, // include the default view properties
    },
};

module.exports = requireNativeComponent('RNControlModal', controlModal, {
    nativeOnly: {onClose: true, onDetail: true, onAlert: true, onShare: true}
});