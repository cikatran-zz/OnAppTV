import PropTypes from 'prop-types';
import {requireNativeComponent, ViewPropTypes} from 'react-native';

let controlModal = {
    name: 'ControlModal',
    propTypes: {
        epg: PropTypes.array,
        index: PropTypes.number,
        isLive: PropTypes.bool,
        videoUrl: PropTypes.string,
        ...ViewPropTypes,
    },
};

const ControlModal = requireNativeComponent('RNControlModal', controlModal);
export default ControlModal;
