import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";

import logo from "@/assets/images/atma-bakery.png";
import { useState } from "react";

import "./css/Header.css";
import { useMutation } from "@tanstack/react-query";
import APIAuth from "@/api/APIAuth";
import { toast } from "sonner";

export default function Header() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  const scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const mutation = useMutation({
    mutationFn: APIAuth.logout,
    onSuccess: () => {
      toast.success("Logout success");
      navigate("/");
      setIsLoading(false);
    },
    onError: (error) => {
      console.error(error);
      setIsLoading(false);
    },
  });

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      toast.warning("Logout in progress...");
      await mutation.mutateAsync();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Something went wrong with the server!"
      );
    }
  };

  return (
    <Navbar className="navbarHome" expand="lg" fixed="top">
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => {
            scrollToTop();
            navigate("/");
          }}
        >
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarNavDropdown"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="navbar-toggler-icon" />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarNavDropdown" className="justify-content-center">
          <Nav className="mx-auto">
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/");
              }}
            >
              Beranda
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/tentang");
              }}
            >
              Tentang Kami
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/produk");
              }}
            >
              Produk
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/pesan");
              }}
            >
              Pesan
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/kontak");
              }}
            >
              Kontak
            </Nav.Link>
            {role !== null && role !== "CUST" && (
              <Nav.Link
                onClick={() => {
                  scrollToTop();
                  navigate("/admin");
                }}
              >
                Dashboard
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ml-auto">
            {token === null ? (
              <Nav.Link className="button-style"
                onClick={() => {
                  scrollToTop();
                  navigate("/login");
                }}
              >
                <FaRegUser style={{ marginRight: '10px', color: '#F48E28'}} />
                Masuk ke Akun
              </Nav.Link>
            ) : (
              <Nav.Link className="button-style"
                onClick={() => {
                  scrollToTop();
                  handleLogout();
                }}
              >
                <IoIosLogOut style={{ marginRight: '10px', color: '#F48E28'}} />
                {isLoading ? "Loading..." : "Logout"}
              </Nav.Link>
            )}
            </Nav>
          </Navbar.Collapse>
    </Navbar>
  );
}
