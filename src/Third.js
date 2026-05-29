import { useState } from "react";

function Third() {
  const [data, setData] = useState();
  const [student, setStudent] = useState({name: "", regno: "", age: 0})
  function handleChange(e) {
        setStudent({ ...student, [e.target.name]: e.target.value });
    }
    async function fetchData() {
      const d = await fetch("http://localhost:8000/save/user", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(student)
      });
      let djson = await d.json();
      setData(djson.data);
    }
  return (
    <div>
      <table>
        <tbody>
            <tr>
                <th>Name</th>
                <th><input type="text" name="name" value={student.name} onChange={handleChange}/></th>
            </tr>
            <tr>
                <th>Reg No</th>
                <th><input type="text" name="regno" value={student.regno} onChange={handleChange}/></th>
            </tr>
            <tr>
                <th>Age</th>
                <th><input type="text" name="age" value={student.age} onChange={handleChange}/></th>
            </tr>
            <tr>
                <td><button onClick={fetchData}>Save Data</button></td>
            </tr>
        </tbody>
      </table>
      {data ? 
      <>
        <h1>Name: {data.name}</h1>
        <h1>Regno: {data.regno}</h1>
        <h1>Age: {data.age}</h1>
      </>
      : "No data found"}
    </div>
  );
}

export default Third;