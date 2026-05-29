import React from 'react';
import State from './State';

class Footer extends React.Component {
    constructor(){  
        console.log("constructor called");
        super();
        this.state = {
            age: 1,
            name: "ABC"
        }
    }
    componentDidMount() {
        console.log("Mount called");
    }
    componentDidUpdate() {
        console.log("Update called");
    }
    componentWillUnmount() {
        console.log("Unmount called");
    }
    add = () => {
        this.setState({age: this.state.age + 1});    
    }
    render() {
        return(
            <>
            <State />
                <div>This is Footer -- {this.props.semester}</div>
                <p>my age is {this.state.age}</p>
                <p> My name is {this.state.name}</p>
                <button onClick={this.add}>Change Age</button>
            </>
        );
    }
}

export default Footer;