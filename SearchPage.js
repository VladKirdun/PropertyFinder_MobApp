
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
  NetInfo
} from 'react-native'; 

const Realm = require('realm');

const HomesSchema = {
  name: 'homes',
  properties: {
    hash: 'string',
    city: 'string',
    region: 'string',
    address: 'string',
    type: 'string',
    price: 'string',
    rooms: 'string',
    floors: 'string',
    land_area: 'string',
    total_area: 'string',
    living_space: 'string',
    lat: 'string',
    lng : 'string',
    fileName: 'string',
    data: 'string',
    owner: 'string',
    contacts: 'string',
    description: 'string'
  }
};

export default class SearchPage extends Component<{}> {
  static navigationOptions = {
    title: 'Property Finder',
  };
  
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'Минск',
      message: '',
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ status: isConnected }); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected });
    // alert('is connected: ' + this.state.status);
  }

  _onSearchTextChanged = (event) => {
    this.setState({ searchString: event.nativeEvent.text });
  };

  _onPushNewHome = () => {
    var property = this.props.navigation.state.params.listings;
    const { navigate } = this.props.navigation;
      
    function reqListener() {
      if(this.responseText === 'bad') {
        alert('Пожалуйста, авторизуйтесь');
        navigate('Authentication');
      }
      else {
        navigate('requestToServer');
      }
    }

    function reqError(error) {
      if(error) throw error;
    }

    if(this.state.status) {
      var address = 'https://secure-waters-60346.herokuapp.com/api/posts';
      var oReq = new XMLHttpRequest();
      oReq.onload = reqListener;
      oReq.onerror = reqError;
      oReq.open('post', address, true);
      oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      oReq.setRequestHeader('Authorization', address + ' ' + property.token);
      oReq.send();
    }
    else {
      alert('Подключитесь к интернету');
    }

  };

  _onSearchPressed = () => {
      
    var property = this.props.navigation.state.params.listings;
    const { navigate } = this.props.navigation;
    var searchStr = this.state.searchString;

    function reqListener() {
      if(this.responseText === 'bad') {
        alert('Пожалуйста, авторизуйтесь');
        navigate('Authentication');
      }
      else {
        var address = 'https://secure-waters-60346.herokuapp.com/api/posts/homes?city=' + searchStr;
        var oReq2 = new XMLHttpRequest();
        oReq2.onload = reqListener2;
        oReq2.onerror = reqError2;
        oReq2.open('get', address, true);
        oReq2.send();
      }
    }

    function reqError(error) {
      if(error) throw error;
    }

    if(this.state.status) {
      var address = 'https://secure-waters-60346.herokuapp.com/api/posts';
      var oReq = new XMLHttpRequest();
      oReq.onload = reqListener;
      oReq.onerror = reqError;
      oReq.open('post', address, true);
      oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      oReq.setRequestHeader('Authorization', address + ' ' + property.token);
      oReq.send();
    }
    else {
      Realm.open({schema: [HomesSchema]})
        .then(realm => {
          realm.write(() => {
            var homesFind = realm.objects('homes').filtered('city="' + searchStr + '"');
            if(JSON.stringify(homesFind) === '{}') {
              alert('Подключитесь к интернету');
            }
            else {
              var homesArr = '[';
              for(var i = 0; i < homesFind.length; i++) {
                if(i === homesFind.length-1) {
                  homesArr += JSON.stringify(homesFind[i]);
                }
                else {
                  homesArr += JSON.stringify(homesFind[i]) + ',';
                }
              }
              homesArr += ']'
              navigate('Results', {listings: JSON.parse(homesArr)});
            }
          });
          realm.close();
        })
        .catch(error => {
          alert(error);
        });
    }

    function reqListener2() {
      if(this.responseText !== '[]') {
        var responseArr = JSON.parse(this.responseText);
        Realm.open({schema: [HomesSchema]})
        .then(realm => {
          realm.write(() => {
            for(var i = 0; i < responseArr.length; i++) {
              var homeFind = realm.objects('homes').filtered('hash="' + responseArr[i].hash + '"');
              if(JSON.stringify(homeFind) === '{}') {
                var newHome = realm.create('homes', {
                  hash: responseArr[i].hash,
                  city: responseArr[i].city,
                  region: responseArr[i].region,
                  address: responseArr[i].address,
                  type: responseArr[i].type,
                  price: responseArr[i].price,
                  rooms: responseArr[i].rooms,
                  floors: responseArr[i].floors,
                  land_area: responseArr[i].land_area,
                  total_area: responseArr[i].total_area,
                  living_space: responseArr[i].living_space,
                  lat: responseArr[i].lat,
                  lng : responseArr[i].lng,
                  fileName: responseArr[i].fileName,
                  data: responseArr[i].data,
                  owner: responseArr[i].owner,
                  contacts: responseArr[i].contacts,
                  description: responseArr[i].description
                });
              }
            }
          });
          realm.close();
        })
        .catch(error => {
          alert(error);
        });

        navigate('Results', {listings: JSON.parse(this.responseText)});
      }
      else {
        alert('По вашему запросу ничего не найдено');
      }
    }

    function reqError2(error) {
      if(error) throw error
    }

  };

  render() {
    const { params } = this.props.navigation.state;

    let home = params.listings.type === 'user' ? undefined:
      <Button
        onPress={this._onPushNewHome}
        color='#48BBEC'
        title='Добавить недвижимость'
      />

    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name.
        </Text>
        <View style={styles.flowRight}>
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.searchString}
           onChange={this._onSearchTextChanged}
           placeholder='Search via name or postcode'/>
          <Button
            onPress={this._onSearchPressed}
            color='#48BBEC'
            title='Go'
          />
        </View>
        <Image source={require('./Resources/house.png')} style={styles.image}/>
        <Text style={styles.description}>{this.state.message}</Text>
        {home}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  image: {
    width: 217,
    height: 138,
  },
});