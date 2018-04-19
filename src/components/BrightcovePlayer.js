import PropTypes from 'prop-types';
import {requireNativeComponent, ViewPropTypes} from 'react-native';

let brightcovePlayer = {
    name: 'Brightcove',
    propTypes: {
        videoId: PropTypes.string,
        accountId: PropTypes.string,
        policyKey: PropTypes.string,
        metaData: PropTypes.object,
        ...ViewPropTypes, // include the default view properties
    },
};

module.exports = requireNativeComponent('RNTBrightcovePlayer', brightcovePlayer);