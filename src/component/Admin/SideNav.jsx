import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import { BsGrid, BsGift, BsBox2Heart, BsJournalText,   } from 'react-icons/bs';
import { FaShoppingBasket, FaUserTie, FaUserFriends  } from "react-icons/fa";

import AdminLTELogo from  "/dist/img/AdminLTELogo.png";
import DefaultUser from "/dist/img/user2-160x160.jpg";

import "./css/SideNav.css";

export default function SideNav() {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/admin" className="brand-link">
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
            {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
            <li className="nav-item">
              <Link to="/admin" className="nav-link active">
                <BsGrid className="nav-icon" />
                <p>Beranda</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="./produk" className="nav-link">
                <BsGift className="nav-icon" />
                <p>Produk</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <BsBox2Heart className="nav-icon" />
                <p>Hampers</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <FaShoppingBasket className="nav-icon" />
                <p>Resep</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <BsJournalText className="nav-icon" />
                <p>Bahan Baku</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <FaUserTie className="nav-icon" />
                <p>Karyawan</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <FaUserFriends className="nav-icon" />
                <p>Penitip</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <BsJournalText className="nav-icon" />
                <p>Template</p>
              </Link>
            </li>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
}
