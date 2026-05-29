import { useState, useEffect } from "react";
function State() {
    const [age, setAge] = useState(0);
    useEffect(()=>{
        setAge(5);
    },[]);
    function changeAge() {
        setAge(age+1);
    }
    return(
        <>
        <p>My age is {age}</p>
        <button onClick={changeAge}>Change</button> 
        </>
    );
}
export default State;