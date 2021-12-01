import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Text, Title } from "react-native-paper";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerActions } from "@react-navigation/native";

const HeaderHome = (props) => {
  return (
    <>
      <View style={{
        flex: 0,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 8,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View><Avatar.Image size={30} source={require("../assets/logo.png")}
                              style={{ backgroundColor: "transparent" }} /></View>
          <View style={{ marginLeft: 10 }}>
            <Title style={{ fontSize: 30, paddingTop: 10 }}>Connect</Title>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={() => props.navigation.dispatch(DrawerActions.openDrawer())}>
            <Icons name="menu" size={30} color="#009ee0" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HeaderHome;
