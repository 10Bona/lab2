import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [assignments, setAssignments] = useState([]); // store and update

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // fetch the data ever min
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/project_assignments" // fetching project assignment from the server
    );
    setAssignments(response.data);
  };

  return (
    <div>
      <h1>Project Assignments</h1>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Project Name</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => ( // this loops through assisgnment lists and display table row
            <tr key={assignment._id}>
              <td>{assignment.employee_id}</td>
              <td>{assignment.employee_name}</td>
              <td>{assignment.project_name}</td>
              <td>{new Date(assignment.start_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
