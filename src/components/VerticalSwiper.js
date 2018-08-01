import React, {PureComponent} from 'react';
import { BackHandler, StyleSheet, Animated, View, PanResponder, Dimensions } from 'react-native';
import {colors} from '../utils/themeConfig'
const screenHeight = Dimensions.get("window").height;

type Props = {
  // Amount of space available for the user to swipe down (from the content, so it wont work above the offset)
  closeSwipeOffset: number,
  // Amount of space available for the user to swipe up (from the very bottom)
  openSwipeOffset: number,
  // If the user moves up this amount of pixel, we consider he wants to open and it will do so automatically
  openSwipeThreshold: number,
  // If the user moves down this amount of pixel, we consider he wants to close and it will do so automatically
  closeSwipeThreshold: number,
  // Amount of pixel that separate the content (when opened) from the very top of the screen
  offsetTop: number,
  // If true, the user wont be able to take it up over the maximum
  blockAtTop?: boolean,
  // If true, the content will be wrapped in a container whose height fill the rest of the screen
  fillWithScreenHeight?: boolean,
  // The position considered to be the bottom. Initially it's the screen's height
  bottomPosition: number,
  // If set to true, the swipe will be opened on render
  startOpened: boolean
}

type DefaultProps = Props;
type State = {
  isAnimating: boolean,
  isOpen: boolean,
  position: Object,
}
export default class VerticalSwipe extends PureComponent<DefaultProps, Props, State> {
  _panResponder = null;
  _movable = null;

  _closedPosition : number = null;
  _openPosition = null;

  _hasActivatedThreshold = false;
  _closeMaximumY = null;
  stylesheets = null;


  static defaultProps = {
    closeSwipeOffset: 100,
    openSwipeOffset: 65,
    openSwipeThreshold: 100,
    closeSwipeThreshold: 50,
    offsetTop: 0,
    bottomPosition: screenHeight,
    startOpened: false,
  };

  _backHandler = null;
  handleBack = () => {
    this.close();
    return true;
  };

  /**
   * Return true if the position of the finger is correct to swipe down the content
   * @param position
   * @returns {boolean}
   */
  isWithinClosingThreshold = (position) => {
    return position < this._closeMaximumY && position > this.props.offsetTop;
  };

  /**
   * Initialize the component
   */
  initialize = () => {
    this._closedPosition = Math.floor(this.props.bottomPosition + 2);
    this._openPosition = 0;
    this._closeMaximumY = this.props.offsetTop + this.props.closeSwipeOffset;

    this.state = {
      isAnimating: false,
      isOpen: this.props.startOpened,
      position: new Animated.Value(this.props.startOpened === true ? this._openPosition : this._closedPosition),
    };

    const styles = {
      container: {
        flex: 1,
      },
      swiper: {
        width: "100%",
        // Totally forgot where does this magic constant comes from
        backgroundColor:colors.whitePrimary,
        height: this.props.bottomPosition + 75 - this.props.offsetTop,
        position: "absolute",
        left: 0,
      },
      contentContainer: {
        marginTop: this.props.openSwipeOffset,
      },
    };

    this.stylesheets = StyleSheet.create(styles);
  };

  /**
   * Set the overlay position
   * @param position
   */
  setPosition = (position) => {
    console.log("Position", position)
    this._movable.setNativeProps({
      style: [this.stylesheets.swiper, {
        top: position,
      }]
    });
  };

  onStartShouldSetPanResponder = (evt) => {
    console.log("Start Set PanRes")
    if(this.state.isAnimating === true)
      return false;

    if(this.state.isOpen)
      return this.isWithinClosingThreshold(evt.nativeEvent.pageY);

    return true;
  };

  onPanResponderMove = (evt, gestureState) => {
    console.log("Move PanRes", gestureState.vy)
    if(this.state.isAnimating === true)
      return;

    if(this.state.isOpen === false){
      // We can't go above the very top
      if((this.props.offsetTop - this.props.openSwipeOffset) > (this.props.bottomPosition - this.props.openSwipeOffset + gestureState.dy)) {
        return;
      }

      // Handling the case when opening
      if(gestureState.vy < 0 && this._hasActivatedThreshold === false){
        this._hasActivatedThreshold = true;
      } else if(gestureState.vy >= 0 && this._hasActivatedThreshold === true){
        this._hasActivatedThreshold = false;
      }

      this.setPosition(this.props.bottomPosition + gestureState.dy);
    } else {
      // We cannot go over the minimum position
      if(this._openPosition > this.props.offsetTop - this.props.closeSwipeOffset + gestureState.dy)
        return;

      if(gestureState.vy > 0 && this._hasActivatedThreshold === false){
        this._hasActivatedThreshold = true;
      } else if(gestureState.vy <= 0 && this._hasActivatedThreshold === true){
        this._hasActivatedThreshold = false;
      }

      this.setPosition(this.props.offsetTop + gestureState.dy);
    }
  };

  onPanResponderRelease = (evt, gestureState) => {
    console.log("Release PanRes")
    if(this._hasActivatedThreshold){
      if(this.state.isOpen === false){
        this.state.position.setValue(this.props.bottomPosition + gestureState.dy);
        this.open();
      } else {
        this.state.position.setValue(this.props.offsetTop + gestureState.dy);
        this.close();
      }
    } else {
      if(this.state.isOpen === false){
        this.state.position.setValue(this.props.bottomPosition +  gestureState.dy);
        this.close();
      } else {
        this.state.position.setValue(this.props.offsetTop + gestureState.dy);
        this.open();
      }
    }
  };

  /**
   * Open the swipe
   */
  open = () => {
    console.log("Open")
    if(this.state.isAnimating)
      return;

    if(this._backHandler === null) {
      this._backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBack);
    }

    this.setState({ isAnimating: true, isOpen: true });
    Animated.timing(
      this.state.position, {
        toValue: this._openPosition,
        duration: 300,
      }
    ).start(() => {
      this.setState({ isAnimating: false });
      this._hasActivatedThreshold = false;
    })
  };

  /**
   * Closes the swipe
   */
  close = () => {
    console.log("Close");
    if(this.state.isAnimating)
      return;

    if(this._backHandler !== null) {
      this._backHandler.remove();
      this._backHandler = null;
    }

    this.setState({ isAnimating: true, isOpen: false });
    Animated.timing(
      this.state.position, {
        toValue: this._closedPosition,
        duration: 300,
      }
    ).start(() => {
      this.setState({ isAnimating: false });
      this._hasActivatedThreshold = false;
    })
  };

  getMovableStyle = () => {
    return [this.stylesheets.swiper, {
      top: this.state.position,
    }]
  };

  setMovableRef = (ref) => this._movable = ref;

  constructor(props){
    super(props);
    this.initialize();
  }

  componentWillMount(){
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.onStartShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture: this.onStartShouldSetPanResponder,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
    })
  }
  render() {
    return (
      <View style={this.stylesheets.container}>
        <View style={this.props.style}
              {...this._panResponder.panHandlers}>
          {this.props.children}
        </View>
        <Animated.View
          style={this.getMovableStyle()}
          ref={this.setMovableRef}
          {...this._panResponder.panHandlers}>
            {this.props.content}
        </Animated.View>
      </View>
    );
  }
}