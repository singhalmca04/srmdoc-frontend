import { useState, useEffect } from "react";
function State() {
    const [age, setAge] = useState(0);
    const [name, setName] = useState();
    useEffect(()=>{
        setAge(5);
    },[]);
    function changeAge() {
        setAge(age+1);
    }
    return(
        <>
        <p>My age is {age}</p>
        <p>My Name is {name}</p>
        <button onClick={changeAge}>Change</button> 
        </>
    );
}
export default State;