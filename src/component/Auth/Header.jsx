import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
          <img
            src="https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/kgpbuy3s9vgdkdaheeo0"
            alt="logo"
          />
        </div>
      </Navbar.Brand>
    </Navbar>
  );
}
