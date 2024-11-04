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
      <Projects data={data}/>
    </div>
  );
}

const Projects = ({ data }) => {
  return (
    <>
      <h2>Projects</h2>
      {data.map((project, index) => (
        <React.Fragment key={index}>
          <ProjectInfo pname={project.projectName} list={project.users} />
        </React.Fragment>
      ))}
    </>
  );
};



const ProjectInfo = ({pname, list}) =>{
  return(
      <>
        <div className="listParent">    
          <div className="list"><h3>{pname}</h3></div>
          <div className="list">
            <UserList list={list}/>  
          </div>
          <div className="list">
            <ItemManipulation name="HWSet1" available="0" capacity="100" />  
          </div>
          <div className="list">
            <ItemManipulation name="HWSet2" available="50" capacity="100"/>  
          </div>
          <div className="list">
            <JoinOrLeave />  
          </div>
        </div>
      </>
  );
}

const ItemManipulation = ({name, available, capacity}) =>{
    return(
        <>
            <h6>{name}: {available}/{capacity}</h6>
            <div className="formsec">
                <TextField label="qty" variant="outlined" />
            </div>      
            <div className="formsec">
                <Button variant="outlined">Check In</Button>
                <Button variant="outlined">Check Out</Button>
            </div>
        </>
    );
}

const JoinOrLeave = () =>{
  const [bool, setbool] = useState(false);
  const handleClick = () => {
    setbool(bool^true)
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