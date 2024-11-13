import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./main.css";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Navbar from './navbar.js';
import { useNavigate } from 'react-router-dom';
import config from './config.js';


//hie
// API call functions
const checkInHardware = async (hwId, projectId, qty) => {
  try {
    const response = await axios.post(
      `${config.PROXY}/checkIn_hardware/${hwId}/${projectId}/${qty}`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data;
    if (data.message === "success") {
      window.location.reload();
    }
    return data.message;
  } catch (error) {
    console.error("Check In Error:", error);
    return null;
  }
};

const logout = async () => {
  try {
    const response = await axios.post(
      `${config.PROXY}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(response);
    if (response.status === 200) {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

const checkOutHardware = async (hwId, projectId, qty) => {
  try {
    const response = await axios.post(
      `${config.PROXY}/checkOut_hardware/${hwId}/${projectId}/${qty}`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data;
    if (data.message === "success") {
      window.location.reload();
    }
    return data.message;
  } catch (error) {
    console.error("Check Out Error:", error);
    return null;
  }
};

const joinProject = async (projectId) => {
  try {
    const response = await axios.post(
      `${config.PROXY}/joinProject/${projectId}`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data;
    console.log(data);
    if (data.message === "success") {
      window.location.reload();
    }
  } catch (error) {
    console.error("Join Project Error:", error);
  }
};

const leaveProject = async (projectId) => {
  try {
    const response = await axios.post(
      `${config.PROXY}/leaveProject/${projectId}`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data;
    if (data.message === "success") {
      window.location.reload();
    }
  } catch (error) {
    console.error("Leave Project Error:", error);
  }
};

const createProject = async (projectId) => {
  try {
    const response = await axios.post(
      `${config.PROXY}/create_project/${projectId}`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data;
    if (data.message === "success") {
      window.location.reload();
    }
  } catch (error) {
    console.error("Create Project Error:", error);
  }
};

// Main Component
function Main() {
  const [data, setData] = useState([]);
  const [hw1, setHW1] = useState(0);
  const [hw2, setHW2] = useState(0);

  const [popupMessage, setPopupMessage] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const makePopup = (message) => {
    setPopupMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchMainData = async () => {
      try {
        const res = await axios.get(`${config.PROXY}/main`, { withCredentials: true });
        console.log("Main data:", res.data);

        // Ensure 'projects' is an array
        setData(Array.isArray(res.data.projects) ? res.data.projects : []);
        setHW1(typeof res.data.hw1 === 'number' ? res.data.hw1 : 0);
        setHW2(typeof res.data.hw2 === 'number' ? res.data.hw2 : 0);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Unauthorized, redirect to login
          navigate('/login');
        } else {
          console.error("There was an error fetching main data!", error);
        }
        setData([]); // Default to empty array on error
      }
    };

    fetchMainData();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="App">
      <Navbar logout={handleLogout}></Navbar>
      <div className="createandcapParent">
        <CapacityDisplay hw1cap={100} hw2cap={100} hw1={hw1} hw2={hw2} />
        <CreateOrJoinProject pm={makePopup} />
      </div>
      <Projects data={data} pm={makePopup} />
      <Dialog open={open} onClose={handleClose}>
        <p>{popupMessage}</p>
        <Button variant="filled" className="formbutton" onClick={handleClose}>
          Close
        </Button>
      </Dialog>
    </div>
  );
}

// CapacityDisplay Component
const CapacityDisplay = ({ hw1cap, hw2cap, hw1, hw2 }) => {
  return (
    <div className="capParent">
      <h1>HW1: {hw1}/{hw1cap}</h1>
      <h1>HW2: {hw2}/{hw2cap}</h1>
    </div>
  );
};

// CreateOrJoinProject Component
const CreateOrJoinProject = ({ pm }) => {
  const [pid, setPid] = useState("");

  const handleCreate = async () => {
    if (pid.trim() === "") {
      pm("Project ID cannot be empty.");
      return;
    }
    await createProject(pid);
  };

  const handleJoin = async () => {
    if (pid.trim() === "") {
      pm("Project ID cannot be empty.");
      return;
    }
    await joinProject(pid);
  };

  return (
    <div className="createParent">
      <TextField
        label="Project ID"
        variant="standard"
        value={pid}
        onChange={(e) => setPid(e.target.value)}
      />
      <Button variant="filled" className="formbutton" onClick={handleJoin}>
        Join Project
      </Button>
      <Button variant="filled" className="formbutton" onClick={handleCreate}>
        Create Project
      </Button>
    </div>
  );
};

// Projects Component
const Projects = ({ data, pm }) => {
  // Ensure 'data' is an array
  if (!Array.isArray(data)) {
    console.error("Projects data is not an array:", data);
    return (
      <div className="projectPane">
        <h2>Projects</h2>
        <p>Error loading projects.</p>
      </div>
    );
  }

  return (
    <div className="projectPane">
      <h2>Projects</h2>
      {data.length > 0 ? (
        data.map((project, index) => (
          <React.Fragment key={index}>
            <ProjectInfo
              pname={project.projectName}
              list={project.users}
              pm={pm}
              data={project}
            />
          </React.Fragment>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

// ProjectInfo Component
const ProjectInfo = ({ pname, list, pm, data }) => {
  return (
    <div className="listParent">
      <div className="list"><h3>{pname}</h3></div>
      <div className="list">
        <UserList list={list} />
      </div>
      <div className="list">
        <ItemManipulation hname="HWSet1" capacity="100" projname={pname} pm={pm} data={data} />
      </div>
      <div className="list">
        <ItemManipulation hname="HWSet2" capacity="100" projname={pname} pm={pm} data={data} />
      </div>
      <div className="list">
        <Leave pid={pname} pm={pm} />
      </div>
    </div>
  );
};

// ItemManipulation Component
const ItemManipulation = ({ projname, hname, capacity, pm, data }) => {
  const [qty, setQty] = useState(0);
  const [checked, setChecked] = useState(0);

  const handleCheckIn = async () => {
    if (qty <= 0) {
      pm("Quantity must be greater than zero.");
      return;
    }
    const message = await checkInHardware(hname, projname, qty);
    if (message) pm(message);
    setChecked(prev => prev - qty);
    setQty(0); // Reset quantity input after operation
  };

  const handleCheckOut = async () => {
    if (qty <= 0) {
      pm("Quantity must be greater than zero.");
      return;
    }
    const message = await checkOutHardware(hname, projname, qty);
    if (message) pm(message);
    setChecked(prev => prev + qty);
    setQty(0); // Reset quantity input after operation
  };

  return (
    <div>
      <h6>{hname}: {data.hwSets[hname]} checked out</h6>
      <TextField
        label="Quantity"
        variant="standard"
        type="number"
        value={qty}
        onChange={(e) => setQty(parseInt(e.target.value) || 0)}
        inputProps={{ min: 0 }}
      />
      <div className="hwparent">
        <Button variant="filled" className="formbutton" onClick={handleCheckIn}>
          Check In
        </Button>
        <Button variant="filled" className="formbutton" onClick={handleCheckOut}>
          Check Out
        </Button>
      </div>
    </div>
  );
};

// Leave Component
const Leave = ({ pm, pid }) => {
  const handleClick = async () => {
    const confirmLeave = window.confirm(`Are you sure you want to leave project "${pid}"?`);
    if (confirmLeave) {
      await leaveProject(pid);
    }
  };

  return (
    <Button variant="filled" className="formbutton" onClick={handleClick}>
      Leave
    </Button>
  );
};

// UserList Component
const UserList = ({ list }) => {
  return (
    <h4>{list.join(", ")}</h4>
  );
};

export default Main;