import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import Loading from "@/components/loading";

const PersistLogin = () => {
  const [loading, setLoading] = useState(true);
  const token = useSelector(selectCurrenttoken);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyrefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    !token ? verifyrefreshToken() : setLoading(false);
  }, []);
 

  return loading ? null : <Outlet />;
};

export default PersistLogin;
