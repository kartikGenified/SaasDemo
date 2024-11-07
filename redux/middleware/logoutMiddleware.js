import { logoutSuccess } from "../slices/authSlice";

const logoutMiddleware = store => next => action => {
  if (action) {
    // console.log(first)
    if (action.payload?.status === 401 && action.payload?.data?.message === "User Not Active") {
    //   Dispatch logoutUser action to logout the user
    console.log( "action aagaya hai payload", action.payload)

    //   alert("Kindly logout")
    store.dispatch(logoutSuccess())
    }
  }
    // console.log( "action aagaya hai", action)
  return next(action);
};

export default logoutMiddleware;
