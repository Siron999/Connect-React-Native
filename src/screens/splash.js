import React from "react";
import { View } from "react-native";
import { Avatar, Text, Title } from "react-native-paper";

const SplashScreen = () => {
  return(
    <>
      <View style={{flex:0.8,backgroundColor:"#fff",justifyContent:"center",alignItems:"center"}}>
        <Avatar.Image size={150} source={require('../assets/logo.png')} style={{backgroundColor:"transparent"}} />
      </View>
      <View style={{flex:0.2,backgroundColor:"#fff",justifyContent:"center",alignItems:"center"}}>
        <Title style={{ fontSize: 40,paddingTop:10}}>Connect</Title>
      </View>
    </>
  )
}

export default SplashScreen;
