import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home";
import HeaderHome from "../components/headerHome";
import CreatePostScreen from "../screens/createPost";
import ProfileScreen from "../screens/profile";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Drawer } from "react-native-paper";
import { useDispatch } from "react-redux";
import { logout } from "../redux/action";
import CommentScreen from "../screens/comment";
import FindScreen from "../screens/Find";
import UserProfileScreen from "../screens/userProfile";


const AppNav = () => {
  const Stack = createStackNavigator();
  return (
    <>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={ProfileNavigation}
                      options={{ header: (props) => (<HeaderHome {...props} />) }} />
        <Stack.Screen name="Follow" component={FindScreen} />
        <Stack.Screen name="User Profile" component={UserProfileScreen} />
        <Stack.Screen name="Comments" component={CommentScreen} />
      </Stack.Navigator>
    </>
  );
};

const ProfileNavigation = () => {
  const Stack = createDrawerNavigator();

  const dispatch = useDispatch();
  return (
    <>
      <Stack.Navigator initialRouteName="Settings" screenOptions={({ navigation }) => ({
        drawerPosition: "right", headerLeft: false, headerShown: false,
      })
      } drawerContent={(props) => (
        <Drawer.Section style={{ padding: 5 }}>
          <Drawer.Item
            label="FIND"
            icon="magnify"
            onPress={() => props.navigation.navigate("Follow")}
            theme={{
              colors: {
                text: "#009ee0",
              },
            }}
          />
          <Drawer.Item
            label="LOGOUT"
            icon="logout"
            onPress={() => dispatch(logout())}
            theme={{
              colors: {
                text: "#009ee0",
              },
            }}
          />
        </Drawer.Section>
      )}>
        <Stack.Screen name="Profile" component={HomeNavigation} options={{
          headerTitle: "",
        }} />
      </Stack.Navigator>
    </>
  );
};

const HomeNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <>
      <Tab.Navigator screenOptions={{
        headerShown: true, tabBarLabelStyle: {
          display: "none",
        },
      }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: ({ color, size, focused }) => {
            return <Icons color={color} size={32} name="home" />;
          }, headerShown: false,
        }} />
        <Tab.Screen name="Add" component={CreatePostScreen} options={{
          tabBarIcon: ({ color, size, focused }) => {
            return <Icons color={color} size={32} name="plus-box" />;
          }
          , headerShown: false,
        }} />
        <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{
          tabBarIcon: ({ color, size, focused }) => {
            return <Icons color={color} size={32} name="account" />;
          }
          , headerShown: false,
        }} />
      </Tab.Navigator>
    </>
  );
};

export default AppNav;

