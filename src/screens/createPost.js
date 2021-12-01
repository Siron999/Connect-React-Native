import React, { createRef, useEffect, useState } from "react";
import { Image, Keyboard, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, Title, Text, HelperText, Avatar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/action";
import axios from "../utils/axios";
import Loading from "../components/loading/loading";
import { showMessage } from "react-native-flash-message";
import { errorResponse } from "../utils/errorHanding";
import { validateEmail, validateMinLength } from "../utils/validation";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import ActionSheet from "react-native-actions-sheet";
import ImagePicker from "react-native-image-crop-picker";
import ImageViewer from "react-native-image-zoom-viewer";

const CreatePostScreen = ({ navigation }) => {
  const [caption, setCaption] = useState("");
  const [captionError, setCaptionError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [imageVisible, setImageVisible] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector(state => state.Auth.current_user?.access_token);

  const actionSheetRef = createRef();

  const errorReset = () => {
    setCaptionError("");
  };

  const validateForm = () => {
    errorReset();
    if (caption === "") {
      setCaptionError("Caption required");
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (image !== "" && image !== undefined) {
        setLoading(true);
        try {
          await axios.post("/api/posts/create", {
            postImg: image,
            caption,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          reset();
          showMessage({
            message: "Post Created",
            description: "",
            backgroundColor: "#0eb502",
            icon: { icon: "success", position: "left" },
          });
        } catch (e) {
          const error_response = errorResponse(e);
          showMessage({
            message: "Post Error",
            description: error_response,
            backgroundColor: "#b50202",
            icon: { icon: "danger", position: "left" },
          });
        }
        setLoading(false);
      } else {
        showMessage({
          message: "Image Required",
          description: "Please upload an image",
          backgroundColor: "#b50202",
          icon: { icon: "danger", position: "left" },
        });
      }
    }
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
      .then(image => setImage(`data:${image.mime};base64,${image.data}`))
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
      .then(image => setImage(`data:${image.mime};base64,${image.data}`))
      .catch(err => console.log(err));
    actionSheetRef.current?.hide();
  };

  const reset = () => {
    setImage("");
    setCaption("");
    setCaptionError("");
  }

  useEffect(() => {
    navigation.addListener("focus", () => {
      setImage("");
      setCaption("");
      setCaptionError("");
    });
  }, []);

  if (loading) {
    return <Loading animating={loading} />;
  }
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 30 }}>
          <View style={{ flex: 0.9, justifyContent: "space-between", marginTop: "30%" }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "center" }}>
              <View style={{ flex: 1, marginLeft: 5 }}>
                {(image === "" || image === undefined) ?
                  <TouchableOpacity
                    onPress={() => {
                      actionSheetRef.current?.setModalVisible();
                    }}>
                    <View style={{
                      height: 100,
                      width: 100,
                      borderWidth: 1,
                      borderColor: "#009ee0",
                      borderRadius: 8,
                      marginRight: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Icons

                        name="upload"
                        color="#009ee0"
                        size={50}
                      />
                    </View>
                  </TouchableOpacity> :
                  <TouchableOpacity onPress={() => setImageVisible(true)}>
                    <Image
                      style={{
                        height: 100,
                        width: 100,
                        borderWidth: 1,
                        borderColor: "#009ee0",
                        borderRadius: 8,
                      }}
                      source={{ uri: image }}
                    />
                  </TouchableOpacity>
                }
              </View>
              <View style={{ flex: 2 }}>
                <TextInput
                  label="Caption"
                  mode="outlined"
                  value={caption}
                  style={{ backgroundColor: "#fff", height: 85 }}
                  onChangeText={text => setCaption(text)}
                  autoCapitalize="none"
                />
                <HelperText type="error" visible={captionError !== "" || captionError !== undefined}>
                  {captionError}
                </HelperText>
              </View>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Button mode="contained" onPress={handleSubmit} style={{ marginBottom: 20 }} disabled={loading}>
                Create
              </Button>
              <Button mode="contained" onPress={reset} color="#f1f1f1" disabled={loading}>
                Reset
              </Button>
            </View>
          </View>

        </SafeAreaView>
      </TouchableWithoutFeedback>
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
      <Modal visible={imageVisible} transparent={false}>
        <ImageViewer imageUrls={[{ url: image }]} enableSwipeDown onSwipeDown={_ => setImageVisible(false)}
                     renderHeader={() => <TouchableOpacity
                       onPress={() => setImageVisible(false)}
                       style={{ position: "absolute", top: 16, right: 0, zIndex: 999 }}>
                       <Icons name="close" color="#fff" size={24} style={{ padding: 16 }} />
                     </TouchableOpacity>}
        />
      </Modal>
    </>
  );
};

export default CreatePostScreen;
