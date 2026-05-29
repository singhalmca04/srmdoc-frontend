import { useState } from "react";
import Child from "./Child";

// function Parent() {
//   const [message, setMessage] = useState("");

//   function receiveData(data) {
//     setMessage(data);
//   }

//   return (
//     <div>
//       <h2>Message from Child: {message}</h2>
//       <Child sendData={receiveData} />
//     </div>
//   );
// }

// function Parent() {
//   return <Child message="Hello from Parent" />;
// }

function Parent() {
  const [text, setText] = useState("");

  return (
    <div>
      <Child methd={setText} />
      <h2>{text}</h2>
    </div>
  );
}

export default Parent;
