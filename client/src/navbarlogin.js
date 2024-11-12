import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import Button from '@mui/material/Button'


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/main">Hardware!</Link>
      </div>
      <div>
        <Button variant="filled" className="formbutton" onClick={handleLogin}>
            Login
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;