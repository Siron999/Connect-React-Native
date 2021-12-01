import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View, TextInput, Keyboard } from "react-native";
import { Avatar, Button, Card, HelperText, Paragraph, Text, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import axios from "../utils/axios";
import { showMessage } from "react-native-flash-message";
import { errorResponse } from "../utils/errorHanding";
import Loading from "../components/loading/loading";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";


const CommentScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(state => state.Auth.current_user.access_token);
  const currentUser = useSelector(state => state.Auth.current_user);

  const handleComment = async () => {
    if (validateForm()) {
      try {
        await axios.post("/api/posts/comment", {
          postId: route.params._id,
          comment,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments([...comments, {
          comment: comment,
          username: currentUser.username,
          profileImg: currentUser.profileImg,
          _id: Math.random(),
        }]);
        Keyboard.dismiss();
        setComment("");
      } catch (e) {
        const error_response = errorResponse(e);
        showMessage({
          message: "Comment Error",
          description: error_response,
          backgroundColor: "#b50202",
          icon: { icon: "danger", position: "left" },
        });
      }
    }
  };

  const Comments = ({ item }) => (
    <View style={{
      flex: 1, flexDirection: "row", alignItems: "center", marginBottom: 5, paddingHorizontal: 20,
    }}>
      <Text style={{ fontWeight: "bold" }}>{item.username}{"  "}<Text
        style={{ fontSize: 14 }}>{item.comment}</Text></Text>
    </View>
  );

  const errorReset = () => {
    setCommentError("");
  };

  const validateForm = () => {
    errorReset();
    if (comment === "") {
      setCommentError("Required");
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    setComments(route.params.comments);
  }, []);

  if (loading) {
    return <Loading animating={loading} />;
  } else {
    return (
      <>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingHorizontal: 0,
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: 0,
          }}>
          <View style={{ flex: 1 }}>
            {(comments.length === 0) ?
              <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: "#777777" }}>No Comments</Text>
              </View> :
              <FlatList data={comments} renderItem={Comments} keyExtractor={posts => posts._id} />
            }
            <View style={{ flexDirection: "row", justifyContent: "center", backgroundColor: "#545454" }}>
              <TextInput
                placeholder="Add a comment"
                value={comment}
                style={{ backgroundColor: "#545454", paddingLeft: 30, flex: 0.9 }}
                onChangeText={text => setComment(text)}
                autoCapitalize="none"
              />
              <TouchableOpacity style={{ flex: 0.1, paddingTop: 10 }} disabled={comment === ""} onPress={handleComment}>
                <Icons size={26} name="send" color="#009ee0" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
};

export default CommentScreen;
