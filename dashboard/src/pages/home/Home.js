import { useState } from "react";
import MenuComp from "../../layout/menu/Menu";
import NavBar from "../../layout/navbar/Navbar";
import { Layout } from "antd";
import SideBar from "../../layout/sidebar/Sidebar";
import { SettingPage } from "../setting/Setting";
import { MaskingPage } from "../masking/Masking";

const HomePage = () => {
  const menus = [
    {
      label: "Setting",
      page: SettingPage,
    },
    {
      label: "Masking",
      page: MaskingPage,
    },
  ];

  const [contentIndex, setContentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState("0");
  const changeSelectedKey = (event) => {
    const key = event.key;
    setSelectedKey(key);
    setContentIndex(+key);
  };

  const Menu = (
    <MenuComp
      menus={menus}
      selectedKey={selectedKey}
      changeSelectedKey={changeSelectedKey}
    />
  );

  const Page = menus[contentIndex].page;

  return (
    <>
      <NavBar menu={Menu} />
      <Layout>
        <SideBar menu={Menu} />
        <Layout.Content className="content">
          <Page />
        </Layout.Content>
      </Layout>
    </>
  );
};

export default HomePage;
