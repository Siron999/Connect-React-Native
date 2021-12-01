/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import type { Node } from "react";
import { Provider as PaperProvider, DefaultTheme, configureFonts } from "react-native-paper";
import MainNav from "./nav";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import Home from "./screens/home";
import SplashScreen from "./screens/splash";
import { View } from "react-native";
import FlashMessage from "react-native-flash-message";
import "react-native-gesture-handler";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Reanimated 2"]);

console.disableYellowBox = true;

const fontConfig = {
  web: {
    regular: {
      fontFamily: "Poppins-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Poppins-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Poppins-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Poppins-ExtraLight",
      fontWeight: "normal",
    },
  },
  ios: {
    regular: {
      fontFamily: "Poppins-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Poppins-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Poppins-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Poppins-ExtraLight",
      fontWeight: "normal",
    },
  },
  android: {
    regular: {
      fontFamily: "Poppins-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Poppins-SemiBold",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Poppins-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Poppins-ExtraLight",
      fontWeight: "normal",
    },
  },
};

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#009ee0",
    accent: "#00006a",
    text: "#00006a",
    background: "#fff",
    placeholder: "rgba(0,158,224,0.45)",
  },
  fonts: configureFonts(fontConfig),
};

const App: () => Node = () => {
  return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor} loading={
        <PaperProvider theme={theme}>
          <SplashScreen />
        </PaperProvider>}
                   onBeforeLift={() => new Promise(resolve => setTimeout(resolve, 3000))}>
        <PaperProvider theme={theme}>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MainNav />
            <FlashMessage position="top" floating={true} />
          </View>
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;
