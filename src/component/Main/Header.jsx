import { Container, Image, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";

import { useEffect, useRef, useState } from "react";

import "./css/Header.css";
import iconSVG from "@/assets/Icon_Kue.svg";
import { useMutation } from "@tanstack/react-query";
import APIAuth from "@/api/APIAuth";
import { toast } from "sonner";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  const [activeIndex, setActiveIndex] = useState(0);

  const indicatorRef = useRef(null);
  const iconIndicator = useRef(null);

  const handleLinkClick = (index) => {
    setActiveIndex(index);
    setExpanded(false);
  };

  const navLinks = [
    { to: "/", text: "Beranda" },
    { to: "/tentang", text: "Tentang Kami" },
    { to: "/produk", text: "Produk" },
    { to: "/pesan", text: "Pesan" },
    { to: "/kontak", text: "Kontak" },
    ...(role !== null && role !== "CUST"
      ? [{ to: "/admin", text: "Dashboard" }]
      : []),
    ...(role !== null && role === "CUST"
      ? [{ to: "/profile", text: "Profile" }]
      : []),
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const links = document.querySelectorAll(".nav-link-custom");

    links.forEach((link) => {
      link.classList.remove("active");
      const linkPath = link.getAttribute("href");

      if (currentPath.startsWith(linkPath)) {
        link.classList.add("active");

        if (indicatorRef.current && iconIndicator.current) {
          indicatorRef.current.style.left = link.offsetLeft + "px";
          indicatorRef.current.style.width = link.offsetWidth + "px";
          indicatorRef.current.style.transform = "translateY(-2.5rem)";

          iconIndicator.current.style.left = link.offsetLeft + "px";
          iconIndicator.current.style.width = link.offsetWidth + "px";
          iconIndicator.current.style.transform = "translateY(-5.75rem)";
          setTimeout(() => {
            indicatorRef.current.classList.add("active");
            iconIndicator.current.classList.add("active");
          }, 200);
        }
      }
    });

    function updateWhenResize() {
      links.forEach((link) => {
        if (link.classList.contains("active")) {
          indicatorRef.current.style.left = link.offsetLeft + "px";
          indicatorRef.current.style.width = link.offsetWidth + "px";
          indicatorRef.current.style.transform = "translateY(-2.5rem)";

          iconIndicator.current.style.left = link.offsetLeft + "px";
          iconIndicator.current.style.width = link.offsetWidth + "px";
          iconIndicator.current.style.transform = "translateY(-5.75rem)";
          setTimeout(() => {
            indicatorRef.current.classList.add("active");
            iconIndicator.current.classList.add("active");
          }, 200);
        }
      });
    }

    const observer = new MutationObserver(updateWhenResize);
    observer.observe(document.querySelector(".nav-custom"), {
      childList: true,
      subtree: true,
    });

    setTimeout(updateWhenResize, 100);

    window.addEventListener("resize", updateWhenResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWhenResize);
    };
  }, [location]);

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
    <Navbar
      className="navbarHome font-header-main"
      expand="lg"
      fixed="top"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/");
          }}
        >
          <div className="logo">
            <img
              src="https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/kgpbuy3s9vgdkdaheeo0"
              alt="logo"
            />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarNavDropdown"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="navbar-toggler-icon" />
        </Navbar.Toggle>
        <Navbar.Collapse
          id="navbarNavDropdown"
          className="justify-content-center"
        >
          <Nav className="mx-auto nav-custom text-center">
            {navLinks.map((link, index) => (
              <Nav.Item key={index} className="py-1">
                <NavLink
                  to={link.to}
                  className={`nav-link-custom ${
                    index === activeIndex ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick(index)}
                >
                  {link.text}
                </NavLink>
              </Nav.Item>
            ))}
            <div className="icon-indicator" ref={iconIndicator}>
              {iconSVG && <Image src={iconSVG} alt="icon" />}
            </div>
            <div className="indicator" ref={indicatorRef}></div>
          </Nav>
          <Nav className="ml-auto text-center">
            {token === null ? (
              <Nav.Item className="py-2">
                <NavLink className="button-style nav-link-custom" to="/login">
                  <FaRegUser
                    style={{ marginRight: "10px", color: "#F48E28" }}
                  />
                  Masuk ke Akun
                </NavLink>
              </Nav.Item>
            ) : (
              <Nav.Item className="py-2">
                <Nav.Link
                  className="button-style nav-link-custom"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <IoIosLogOut
                    style={{ marginRight: "10px", color: "#F48E28" }}
                  />
                  {isLoading ? "Loading..." : "Logout"}
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
