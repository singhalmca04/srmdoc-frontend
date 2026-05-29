function Card({ title, children }) {
  return (
    <div style={{
      border: "1px solid black",
      padding: "15px",
      margin: "10px",
      borderRadius: "8px"
    }}>
      <h2>{title}</h2>
      <div style={{color:'yellow'}}>{children}</div>
    </div>
  );
}

export default Card;