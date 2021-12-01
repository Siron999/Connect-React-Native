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


const ProfileScreen = ({ navigation }) => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector(state => state.Auth.current_user);

  const actionSheetRef = createRef();

  const handleSubmit = async (img) => {
    setLoading(true);
    if (img !== "" && img !== undefined) {
      try {
        await axios.put("/api/users/change-profile-pic", {
          profileImg: img,
        }, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        await getCurrentUser();
      } catch (e) {
        const error_response = errorResponse(e);
        showMessage({
          message: "Profile Pic Error",
          description: error_response,
          backgroundColor: "#b50202",
          icon: { icon: "danger", position: "left" },
        });
      }
    } else {
      showMessage({
        message: "Image Required",
        description: "Please upload an image",
        backgroundColor: "#b50202",
        icon: { icon: "danger", position: "left" },
      });
    }
    setLoading(false);
  };

  const handleCamera = () => {
    ImagePicker.openCamera(
      {
        includeBase64: true,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      },
    )
      .then(async (image) => await handleSubmit(`data:${image.mime};base64,${image.data}`))
      .catch(err => console.log(err));
    actionSheetRef.current?.hide();
  };

  const handleGallery = () => {
    ImagePicker.openPicker(
      {
        includeBase64: true,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      },
    )
      .then(async (image) => await handleSubmit(`data:${image.mime};base64,${image.data}`))
      .catch(err => console.log(err));
    actionSheetRef.current?.hide();
  };

  const handleLike = async (id) => {
    try {
      await axios.post("/api/posts/like", {
        postId: id,
      }, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });
      await getCurrentUser();
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

  const Posts = ({ item }) => (
    <Card>
      <Card.Content style={{ paddingHorizontal: 0 }}>
        <View style={{
          flex: 1, flexDirection: "row", alignItems: "center", marginBottom: 5, paddingHorizontal: 15,
        }}>
          <Avatar.Image size={30}
                        source={(auth.profileImg) ? { uri: auth.profileImg } : require("../assets/images/profile.png")}
                        style={{ marginRight: 10 }} />
          <Text style={{ fontWeight: "bold" }}>{auth.username}</Text>
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
          <Text style={{ fontWeight: "bold" }}>{auth.username}{"  "}<Text
            style={{ fontSize: 14 }}>{item.caption}</Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate("Comments", item)}><Text
            style={{ fontSize: 12, color: "#8c8c8c" }}>View Comments</Text></TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  useEffect(() => {
    setFeed(auth.posts);
  });

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/api/users/current-user-info", {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });
      dispatch(currentUser(response.data));
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
      getCurrentUser();
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
              <TouchableOpacity onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}>
                <Avatar.Image size={80}
                              source={(auth.profileImg) ? { uri: auth.profileImg } : require("../assets/images/profile.png")}
                              style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>{auth.posts.length}</Text>
              <Text style={{ textAlign: "center" }}>Posts</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>{auth.followers.length}</Text>
              <Text style={{ textAlign: "center" }}>Followers</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>{auth.following.length}</Text>
              <Text style={{ textAlign: "center" }}>Following</Text>
            </View>
          </View>
          <View style={{ paddingLeft: 25, marginTop: 15 }}>
            <Text style={{ fontWeight: "bold" }}>{auth.fullName}</Text>
            <Text>@{auth.username}</Text>
          </View>
          <View style={{ padding: 15, paddingTop: 5, borderBottomWidth: 0.7, borderBottomColor: "#cdcdcd" }}>
            <Button mode="contained" style={{ marginVertical: 20, borderRadius: 5 }}>Edit Profile</Button>
          </View>
          <View style={{ flex: 1 }}>
            {(feed.length === 0) ?
              <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 24, color: "#777777" }}> No Posts</Text>
              </View> :
              <FlatList data={feed} renderItem={Posts} keyExtractor={posts => posts._id} />
            }
          </View>
        </SafeAreaView>
        <ActionSheet ref={actionSheetRef} containerStyle={{
          backgroundColor: "#fff",
          flex: 1,
        }} animated={true} bounceOnOpen={true} gestureEnabled={true}>
          <View style={{
            flex: 0,
            borderRadius: 50,
            paddingVertical: 50,
            paddingHorizontal: 0,
            flexDirection: "row",
            // alignItems: "flex-start",
            justifyContent: "center",
          }}>
            <TouchableOpacity
              onPress={handleCamera}>
              <View>
                <View style={{
                  height: 80,
                  width: 100,
                  borderWidth: 1,
                  borderColor: "#009ee0",
                  borderRadius: 8,
                  marginRight: 40,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Icons

                    name="camera"
                    color="#009ee0"
                    size={50}
                  />
                </View>
                <View style={{
                  padding: 5,
                  width: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}><Text style={{ fontSize: 16 }}>Camera</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGallery}>
              <View>
                <View style={{
                  height: 80,
                  width: 100,
                  borderWidth: 1,
                  borderColor: "#009ee0",
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Icons

                    name="folder-image"
                    color="#009ee0"
                    size={50}
                  />
                </View>
                <View style={{
                  padding: 5,
                  width: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}><Text style={{ fontSize: 16 }}>Gallery</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ActionSheet>
      </>
    );
  }
};

export default ProfileScreen;
