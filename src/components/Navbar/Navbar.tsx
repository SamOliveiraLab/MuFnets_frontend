import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: FC = () => {
  return (
    <header>
      <div className="logo-container">
        <NavLink className="logo-link" to="/">
          <img className="m-logo" src="/MLogo.png" alt="logo" />
          uFNETS
        </NavLink>
      </div>
      <div className="links-container">
        <NavLink className="nav-link" to="/about">
          About
        </NavLink>
        <NavLink className="nav-link" to="/output">
          Output
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
