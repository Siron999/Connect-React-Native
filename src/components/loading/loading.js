import React from 'react';
import { View } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";

const Loading = (props) => {
  return(
    <View style={{flex:1,justifyContent:"center",backgroundColor:"#fff"}}>
      <ActivityIndicator color={"#009ee0"} {...props}/>
    </View>
  )
}

export default Loading;
