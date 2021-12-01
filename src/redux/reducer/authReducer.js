import { CURRENT_USER, LOGIN, LOGOUT, REGISTER } from "../action/actionTypes";

const INITIAL_STATE = {
  current_user: {
    username: "",
    fullName: "",
    email: "",
    role: "",
    mobileNo: "",
    education: [],
    hobbies: [],
    posts: [],
    logs: [],
    address: "",
    profileImg: "",
    access_token: null,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, current_user: action.payload };
    case REGISTER:
      return { ...state, current_user: action.payload };
    case LOGOUT:
      return { ...INITIAL_STATE };
    case CURRENT_USER:
      return { ...state, current_user: { ...state.current_user, ...action.payload } };
    default:
      return state;
  }
}

