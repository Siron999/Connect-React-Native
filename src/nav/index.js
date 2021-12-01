import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNav from "./auth";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { View } from "react-native";
import { useSelector } from "react-redux";
import Home from "../screens/home";
import AppNav from "./app";

const MainNav = () => {
  const token = useSelector(state => state.Auth.current_user?.access_token)
  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={{flex:1,backgroundColor:"#fff"}}>
            {token?<AppNav/>:<AuthNav />}
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};

export default MainNav;
