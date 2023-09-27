import React from "react";
import { Layout } from "antd";

const SideBar = ({ menu }) => {
  return (
    <Layout.Sider
      style={{
        height: "100vh",
        // marginRight: "16px",
      }}
      breakpoint={"lg"}
      theme="light"
      collapsedWidth={0}
      trigger={null}
      width={280}
    >
      {menu}
    </Layout.Sider>
  );
};
export default SideBar;
