import { Navbar, Button } from "react-bootstrap";

import { FaSignOutAlt, FaBars } from "react-icons/fa";

import { useMutation } from "@tanstack/react-query";
import APIAuth from "@/api/APIAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Header() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: APIAuth.logout,
    onSuccess: () => {
      toast.success("Logout success");
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleLogout = async () => {
    await mutation.mutateAsync();
  };

  return (
    <Navbar
      expand="lg"
      bg="light"
      className="main-header"
      data-bs-theme="light"
    >
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <FaBars />
          </a>
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Navbar Search */}
        <li className="nav-item">
          <Button variant="danger" onClick={handleLogout}>
            <FaSignOutAlt />
            &nbsp;
            <span>Logout</span>
          </Button>
        </li>
      </ul>
    </Navbar>
  );
}
