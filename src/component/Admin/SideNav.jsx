import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import RouteData from "@/assets/AdminConstant";
import AdminLTELogo from  "/dist/img/AdminLTELogo.png";
import DefaultUser from "/dist/img/user2-160x160.jpg";

import "./css/SideNav.css";
import { useEffect } from "react";
import NavItem from "./component/NavItem";

export default function SideNav() {
    const location = useLocation();
    
    useEffect(() => {
        const currentPath = location.pathname;
        const menuItems = document.querySelectorAll('.nav-link');

        menuItems.forEach(item => {
          item.classList.remove('active');
          const itemPath = item.getAttribute('href');
          if (currentPath.startsWith(itemPath) && itemPath !== '/admin') {
            item.classList.add('active');
          }

          if (currentPath === '/admin' && itemPath === '/admin') {
            item.classList.add('active');
          }
        });

      }, [location]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/" className="brand-link">
        <Image
          src={AdminLTELogo}
          alt="Atma Bakery"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">Atma Bakery</span>
      </Link>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-1 pb-2 mb-3 d-flex">
          <div className="image pt-2">
            <Image
              src={DefaultUser}
              className="img-circle elevation-2"
              alt="User Image"
              style={{
                width: "3rem",
              }}
            />
          </div>
          <div className="info mt-1">
            <Link to="./profile" className="d-block">
              <span className="text-bold">Alexander Pierce</span>
              <p className="p-0 m-0">Admin Atma Bakery</p>
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
            {RouteData['MO'].map((item, index) => (
              <NavItem key={index} to={item.to} icon={item.icon} label={item.label} isActive={false} />
            ))}
            {
                /* 
                    Nanti bakal ada beberapa route disini tambahin aja ke AdminConstant
                */
            }
            </ul>
        </nav>
      </div>
      {/* /.sidebar */}
    </aside>
  );
}