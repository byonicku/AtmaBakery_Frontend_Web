import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import RouteData from "@/assets/AdminConstant";

import "./css/AdminComponent.css";
import { useEffect, useState } from "react";
import NavItem from "./component/NavItem";

import { useRefresh } from "@/component/RefreshProvider";
import { useLayoutEffect } from "react";

const role = {
  ADM: "Admin",
  MO: "MO",
  OWN: "Owner",
  EMP: "",
};

export default function SideNav() {
  const location = useLocation();
  const roleId = sessionStorage.getItem("role") || "EMP";
  const roleName = role[roleId];
  const [nama, setNama] = useState(sessionStorage.getItem("nama") || "User");
  const [image, setImage] = useState(getImageSrc());
  const { refresh } = useRefresh();

  useLayoutEffect(() => {
    const currentPath = location.pathname;
    const menuItems = document.querySelectorAll(".nav-link");

    menuItems.forEach((item) => {
      item.classList.remove("active");
      const itemPath = item.getAttribute("href");
      if (currentPath.startsWith(itemPath) && itemPath !== "/admin") {
        item.classList.add("active");
      }

      if (currentPath === "/admin" && itemPath === "/admin") {
        item.classList.add("active");
      }
    });
  }, [location]);

  function getImageSrc() {
    const foto_profil = sessionStorage.getItem("foto_profil");
    return foto_profil === "null" || foto_profil === null
      ? "https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/r1xujbu1yfoenzked4rc"
      : foto_profil;
  }

  useEffect(() => {
    setImage(getImageSrc());
    setNama(sessionStorage.getItem("nama") || "User");
  }, [refresh]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 font-sidebar">
      {/* Brand Logo */}
      <Link to="/" className="brand-link text-center">
        <span className="brand-text">Atma Bakery</span>
      </Link>
      {/* Sidebar */}
      <div className="sidebar ">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-1 pb-2 mb-3 d-flex">
          <div className="image pt-2">
            <Image
              src={image}
              className="img-circle elevation-2"
              alt="User Image"
              style={{
                width: "3rem",
                height: "3rem",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="info profile-sidebar mt-1">
            <Link
              to={roleId === "CUST" ? "/profile" : "./profile"}
              className="d-block"
            >
              <span
                style={{
                  fontWeight: "600",
                }}
              >
                {nama == "null" || nama == null ? "User" : nama}
              </span>
              <p className="p-0 m-0">
                {roleId === "CUST"
                  ? "Beloved Customer"
                  : `${roleName} Atma Bakery`}
              </p>
            </Link>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {RouteData[roleId]?.map((item, index) => (
              <NavItem
                key={index}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={false}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
