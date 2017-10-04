// @flow

import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

type Props = {
  width: number,
  height: number,
  isVisible: boolean,
}

export default class ProgressHUD extends Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {width, height, isVisible} = this.props;

    const styles = StyleSheet.create({
      indicatorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      indicator: {
        margin: 15,
      },
      label: {
        color: '#fff',
      }
    });

    if (isVisible) {
      return (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator
            animating={true}
            color={'#fff'}
            size={'large'}
            style={styles.indicator}
          />
          <Text style={styles.label}>Сохраняем...</Text>
        </View>
      );
    } else {
      return (<View></View>);
    }
  }
}