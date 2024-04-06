import {
  Navbar,
  Button
} from 'react-bootstrap'

import { FaSignOutAlt, FaBars } from 'react-icons/fa'
 
export default function Header() {
  return (
    <Navbar expand="lg" bg="light" className="main-header" data-bs-theme="light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <FaBars/>
          </a>
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Navbar Search */}
        <li className="nav-item">
            <Button variant="danger">
              <FaSignOutAlt/>
              &nbsp;
              <span>Logout</span>
            </Button>
        </li>
      </ul>
    </Navbar>
  );
}
