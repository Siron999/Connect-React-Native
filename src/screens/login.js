import React, { useState } from "react";
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, Title, Text, HelperText, Avatar } from "react-native-paper";
import { useDispatch } from "react-redux";
import { login } from "../redux/action";
import axios from "../utils/axios";
import Loading from "../components/loading/loading";
import { showMessage } from "react-native-flash-message";
import { errorResponse } from "../utils/errorHanding";
import { validateEmail, validateMinLength } from "../utils/validation";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const errorReset = () => {
    setEmailError("");
    setPasswordError("");
  };

  const validateForm = () => {
    errorReset();
    if (!validateEmail(email) || !validateMinLength(password, 6) || email === "" || password === "") {
      if (email === "") {
        setEmailError("Required");
      } else if (email !== "" && !validateEmail(email)) {
        setEmailError("Invalid Email");
      }

      if (password === "") {
        setPasswordError("Required");
      } else if (password !== "" && !validateMinLength(password, 6)) {
        setPasswordError("Password should be at least 6 characters long");
      }

      return false;
    } else {
      return true;
    }
  };

  const goToRegister = () => {
    Keyboard.dismiss();
    navigation.navigate("Register");
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post("/api/users/login", {
          email,
          password,
        });
        dispatch(login(response.data));
      } catch (e) {
        const error_response = errorResponse(e);
        showMessage({
          message: "Login Error",
          description: error_response,
          backgroundColor: "#b50202",
          icon: { icon: "danger", position: "left" },
        });
        setLoading(false);
      }
    }
  };
  if (loading) {
    return <Loading animating={loading} />;
  }
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 30 }}>
          <View style={{flex:0.1,backgroundColor:"#fff",flexDirection:"row",alignItems:"center",marginTop:50}}>
            <View><Avatar.Image size={75} source={require('../assets/logo.png')} style={{backgroundColor:"transparent"}} /></View>
            <View style={{marginLeft:10}}>
              <Title style={{ fontSize: 30,paddingTop:10}}>Connect</Title>
            </View>
          </View>
          <View style={{ flex: 0.9, justifyContent: "center"}}>
            <View style={{ marginBottom: 10 }}>
              <Title style={{ fontSize: 30,paddingTop:5}}>Login</Title>
            </View>
            <View style={{ marginVertical: 10 }}>
              <TextInput
                label="Email"
                mode="outlined"
                value={email}
                style={{ backgroundColor: "#fff" }}
                onChangeText={text => setEmail(text)}
                autoCapitalize='none'
              />
              <HelperText type="error" visible={emailError !== "" || emailError !== undefined}>
                {emailError}
              </HelperText>
            </View>
            <View style={{ marginVertical: 10 }}>
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                style={{ backgroundColor: "#fff" }}
                value={password}
                onChangeText={text => setPassword(text)}
                autoCapitalize='none'
              />
              <HelperText type="error" visible={passwordError !== "" || passwordError !== undefined}>
                {passwordError}
              </HelperText>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Button mode="contained" onPress={handleLogin}>
                Login
              </Button>
            </View>

            <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "center" }}>
              <Text>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={goToRegister}>
                <Text style={{ color: "#009ee0", fontWeight: "bold" }}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default LoginScreen;
