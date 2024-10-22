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