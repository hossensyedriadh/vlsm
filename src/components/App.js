import React from "react";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {network_address: "", cidr: 0, subnet_mask: "", subnet_hosts: []};
    }

    componentDidMount() {
    }

    render() {
        return (
            <React.Fragment>
                <h3 className='ui header'>VLSM Calculator</h3>
            </React.Fragment>
        );
    }
}

export default App;
