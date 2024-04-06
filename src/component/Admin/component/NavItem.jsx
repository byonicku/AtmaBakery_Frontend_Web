import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

const NavItem = ({ to, icon: Icon, label, isActive }) => {
    return (
        <li className="nav-item">
            <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
                <Icon className="nav-icon" />
                <p>{label}</p>
            </Link>
        </li>
    );
};

NavItem.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
};

export default NavItem;
