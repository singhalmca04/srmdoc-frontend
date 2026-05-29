// function Child(props) {
//   function handleClick() {
//     props.sendData("Hello dear Parent!");
//   }

//   return (
//     <button onClick={handleClick}>
//       Send Data to Parent
//     </button>
//   );
// }

// function Child(props) {
//   return <h6><u>{props.message}</u></h6>;
// }

function Child({methd}) {
  return (
    <input
      type="text"
      onChange={(e) => methd(e.target.value)}
    />
  );
}

export default Child;
