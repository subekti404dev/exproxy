import React from "react";
import { Menu } from "antd";
import { useAuth } from "../../hooks/useAuth";

const MenuComp = ({ menus, selectedKey, changeSelectedKey }) => {
  const { logout } = useAuth();
  const styledMenus = [];
  menus.forEach((menu, index) =>
    styledMenus.push(
      <Menu.Item
        key={index}
        onClick={changeSelectedKey}
        style={{ fontSize: 18 }}
      >
        {menu.label}
      </Menu.Item>
    )
  );

  return (
    <Menu mode="inline" selectedKeys={[selectedKey]}>
      {styledMenus}
      <Menu.Item onClick={logout} style={{ fontSize: 18 }}>
        Logout
      </Menu.Item>
    </Menu>
  );
};
export default MenuComp;
