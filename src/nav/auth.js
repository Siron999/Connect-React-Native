import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginScreen from "../screens/login";
import RegisterScreen from "../screens/register";

const AuthNav = () => {
  const Tab = createMaterialTopTabNavigator();
  return(
    <>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled:false,
          tabBarItemStyle:{
            display: "none"
          }
        }}
      >
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} />
      </Tab.Navigator>
    </>
  )
}

export default AuthNav;
