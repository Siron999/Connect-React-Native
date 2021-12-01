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

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector(state => state.Auth.current_user.access_token);

  const handleLike = async (id) => {
    try {
      await axios.post("/api/posts/like", {
        postId: id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      const error_response = errorResponse(e);
      showMessage({
        message: "Like Error",
        description: error_response,
        backgroundColor: "#b50202",
        icon: { icon: "danger", position: "left" },
      });
    }
    await getFeed();
  };

  const Posts = ({ item }) => (
    <Card>
      <Card.Content style={{ paddingHorizontal: 0 }}>
        <TouchableOpacity onPress={() => navigation.navigate("User Profile", { _id: item.userId })}>
          <View style={{
            flex: 1, flexDirection: "row", alignItems: "center", marginBottom: 5, paddingHorizontal: 15,
          }}>
            <Avatar.Image size={30}
                          source={(item.profileImg) ? { uri: item.profileImg } : require("../assets/images/profile.png")}
                          style={{ marginRight: 10 }} />
            <Text style={{ fontWeight: "bold" }}>{item.username}</Text>
          </View>
        </TouchableOpacity>
        <Card.Cover source={{ uri: item.postImg }} style={{ height: 400 }} />
        <View style={{
          flex: 1, flexDirection: "row", alignItems: "center", marginVertical: 5, paddingHorizontal: 15,
        }}>
          <TouchableOpacity onPress={() => handleLike(item._id)}>
            {item.liked ? <Icons size={26} name="heart" color="#009ee0" style={{ marginRight: 15 }} /> :
              <Icons size={26} name="heart-outline" color="#009ee0" style={{ marginRight: 15 }} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Comments", item)}>
            <Icons size={26} name="comment-outline" color="#009ee0" />
          </TouchableOpacity>
        </View>
        <View style={{
          flex: 1, flexDirection: "column", justifyContent: "center", marginVertical: 0, paddingHorizontal: 15,
        }}>
          <Text style={{ fontWeight: "bold" }}>{item.likes?.length} likes</Text>
          <Text style={{ fontWeight: "bold" }}>{item.username}{"  "}<Text
            style={{ fontSize: 14 }}>{item.caption}</Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate("Comments", item)}><Text
            style={{ fontSize: 12, color: "#8c8c8c" }}>View Comments</Text></TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const getFeed = async () => {
    try {
      const response = await axios.get("/api/users/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeed(response.data);
    } catch (e) {
      const error_response = errorResponse(e);
      showMessage({
        message: "User Feed Error",
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
      getFeed();
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
              <Text style={{ fontSize: 24, color: "#777777" }}> No Feed</Text>
            </View> :
            <FlatList data={feed} renderItem={Posts} keyExtractor={posts => posts._id} />
          }
        </SafeAreaView>
      </>
    );
  }
};

export default HomeScreen;
