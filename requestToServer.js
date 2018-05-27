
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  NetInfo
} from 'react-native';

var CryptoJS = require("crypto-js");
var sha256 = require('js-sha256');

var ImagePicker = require('react-native-image-picker');

var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class RequestToServer extends Component<{}> {
  static navigationOptions = {
    title: 'Property Finder',
  };

  constructor(props) {
    super(props);
    this.state = {
      hash: '',
      city: 'Минск',
      region: 'Минская',
      address: 'ул.Тульская, д.9',
      type: 'Коттедж',
      price: '1200000',
      rooms: '4',
      floors: '3',
      land_area: '5.85',
      total_area: '400',
      living_space: '166',
      lat: '53.945700',
      lng : '27.582700',
      fileName: 'house.jpg',
      data: '/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJBMzA0RjQ2NTYyNzExRTg5ODNDQTJBNzQxNDQwRjREIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJBMzA0RjQ3NTYyNzExRTg5ODNDQTJBNzQxNDQwRjREIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkEzMDRGNDQ1NjI3MTFFODk4M0NBMkE3NDE0NDBGNEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkEzMDRGNDU1NjI3MTFFODk4M0NBMkE3NDE0NDBGNEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYG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',
      owner: 'Агентство недвижимости "Сильван"',
      contacts: '+375 29 633-58-08',
      description: 'Стильный дизайн-проект оптимального метража, открытая терраса и беседка из сибирской лиственницы, 10 минут до центра города'
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

  _onCityChanged = (event) => {
    this.setState({ city: event.nativeEvent.text });
  };

  _onRegionChanged = (event) => {
    this.setState({ region: event.nativeEvent.text });
  };

  _onAddressChanged = (event) => {
    this.setState({ address: event.nativeEvent.text });
  };

  _onTypeChanged = (event) => {
    this.setState({ type: event.nativeEvent.text });
  };

  _onPriceChanged = (event) => {
    this.setState({ price: event.nativeEvent.text });
  };

  _onRoomsChanged = (event) => {
    this.setState({ rooms: event.nativeEvent.text });
  };

  _onFloorsChanged = (event) => {
    this.setState({ floors: event.nativeEvent.text });
  };

  _onLandAreaChanged = (event) => {
    this.setState({ land_area: event.nativeEvent.text });
  };

  _onTotalAreaChanged = (event) => {
    this.setState({ total_area: event.nativeEvent.text });
  };

  _onLivingSpaceChanged = (event) => {
    this.setState({ living_space: event.nativeEvent.text });
  };

  _onLatitudeChanged = (event) => {
    this.setState({ lat: event.nativeEvent.text });
  };

  _onLongitudeChanged = (event) => {
    this.setState({ lng: event.nativeEvent.text });
  };

  _onOwnerChanged = (event) => {
    this.setState({ owner: event.nativeEvent.text });
  };

  _onContactsChanged = (event) => {
    this.setState({ contacts: event.nativeEvent.text });
  };

  _onDescriptionChanged = (event) => {
    this.setState({ description: event.nativeEvent.text });
  };

  _onSearchPressed = () => {

    var key = 'qwertyuiopasdfghjklzxcvbnmqwerty';
    var str = JSON.stringify(this.state.city + this.state.region + this.state.address);
    var hash = sha256(str).toUpperCase();
    var obj = this.state;
    obj.hash = hash;

    var newStr = JSON.stringify(obj);
    var ciphertext = CryptoJS.AES.encrypt(newStr, key);
    var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);

    function reqListener() {
      alert(this.responseText);
    }

    function reqError(error) {
      if(error) throw error;
    }

    if(this.state.status) {
      var params = 'encdata=' + ciphertext.toString();
      var address = 'https://secure-waters-60346.herokuapp.com/api/posts/addhome';
      var oReq = new XMLHttpRequest();
      oReq.onload = reqListener;
      oReq.onerror = reqError;
      oReq.open('post', address, true);
      oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      oReq.send(params);
    }
    else {
      alert('Подключитесь к интернету');
    }
  };

  render() {

    let imgName = this.state.fileName == null ? null:
      <Text style={styles.text}>{this.state.fileName}</Text>

    return (          
      <View style={styles.container}>
        <View style={styles.flowRight}>
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.city}
           onChange={this._onCityChanged}
           placeholder='Город'/>
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.region}
           onChange={this._onRegionChanged}
           placeholder='Область'/>
        </View>
           <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInputBig}
           value={this.state.address}
           onChange={this._onAddressChanged}
           placeholder='Адрес'/>
        <View style={styles.flowRight}>   
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.type}
           onChange={this._onTypeChanged}
           placeholder='Тип объекта'/>
           <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.price}
           onChange={this._onPriceChanged}
           placeholder='Цена'/>
        </View>
        <View style={styles.flowRight}>   
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.rooms}
           onChange={this._onRoomsChanged}
           placeholder='Количество комнат'/>
           <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.floors}
           onChange={this._onFloorsChanged}
           placeholder='Количество этажей'/>
        </View>
        <View style={styles.flowRight}>   
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInputLittle}
           value={this.state.land_area}
           onChange={this._onLandAreaChanged}
           placeholder='Площадь участка'/>
           <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInputLittle}
           value={this.state.total_area}
           onChange={this._onTotalAreaChanged}
           placeholder='Площадь общая'/>
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInputLittle}
           value={this.state.living_space}
           onChange={this._onLivingSpaceChanged}
           placeholder='Площадь жилая'/>
        </View> 
        <View style={styles.flowRight}>
           <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.lat}
           onChange={this._onLatitudeChanged}
           placeholder='Широта'/>
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInput}
           value={this.state.lng}
           onChange={this._onLongitudeChanged}
           placeholder='Долгота'/>
        </View>
        <View style={styles.flow}>
          <Button
            onPress={this.show.bind(this)}
            style={styles.searchImage}
            title='Добавить фото'
          />
          {imgName}
        </View>
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInputBig}
           value={this.state.owner}
           onChange={this._onOwnerChanged}
           placeholder='Собственник'/>
           <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInputBig}
           value={this.state.contacts}
           onChange={this._onContactsChanged}
           placeholder='Контакты'/>
          <TextInput
           underlineColorAndroid={'transparent'}
           style={styles.searchInputBig}
           value={this.state.description}
           onChange={this._onDescriptionChanged}
           placeholder='Описание'/>
          <Button
            onPress={this._onSearchPressed}
            color='#48BBEC'
            title='Добавить'
          />
      </View>
    );
  }

  show() {
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let data = response.data;
        let fileName = response.fileName;

        this.setState({
          fileName: fileName,
          data: data
        });
      }
    });
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    width: 160
  },
  flow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 5
  },
  container: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 5
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginLeft: 5,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 18,
    width: 150,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  searchInputLittle: {
    height: 36,
    padding: 4,
    marginLeft: 5,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 18,
    width: 50,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  searchInputBig: {
    height: 36,
    padding: 4,
    marginTop: 5,
    marginBottom: 5,
    flexGrow: 1,
    fontSize: 18,
    borderWidth: 1,
    width: 310,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  searchImage: {
    height: 36,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138,
  },
});