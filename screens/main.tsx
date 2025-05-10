import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import mainStyle from '../styles/main.style';

const Main = ({ navigation }: any) => {
  return (
    <View style={mainStyle.container}>
      <Image source={require('../assets/logo.png')} style={mainStyle.logo} />
      <Text style={mainStyle.title}>SAFE CALL</Text>

      <TouchableOpacity style={mainStyle.button} onPress={() => navigation.navigate('Signup')}>
        <Text style={mainStyle.buttonText}>SING UP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={mainStyle.button} onPress={() => navigation.navigate('Login')}>
        <Text style={mainStyle.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Main;
