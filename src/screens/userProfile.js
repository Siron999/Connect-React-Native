import React, { createRef, useEffect, useState } from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../redux/action";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { FlatList, TouchableOpacity, View } from "react-native";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "../utils/axios";
import { errorResponse } from "../utils/errorHanding";
import { showMessage } from "react-native-flash-message";
import Loading from "../components/loading/loading";
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actions-sheet/index";


const UserProfileScreen = ({ navigation, route }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const auth = useSelector(state => state.Auth.current_user);


  const handleLike = async (id) => {
    try {
      await axios.post("/api/posts/like", {
        postId: id,
      }, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });
      await getUser();
    } catch (e) {
      const error_response = errorResponse(e);
      showMessage({
        message: "Like Error",
        description: error_response,
        backgroundColor: "#b50202",
        icon: { icon: "danger", position: "left" },
      });
    }
  };

  const handleFollow = async (id) => {
    try {
      await axios.post("/api/users/follow", {
        id,
      }, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });
      await getUser();
    } catch (e) {
      const error_response = errorResponse(e);
      showMessage({
        message: "Follow Error",
        description: error_response,
        backgroundColor: "#b50202",
        icon: { icon: "danger", position: "left" },
      });
    }
  };

  const Posts = ({ item }) => (
    <Card>
      <Card.Content style={{ paddingHorizontal: 0 }}>
        <View style={{
          flex: 1, flexDirection: "row", alignItems: "center", marginBottom: 5, paddingHorizontal: 15,
        }}>
          <Avatar.Image size={30}
                        source={(user.profileImg) ? { uri: user.profileImg } : require("../assets/images/profile.png")}
                        style={{ marginRight: 10 }} />
          <Text style={{ fontWeight: "bold" }}>{user.username}</Text>
        </View>
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
          <Text style={{ fontWeight: "bold" }}>{user.username}{"  "}<Text
            style={{ fontSize: 14 }}>{item.caption}</Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate("Comments", item)}><Text
            style={{ fontSize: 12, color: "#8c8c8c" }}>View Comments</Text></TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const getUser = async () => {
    try {
      const response = await axios.get("/api/users/user-info/" + route.params?._id, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });
      setUser(response.data);
    } catch (e) {
      const error_response = errorResponse(e);
      showMessage({
        message: "Current User Error",
        description: error_response,
        backgroundColor: "#b50202",
        icon: { icon: "danger", position: "left" },
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      setLoading(true);
      getUser();
    });
  }, []);

  if (loading) {
    return <Loading animating={loading} />;
  } else {
    return (
      <>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 0, paddingTop: 20 }}>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            alignItems: "center",
          }}>
            <View>
              <Avatar.Image size={80}
                            source={(user.profileImg) ? { uri: user.profileImg } : require("../assets/images/profile.png")}
                            style={{ marginRight: 10 }} />
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>{user.posts.length}</Text>
              <Text style={{ textAlign: "center" }}>Posts</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>{user.followers.length}</Text>
              <Text style={{ textAlign: "center" }}>Followers</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>{user.following.length}</Text>
              <Text style={{ textAlign: "center" }}>Following</Text>
            </View>
          </View>
          <View style={{ paddingLeft: 25, marginTop: 15 }}>
            <Text style={{ fontWeight: "bold" }}>{user.fullName}</Text>
            <Text>@{user.username}</Text>
          </View>
          <View style={{ padding: 15, paddingTop: 5, borderBottomWidth: 0.7, borderBottomColor: "#cdcdcd" }}>
            {(user.followers.filter(x => x._id === auth._id).length > 0) ?
              <Button mode="contained" style={{ marginVertical: 20, borderRadius: 5 }}
                      onPress={() => handleFollow(user._id)}>Unfollow</Button> :
              <Button mode="contained" style={{ marginVertical: 20, borderRadius: 5 }}
                      onPress={() => handleFollow(user._id)}>Follow</Button>
            }

          </View>
          <View style={{ flex: 1 }}>
            {(user.posts.length === 0) ?
              <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 24, color: "#777777" }}> No Posts</Text>
              </View> :
              <FlatList data={user.posts} renderItem={Posts} keyExtractor={posts => posts._id} />
            }
          </View>
        </SafeAreaView>
      </>
    );
  }
};

export default UserProfileScreen;
