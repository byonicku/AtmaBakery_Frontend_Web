import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
    <Navbar expand="lg" fixed="top">
      <Container>
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
        <Navbar.Collapse id="navbarNavDropdown" className="justify-content-end">
          <Nav>
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/");
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/product");
              }}
            >
              Product
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/about");
              }}
            >
              About
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                scrollToTop();
                navigate("/contact");
              }}
            >
              Contact
            </Nav.Link>
            {role !== null && role !== "CUST" && (
              <Nav.Link
                onClick={() => {
                  scrollToTop();
                  navigate("/admin");
                }}
              >
                Admin
              </Nav.Link>
            )}
            {token === null ? (
              <Nav.Link
                onClick={() => {
                  scrollToTop();
                  navigate("/login");
                }}
              >
                Login
              </Nav.Link>
            ) : (
              <Nav.Link
                onClick={() => {
                  scrollToTop();
                  handleLogout();
                }}
              >
                {isLoading ? "Loading..." : "Logout"}
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
