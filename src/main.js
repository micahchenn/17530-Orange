import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./main.css"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog';
import Navbar from './navbar.js';
import { useNavigate } from 'react-router-dom'


const domain = `https://app-orange-hardware-b474fc6fdc47.herokuapp.com`;
//const domain = `http://localhost:5000`;


const checkInHardware = async (hwId, projectId, qty) => {
  const response = await fetch(`${domain}/checkIn_hardware/${hwId}/${projectId}/${qty}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (data.message == "success") {
    window.location.reload();
  }
  return data.message;
};

const logout = async () => {
  const response = await fetch(`${domain}/logout`, {
    method: 'GET',
    credentials: 'include',
  });
  console.log(response)
  if (response.ok) {
    window.location.href = '/';
  }
};


const checkOutHardware = async (hwId, projectId, qty) => {
  const response = await fetch(`${domain}/checkOut_hardware/${hwId}/${projectId}/${qty}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (data.message == "success") {
    window.location.reload();
  }
  return data.message;

};

const joinProject = async (projectId) => {
  const response = await fetch(`${domain}/joinProject/${projectId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);
  if (data.message == "success") {
    window.location.reload();
  }
};

const leaveProject = async (projectId) => {
  const response = await fetch(`${domain}/leaveProject/${projectId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (data.message == "success") {
    window.location.reload();
  }

};

const createProject = async (projectId, desc) => {
  const response = await fetch(`${domain}/create_project/${projectId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: desc
    }),
  });
  const data = await response.json();
  if (data.message == "success") {
    window.location.reload();
  }
};



function Main() {
  const [data, setData] = useState([]);
  const [hw1, setHW1] = useState(0);
  const [hw2, setHW2] = useState(0);

  const [popupmessage, setPopupMessage] = useState("");
  const [open, setOpen] = useState(false);

  const makePopup = (message) => {
    setPopupMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${domain}/getInfo`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      return data;
    }

    fetchData().then((data) => {
      console.log(data);
      setData(data.projects);
      setHW1(data.hw1);
      setHW2(data.hw2);
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, []);


  const handlelogout = async () => {
    await logout();
  };

  return (
    <div className="App">
      <Navbar logout={handlelogout}></Navbar>
      <div className="createandcapParent">
        <CapacityDisplay hw1cap={100} hw2cap={100} hw1={hw1} hw2={hw2} />
        <CreateOrJoinProject pm={makePopup} />
      </div>
      <Projects data={data} pm={makePopup} />
      <Dialog open={open} onClose={handleClose}>
        <p>{popupmessage}</p>
        <Button variant="filled" className="formbutton" onClick={handleClose}>
          Close
        </Button>
      </Dialog>
    </div>
  );
}

const CapacityDisplay = ({ hw1cap, hw2cap, hw1, hw2 }) => {
  return (
    <div className="capParent">
      <h1>HW1: {hw1}/{hw1cap}</h1>
      <h1>HW2: {hw2}/{hw2cap}</h1>
    </div>
  )
}

const CreateOrJoinProject = ({ pm }) => {
  const [pid, setPid] = useState("");
  const [desc, setDesc] = useState("");


  const handleCreate = async () => {
    await createProject(pid, desc);
  };

  const handleJoin = async () => {
    await joinProject(pid);
  };

  return (
    <div className="createParent">
      <TextField
        label="id"
        variant="standard"
        onChange={(e) => {
          try {
            setPid(e.target.value);
          } catch (error) {
            console.error("Invalid input:", error);
          }
        }}
      />
      <TextField
        label="description"
        variant="standard"
        onChange={(e) => {
          try {
            setDesc(e.target.value);
          } catch (error) {
            console.error("Invalid input:", error);
          }
        }}
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

const Projects = ({ data, pm }) => {
  return (
    <div className="projectPane">
      <h2>Projects</h2>
      {data.map((project, index) => (
        <React.Fragment key={index}>
          <ProjectInfo pname={project.projectName} list={project.users} pm={pm} data={project} />
        </React.Fragment>
      ))}
    </div>
  );
};



const ProjectInfo = ({ pname, list, pm, data }) => {
  return (
    <>
      <div className="listParent">
        <div className="list">
          <h3>{pname}</h3>
          <h6>{data.description}</h6>
        </div>
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
    </>
  );
}

const ItemManipulation = ({ projname, hname, capacity, pm, data }) => {
  const [qty, setQty] = useState(0);
  const [checked, setChecked] = useState(0);

  const handleCheckIn = async () => {
    const message = await checkInHardware(hname, projname, qty);
    pm(message);
    setChecked(checked - qty);
  };

  const handleCheckOut = async () => {
    const message = await checkOutHardware(hname, projname, qty);
    pm(message);
    setChecked(checked + qty);
  };

  return (
    <>
      <h6>{hname}: {data.hwSets[hname]} checked out</h6>
      <TextField label="qty" variant="standard" onChange={(e) => { try { setQty(parseInt(e.target.value)); } catch (error) { } }} />
      <div className="hwparent">
        <Button variant="filled" className="formbutton" onClick={handleCheckIn}>Check In</Button>
        <Button variant="filled" className="formbutton" onClick={handleCheckOut}>Check Out</Button>
      </div>
    </>
  );
}

const Leave = ({ pm, pid }) => {
  const handleClick = async () => {
    await leaveProject(pid);
  }
  return (
    <>
      <Button variant="filled" className="formbutton" onClick={handleClick}>
        Leave
      </Button>
    </>
  );
}

const UserList = ({ list }) => {
  return (
    <>
      <h4>{list.join(", ")}</h4>
    </>
  );
}

export default Main;