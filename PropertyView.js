
'use strict';
 
import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableHighlight,
  FlatList,
  Text,
} from 'react-native';

export default class PropertyView extends Component {
	static navigationOptions = {
    title: 'Property',
  };
 
  render() {
    var property = this.props.navigation.state.params.property;
 
    return (
      <ScrollView style={styles.container}>
        <Image style={styles.image}
            source={{uri: 'data:image/jpg;base64,' + property.data}} />
        <View style={styles.heading}>
          <Text style={styles.price}>Стоимость: {property.price}$</Text>
          <Text style={styles.title}>{property.city}, {property.address}</Text>
        </View>
        <Text style={styles.description}>Тип объекта: {property.type}</Text>
        <Text style={styles.description}>Область: {property.region}</Text>
        <Text style={styles.description}>Комнат: {property.rooms}</Text>
        <Text style={styles.description}>Этажей: {property.floors}</Text>
        <Text style={styles.description}>Площадь участка: {property.land_area} соток</Text>
        <Text style={styles.description}>Площадь общая: {property.total_area}м2</Text>
        <Text style={styles.description}>Площадь жилая: {property.living_space}м2</Text>
        <View style={styles.heading}>
          <Text style={styles.description}>Собственник: {property.owner}</Text>
          <Text style={styles.description}>Контакты: {property.contacts}</Text>
        </View>
        <Text style={styles.description}>Описание: {property.description}</Text>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 360,
    height: 250
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  }
});
