import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./main.css"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom'


const domain = `https://localhost:5000`;

const checkInHardware = async (hwId, projectId, qty) => {
  const response = await fetch(`http://localhost:5000/checkIn_hardware/${hwId}/${projectId}/${qty}`, {
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
  const response = await fetch('http://localhost:5000/logout', {
    method: 'GET',
    credentials: 'include',
  });
  console.log(response)
  if (response.ok) {
    window.location.href = '/login';
  }
};


const checkOutHardware = async (hwId, projectId, qty) => {
  const response = await fetch(`http://localhost:5000/checkOut_hardware/${hwId}/${projectId}/${qty}`, {
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
  const response = await fetch(`http://localhost:5000/joinProject/${projectId}`, {
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
  const response = await fetch(`http://localhost:5000/leaveProject/${projectId}`, {
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

const createProject = async (projectId) => {
  const response = await fetch(`http://localhost:5000/create_project/${projectId}`, {
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
    axios.get('/main').then((res) => {
      //console.log("ressssss");
      console.log(res)
      setData(res.data.projects);
      setHW1(res.data.hw1);
      setHW2(res.data.hw2);
    })
  }, []);

  return (
    <div className="App">
      <CapacityDisplay hw1cap={100} hw2cap={100} hw1={hw1} hw2={hw2} />
      <CreateOrJoinProject pm={makePopup} />
      <Projects data={data} pm={makePopup} />
      <Dialog open={open} onClose={handleClose}>
        <p>{popupmessage}</p>
        <Button onClick={handleClose}>
          Close
        </Button>
      </Dialog>
    </div>
  );
}

const CapacityDisplay = ({ hw1cap, hw2cap, hw1, hw2 }) => {
  const handlelogout = async () => {
    await logout();
  };

  return (
    <div className="listParent">
      <h1>HW1: {hw1}/{hw1cap}</h1>
      <h1>HW2: {hw2}/{hw2cap}</h1>
      <Button variant="outlined" onClick={handlelogout}>
        Logout
      </Button>
    </div>
  )
}

const CreateOrJoinProject = ({ pm }) => {
  const [pid, setPid] = useState("");

  const handleCreate = async () => {
    await createProject(pid);
  };

  const handleJoin = async () => {
    await joinProject(pid);
  };

  return (
    <div className="listParent">
      <TextField
        label="id"
        variant="outlined"
        onChange={(e) => {
          try {
            setPid(e.target.value);
          } catch (error) {
            console.error("Invalid input:", error);
          }
        }}
      />
      <Button variant="outlined" onClick={handleJoin}>
        Join Project
      </Button>
      <Button variant="outlined" onClick={handleCreate}>
        Create Project
      </Button>
    </div>
  );
};

const Projects = ({ data, pm }) => {
  return (
    <>
      <h2>Projects</h2>
      {data.map((project, index) => (
        <React.Fragment key={index}>
          <ProjectInfo pname={project.projectName} list={project.users} pm={pm} data={project} />
        </React.Fragment>
      ))}
    </>
  );
};



const ProjectInfo = ({ pname, list, pm, data }) => {
  return (
    <>
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
      <h6>{hname}: {data.hwSets[hname]}</h6>
      <TextField label="qty" variant="outlined" onChange={(e) => { try { setQty(parseInt(e.target.value)); } catch (error) { } }} />
      <Button variant="outlined" onClick={handleCheckIn}>Check In</Button>
      <Button variant="outlined" onClick={handleCheckOut}>Check Out</Button>
    </>
  );
}

const Leave = ({ pm, pid }) => {
  const handleClick = async () => {
    await leaveProject(pid);
  }
  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
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