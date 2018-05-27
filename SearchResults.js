
'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
} from 'react-native';

class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.index);
  }

  render() {
    const item = this.props.item;

    return (
      <TouchableHighlight
        onPress={this._onPress}>
        <View>
          <View style={styles.rowContainer}>
            <View>
              <Image style={styles.thumb} source={{uri: 'data:image/jpg;base64,' + item.data}} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.price}>{item.city}</Text>
              <Text style={styles.title}
                numberOfLines={1}>{item.address}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class SearchResults extends Component {
  static navigationOptions = {
    title: 'Results',
  };

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  );

  _onPressItem = (index) => {
    var property = this.props.navigation.state.params.listings[index];
    
    this.props.navigation.navigate(
      'Property', {property: property});
  };

  render() {
    const { params } = this.props.navigation.state;
    
    return (
      <FlatList
        data={params.listings}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#323232'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
});