import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/action";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar } from "react-native-paper";
import axios from "../utils/axios";
import { showMessage } from "react-native-flash-message";
import { errorResponse } from "../utils/errorHanding";
import Loading from "../components/loading/loading";

const FindScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector(state => state.Auth.current_user.access_token);

  const Users = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("User Profile", { _id: item._id })}>
      <View style={{
        flex: 1, flexDirection: "row", alignItems: "center", marginBottom: 15, paddingHorizontal: 15,
      }}>
        <Avatar.Image size={30}
                      source={(item.profileImg) ? { uri: item.profileImg } : require("../assets/images/profile.png")}
                      style={{ marginRight: 10 }} />
        <Text style={{ fontWeight: "bold" }}>{item.username}{"  "}</Text>
      </View>
    </TouchableOpacity>
  );

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/users/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeed(response.data);
    } catch (e) {
      const error_response = errorResponse(e);
      showMessage({
        message: "Users Error",
        description: error_response,
        backgroundColor: "#b50202",
        icon: { icon: "danger", position: "left" },
      });
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   getFeed();
  // }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setLoading(true);
      getUsers();
    });
  }, []);

  if (loading) {
    return <Loading animating={loading} />;
  } else {
    return (
      <>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 0 }}>
          {(feed.length === 0) ?
            <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 24, color: "#777777" }}> No Users</Text>
            </View> :
            <FlatList data={feed} renderItem={Users} keyExtractor={posts => posts._id} />
          }
        </SafeAreaView>
      </>
    );
  }
};

export default FindScreen;
