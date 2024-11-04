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
  return (
    <div className="App">
      <Projects />
    </div>
  );
}

const Projects = () =>{
  return(
      <>
          <h2>Projects</h2>
          <ProjectInfo pname="Project Name 1" list="Andy, Bart, Colin"/>
          <ProjectInfo pname="Project Name 2" list="Darryl, Edward"/>
          <ProjectInfo pname="Project Name 3" list="Fred, Gary, Harry, Ignacio"/>
      </>
  );
}


const ProjectInfo = ({pname, list}) =>{
  return(
      <>
        <div className="listParent">    
          <div className="list"><h3>{pname}</h3></div>
          <div className="list">
            <UserList list={list}/>  
          </div>
          <div className="list">
            <ItemManipulation projname="HWSet1" available="0" capacity="100" />  
          </div>
          <div className="list">
            <ItemManipulation projname="HWSet2" available="50" capacity="100"/>  
          </div>
          <div className="list">
            <JoinOrLeave />  
          </div>
        </div>
      </>
  );
}

const ItemManipulation = ({projname, available, capacity}) =>{
    return(
        <>
            <h6>{projname}: {available}/{capacity}</h6>
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
          <h4>{list}</h4>
      </>
  );
}

export default Main;