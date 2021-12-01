import { CURRENT_USER, LOGIN, LOGOUT, REGISTER } from "./actionTypes";

export const login = loginDetails => ({
  type: LOGIN,
  payload: loginDetails,
});

export const register = registerDetails => ({
  type: REGISTER,
  payload: registerDetails,
});

export const logout = () => ({
  type: LOGOUT,
});

export const currentUser = userDetails => ({
  type: CURRENT_USER,
  payload: userDetails,
});
