import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logo from "@/assets/images/atma-bakery.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <Navbar
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <Navbar.Brand
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/");
        }}
      >
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
      </Navbar.Brand>
    </Navbar>
  );
}
