import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/url";
import { addUser, User as Usertype } from "../utils/userSlice";
import { RootState, AppDispatch } from "../utils/appStore";

const User = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((store: RootState) => store.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userData) return;
        const response = await axios.get<Usertype>(`${BASE_URL}/me`, {
          withCredentials: true,
        });
        dispatch(addUser(response.data));
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [dispatch, userData]);

  return null;
};

export default User;
