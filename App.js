import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  ActivityIndicator,
  Dimensions,
  PanResponder,
  Platform,
  Alert,
  CameraRoll,
} from 'react-native';
import Swiper from 'react-native-swiper';
import NetworkImage from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import RNFetchBlob from 'react-native-fetch-blob';
import { ProgressHUD } from './components/ProgressHUD/ProgressHUD';
import { RandService } from './services/RandService/RandService';
import { UtilsService } from './services/UtilsService/UtilsService';

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
    this.currentWallIndex = 0;
    this.isHudVisible = false;
  }

  fetchWalls() {
    const url = 'https://unsplash.it/list';

    fetch(url)
      .then(response => response.json())
      .then(json => {
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
      .catch(error => console.error('fetchWalls error:', error.message || error));
  }

  componentWillMount() {
    this.imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (e, gestureState) => true,
      onPanResponderGrant: this.handlePanResponderGrant.bind(this),
      onPanResponderRelease: () => {},
      onPanResponderTerminate: () => {},
      onShouldBlockNativeResponder: () => false,
    });
  }

  componentDidMount() {
    this.fetchWalls();
  }

  handlePanResponderGrant(e, gestureState) {
    const currentTimestamp = Date.now();
    const {x0, y0} = gestureState;

    if (UtilsService.isDoubleTap(currentTimestamp, this.prevTouchInfo, x0, y0)) {
      this.saveToGallery();
    }

    this.prevTouchInfo = {
      x: x0,
      y: y0,
      timestamp: currentTimestamp,
    };
  }

  async saveToGallery() {
    const {walls} = this.state;
    const currentWall = walls[this.currentWallIndex];
    const currentWallUrl = `https://unsplash.it/${currentWall.width}/${currentWall.height}?image=${currentWall.id}`;

    this.setState({isHudVisible: true});

    try {
      let path = currentWallUrl;

      // On android need download image
      if (Platform.OS === 'android') {
        path = await this.downloadWall(currentWallUrl);
      }

      await CameraRoll.saveToCameraRoll(path);

      this.setState({isHudVisible: false});

      Alert.alert(
        'Сохранено',
        'Изображение успешно добавленно в галлерею',
        [
          {text: 'Отлично', onPress: () => console.log('OK Pressed!')}
        ]
      );
    } catch(error) {
      console.error('saveToGallery error:', error.message || error);
    };
  }

  downloadWall(url) {
    return RNFetchBlob
      .config({
        fileCache: true,
        appendExt : 'jpg',
      })
      .fetch('GET', url)
      .then(response => `file://${response.path()}`)
  }

  onMomentumScrollEnd(e, state, index) {
    this.currentWallIndex = state.index;
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
    const {walls, isLoading, isHudVisible} = this.state;

    return (
      <View style={styles.loadingContainer}>
        <Swiper
          dot={<View style={styles.swiperDot} />}
          activeDot={<View style={styles.swiperDotActive} />}
          loop={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
          index={this.currentWallIndex}
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
        <ProgressHUD width={width} height={height} isVisible={isHudVisible} />
      </View>
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