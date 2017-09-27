import React, { Component } from 'react';
import { StyleSheet, Text, View, AppRegistry, ActivityIndicator, Dimensions, PanResponder } from 'react-native';
import Swiper from 'react-native-swiper';
import NetworkImage from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import { RandService } from './RandService/RandService';
import { UtilsService } from './UtilsService/UtilsService';

const NUM_WALLPAPERS = 5;

const {width, height} = Dimensions.get('window');

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      walls: [],
      isLoading: true,
    };
    this.imagePanResponder = {};
    this.prevTouchInfo = {
      x: 0,
      y: 0,
      timestamp: 0,
    };
  }

  fetchWalls() {
    const url = 'http://unsplash.it/list';

    fetch(url)
      .then(response => response.json())
      .then(json => {
        console.info('Gotcha wallpapers');
        const randomIds = RandService.uniqueRandomNumbers(NUM_WALLPAPERS, 0, json.length);

        let walls = [];
 
        for(let ids of randomIds) {
          walls.push(json[ids]);
        }

        this.setState({
          isLoading: false,
          walls
        });
      })
      .catch(error => console.error('fetchWalls error', error.message || error));
  }

  componentWillMount() {
    this.imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true, 
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true, 
      onMoveShouldSetPanResponder: (evt, gestureState) => true, 
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: this.handlePanResponderGrant.bind(this),
    });
  }

  componentDidMount() {
    this.fetchWalls();
  }

  handlePanResponderGrant(e, gestureState) {
    const currentTimestamp = Date.now();
    const {x0, y0} = gestureState;

    if (UtilsService.isDoubleTap(currentTimestamp, this.prevTouchInfo, x0, y0)) {
      console.info('Double tap');
    }

    this.prevTouchInfo = {
      x: x0,
      y: y0,
      timestamp: currentTimestamp,
    };
  }

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return this.renderLoadingMessage();
    } else {
      return this.renderResults();
    }
  }

  renderLoadingMessage() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          animating={true}
          color={'#fff'}
          size={'small'}
          style={{margin: 15}}
        />
        <Text style={{color: '#fff'}}>Загружаем...</Text>
      </View>
    );
  }

  renderResults() {
    const {walls, isLoading} = this.state;
    return (
      <Swiper
        dot={<View style={styles.swiperDot} />}
        activeDot={<View style={styles.swiperDotActive} />}
        loop={false}
      >
        {walls.map((wallpaper, index) => {
          return (
            <View key={index} style={styles.wallpaperContainer}>
              <NetworkImage 
                source={{ uri: `https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}` }}
                indicator={ProgressCircle}
                indicatorProps={{
                  color: '#fff',
                  size: 60,
                  thickness: 7,
                }}
                style={styles.wallpaperImage}
                {...this.imagePanResponder.panHandlers}
              >
                <Text style={styles.label}>Фотограф:</Text>
                <Text style={styles.labelAuthor}>{wallpaper.author}</Text>
              </NetworkImage>
            </View>
          );
        })}
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperDot: {
    backgroundColor: 'rgba(255,255,255,.4)',
    width: 8,
    height: 8,
    borderRadius: 10,
    margin: 3,
  },
  swiperDotActive: {
    backgroundColor: '#fff',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
  },
  wallpaperContainer: {
    width,
    height,
    backgroundColor: '#000'
  },
  wallpaperImage: {
    flex: 1,
    width,
    height,
  },
  label: {
    position: 'absolute',
    color: '#fff',
    fontSize: 13,
    backgroundColor: 'rgba(0, 0, 0, .8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: width/2,
  },
  labelAuthor: {
    position: 'absolute',
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, .8)',
    padding: 2,
    paddingLeft: 5,
    top: 43,
    left: 20,
    width: width/2,
  }
});

AppRegistry.registerComponent('App', () => App);