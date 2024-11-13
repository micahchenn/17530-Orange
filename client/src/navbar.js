import { Link } from 'react-router-dom';
import './navbar.css';
import Button from '@mui/material/Button'

//change

const Navbar = ({logout}) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/main">Hardware!</Link>
      </div>
      <div>
        <Button variant="filled" className="formbutton" onClick={logout}>
            Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;