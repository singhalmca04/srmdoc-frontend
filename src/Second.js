import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

function Second() {
  const [data1, setData1] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { age } = location.state || {};
  useEffect(() => {
    async function fetchData() {
      const d = await fetch('https://dummyjson.com/image/150',{
        method : "GET"
      });
      let djson = await d.blob();
      setData1(djson);
    }
    fetchData();
  }, []);
  return (
    <div>
      <button onClick={()=> navigate('/')}>Back</button>
      <h1>Age from Header is {age}</h1>
      Data1 is {data1.blob}
      {/* <table border="1">
        <tbody>
          {data1 && data1.length > 0 ? data1.map((d, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{d.name}</td>
              <td>{d.regno}</td>
              <td>{d.age}</td>
            </tr>
          )) : <h1>No data found</h1>}
        </tbody>
      </table> */}
    </div>
  );
}

export default Second;