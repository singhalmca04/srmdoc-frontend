import style1 from './App1.module.css';
import style2 from './App2.module.css';
import './Sas.scss';
import Student from './Student';

function CssTest() {
    const students =  ["ABC", "XYZ", 'QWERTY', 'tytyty'];
    return (
        <>
        {
            students.map((student, index) =>(
                <Student key={index} name={student} />
            ))
        }
        <button>This is Button</button>
        <p className={style1.seca}>This is external CSS</p>
        <p style={{fontSize: '10px', color: 'blue', padding: '10px 20px', border: '2px solid red'}}>This is Inline CSS</p>
        </>
    )
}

export default CssTest;