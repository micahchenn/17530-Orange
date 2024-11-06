/*
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./main.css"

const Main = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('/main').then((res) => {
            //console.log("ressssss");
            console.log(res)
            setData(res.data.res);
        })
    }, [])

    return (
        <div className="Main">
            <table>
                <tr>
                    <th>projectName</th>
                    <th>projectId</th>
                    <th>description</th>

                </tr>
                {data.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{val.projectName}</td>
                            <td>{val.projectId}</td>
                            <td>{val.description}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    );
};
export default Main;

*/


import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./main.css"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const checkInHardware = async (projectId, qty) => {
  const response = await fetch(`http://localhost:5000/checkIn_hardware/${projectId}/${qty}`);
  const data = await response.json();
  return (data.qty + " hardware checked in");
};

const checkOutHardware = async (projectId, qty) => {
  const response = await fetch(`http://localhost:5000/checkOut_hardware/${projectId}/${qty}`);
  const data = await response.json();
  return (data.qty + " hardware checked out");
};

const joinProject = async (projectId) => {
  const response = await fetch(`http://localhost:5000/joinProject/${projectId}`);
  const data = await response.json();
  return ("Joined project " + data.pid);
};

const leaveProject = async (projectId) => {
  const response = await fetch(`http://localhost:5000/leaveProject/${projectId}`);
  const data = await response.json();
  return ("Left project " + data.pid);
};

const createProject = async (projectId) => {
  const response = await fetch(`http://localhost:5000/create_project/${projectId}`);
  const data = await response.json();
  return ("Created project " + data.pid);
};


function Main() {
  const [data, setData] = useState([]);

  useEffect(() => {
      axios.get('/main').then((res) => {
          //console.log("ressssss");
          console.log(res)
          setData(res.data.res);
      })
  }, []);

  return (
    <div className="App">
      <CreateProject pm={makePopup}/>
      <Projects data={data} pm={makePopup}/>
      <Dialog open={open} onClose={handleClose}>
        <p>{popupmessage}</p>
        <Button onClick={handleClose}>
          Close
        </Button>
      </Dialog>
    </div>
  );
}

const CreateProject = ({pm}) => {
  [pid, setPid] = useClass(0)

  const handleClick = async () => {
    ret = await createProject(pid);
    pm(ret);
  }
  
  return (
    <>
      <TextField label="id" variant="outlined" onChange={(e) => {try{setPid(parseInt(e.target.value));}catch(error){}}}/>
      <Button variant="outlined" onClick={handleClick}>Create Project</Button>
    </>
  )
}

const Projects = ({ data, pm }) => {
  return (
    <>
      <h2>Projects</h2>
      {data.map((project, index) => (
        <React.Fragment key={index}>
          <ProjectInfo pname={project.projectName} list={project.users} pm={pm}/>
        </React.Fragment>
      ))}
    </>
  );
};



const ProjectInfo = ({pname, list, pm}) =>{
  return(
      <>
        <div className="listParent">    
          <div className="list"><h3>{pname}</h3></div>
          <div className="list">
            <UserList list={list}/>  
          </div>
          <div className="list">
            <ItemManipulation name="HWSet1" available="0" capacity="100" pm={pm}/>  
          </div>
          <div className="list">
            <ItemManipulation name="HWSet2" available="50" capacity="100" pm={pm}/>  
          </div>
          <div className="list">
            <JoinOrLeave pid={pname} pm={pm}/>  
          </div>
        </div>
      </>
  );
}

const ItemManipulation = ({projname, hname, available, capacity, pm}) =>{
  const [qty, setQty] = useState(0);
  const [checked, setChecked] = useState(0);

  const handleCheckIn = async () => {
    const message = await checkInHardware(projname, qty);
    pm(message);
    setChecked(checked - qty);
  };
  
  const handleCheckOut = async () => {
    const message = await checkOutHardware(projname, qty);
    pm(message);
    setChecked(checked + qty);
  };

  return(
      <>
          <h6>{hname}: {checked}/{capacity}</h6>
          <TextField label="qty" variant="outlined" onChange={(e) => {try{setQty(parseInt(e.target.value));}catch(error){}}}/>
          <Button variant="outlined" onClick={handleCheckIn}>Check In</Button>
          <Button variant="outlined" onClick={handleCheckOut}>Check Out</Button>
      </>
  );
}

const JoinOrLeave = ({pm, pid}) =>{
  const [bool, setbool] = useState(false);
  const handleClick = async () => {
    let ret = "";
    if(bool) ret = await joinProject(pid);
    else ret = await leaveProject(pid);
    setbool(bool^true);
    pm(ret);
  }
  return(
      <>
          <Button variant="outlined" onClick={handleClick}>
            {bool ? "Join" : "Leave"}
          </Button>
      </>
  );
}

const UserList = ({list}) =>{
  return(
      <>
          <h4>{list.join(", ")}</h4>
      </>
  );
}

export default Main;