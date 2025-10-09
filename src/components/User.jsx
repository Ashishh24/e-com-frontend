import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/url";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const User = () => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);

  // adding user to store after page reload
  const fetchUser = async () => {
    if (userData) return;
    try {
      const user = await axios.get(BASE_URL + "/me", {
        withCredentials: true,
      });
      dispatch(addUser(user.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <div></div>;
};

export default User;
