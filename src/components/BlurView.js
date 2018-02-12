import PropTypes from 'prop-types';
import {requireNativeComponent, ViewPropTypes} from 'react-native';

let blurview = {
  name: 'BlurView',
  propTypes: {
    blurRadius: PropTypes.number,
    overlayColor: PropTypes.number,
    ...ViewPropTypes, // include the default view properties
  },
};

const BlurView = requireNativeComponent('RCTBlurView', blurview);
export default BlurView