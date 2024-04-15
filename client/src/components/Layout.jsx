import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";

const Layout = () => {
  

  useEffect(() => {

  },[])
  return (
    <>
      <Header />
      {<Outlet />}
    </>
  );
};

export default Layout;
