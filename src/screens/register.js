import React, { useState } from "react";
import { Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, Title, Text, HelperText, Avatar } from "react-native-paper";
import axios from "../utils/axios";
import { login, register } from "../redux/action";
import Loading from "../components/loading/loading";
import { useDispatch } from "react-redux";
import { validateEmail, validateFullName, validateMinLength } from "../utils/validation";
import { errorResponse } from "../utils/errorHanding";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const RegisterScreen = ({ navigation }) => {
  const [registerData, setRegisterData] = useState({
    email: "",
    mobileNo: "",
    username: "",
    fullName: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [mobileNoError, setMobileNoError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const errorReset = () => {
    setEmailError("");
    setPasswordError("");
    setUsernameError("");
    setFullNameError("");
    setMobileNoError("");
  };

  const isEmpty = () => {
    return (registerData.email === "" || registerData.password === "" || registerData.fullName === "" || registerData.username === "" || registerData.mobileNo === "");
  };

  const isValid = () => {
    return (!validateEmail(registerData.email) || !validateMinLength(registerData.password, 6) || !validateFullName(registerData.fullName));
  };

  const validateForm = () => {
    errorReset();
    if (isValid() || isEmpty()) {
      if (registerData.email === "") {
        setEmailError("Required");
      } else if (registerData.email !== "" && !validateEmail(registerData.email)) {
        setEmailError("Invalid Email");
      }

      if (registerData.username === "") {
        setUsernameError("Required");
      }

      if (registerData.fullName === "") {
        setFullNameError("Required");
      } else if (registerData.fullName !== "" && !validateFullName(registerData.fullName)) {
        setFullNameError("Invalid Full Name");
      }

      if (registerData.mobileNo === "") {
        setMobileNoError("Required");
      } else if (registerData.mobileNo !== "" && !validateEmail(registerData.mobileNo)) {
        setMobileNoError("Invalid Mobile No.");
      }

      if (registerData.password === "") {
        setPasswordError("Required");
      } else if (registerData.password !== "" && !validateMinLength(registerData.password, 6)) {
        setPasswordError("Password should be at least 6 characters long");
      }

      return false;
    } else {
      return true;
    }
  };

  const goToLogin = () => {
    Keyboard.dismiss();
    navigation.navigate("Login");
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post("/api/users/register", {
          ...registerData,
        });
        dispatch(register(response.data));
      } catch (e) {
        const error_response = errorResponse(e);
        showMessage({
          message: "Register Error",
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
          style={{ flex: 1, backgroundColor: "#fff", padding: 30,justifyContent:"center" }}>
            <View style={{ justifyContent: "center",backgroundColor:"#fff" }}>
              <View style={{ marginBottom: 10 }}>
                <Title style={{ fontSize: 30, paddingTop: 5 }}>Register</Title>
              </View>
              <ScrollView
                contentContainerStyle={{
                  backgroundColor: '#fff',
                }}
              >
              <View style={{ marginVertical: 10 }}>
                <TextInput
                  label="Full Name"
                  mode="outlined"
                  value={registerData.fullName}
                  style={{ backgroundColor: "#fff" }}
                  onChangeText={text => setRegisterData({ ...registerData, fullName: text })}
                />
                <HelperText type="error" visible={fullNameError !== "" || fullNameError !== undefined}>
                  {fullNameError}
                </HelperText>
              </View>
              <View style={{ marginVertical: 10 }}>
                <TextInput
                  label="Username"
                  mode="outlined"
                  value={registerData.username}
                  style={{ backgroundColor: "#fff" }}
                  onChangeText={text => setRegisterData({ ...registerData, username: text })}
                  autoCapitalize="none"
                />
                <HelperText type="error" visible={usernameError !== "" || usernameError !== undefined}>
                  {usernameError}
                </HelperText>
              </View>
              <View style={{ marginVertical: 10 }}>
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={registerData.email}
                  style={{ backgroundColor: "#fff" }}
                  onChangeText={text => setRegisterData({ ...registerData, email: text })}
                  autoCapitalize="none"
                />
                <HelperText type="error" visible={emailError !== "" || emailError !== undefined}>
                  {emailError}
                </HelperText>
              </View>
              <View style={{ marginVertical: 10 }}>
                <TextInput
                  label="Mobile No."
                  mode="outlined"
                  value={registerData.mobileNo}
                  style={{ backgroundColor: "#fff" }}
                  onChangeText={text => setRegisterData({ ...registerData, mobileNo: text })}
                  autoCapitalize="none"
                />
                <HelperText type="error" visible={mobileNoError !== "" || mobileNoError !== undefined}>
                  {mobileNoError}
                </HelperText>
              </View>
              <View style={{ marginVertical: 10 }}>
                <TextInput
                  label="Password"
                  mode="outlined"
                  secureTextEntry
                  style={{ backgroundColor: "#fff" }}
                  value={registerData.password}
                  onChangeText={text => setRegisterData({ ...registerData, password: text })}
                  autoCapitalize="none"
                />
                <HelperText type="error" visible={passwordError !== "" || passwordError !== undefined}>
                  {passwordError}
                </HelperText>
              </View>
              <View style={{ marginVertical: 10 }}>
                <Button mode="contained" onPress={handleRegister}>
                  Register
                </Button>
              </View>

              <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "center" }}>
                <Text>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={goToLogin}>
                  <Text style={{ color: "#009ee0", fontWeight: "bold" }}>Login</Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
            </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default RegisterScreen;
