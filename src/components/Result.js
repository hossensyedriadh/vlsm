import React from "react";
import "./App.css";
import Subnet from "./Subnet";

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: this.props.result,
            hosts: this.props.hosts,
            network_address: this.props.network_address,
            cidr: this.props.cidr,
            subnet_mask: this.props.subnet_mask
        };
        this.handleGoBackAction = this.handleGoBackAction.bind(this);
    }

    componentDidMount() {
    }

    handleGoBackAction = () => {
        window.location.replace("/");
    }

    render() {
        return (
            <div id='main_div'>
                <h3 className='ui dividing header'>VLSM Calculator</h3>
                <br/>
                <div className='ui raised segment' id='major_network'>
                    <p><strong>Network Address: </strong>{this.state.network_address}/{this.state.cidr}</p>
                    <p><strong>Subnet Mask: </strong>{this.state.subnet_mask}</p>
                </div>
                <div className='ui raised segment'>
                    <div className='ui accordion'>
                        {
                            this.state.result.map((subnet, i) => {
                                return (
                                    <Subnet key={i} info={subnet}
                                            hosts={this.state.hosts[i]}/>
                                );
                            })
                        }
                    </div>
                </div>
                <div id='buttons_div'>
                    <span className='ui button' onClick={this.handleGoBackAction}>
                        <i className='left arrow icon'/>
                        Go Back
                    </span>
                </div>
                <br/>
                <div id='copyright_div'>
                    <p><i className='code icon'/> <a href='https://github.com/hossensyedriadh' rel='noreferrer'
                                                     target='_blank'>Syed Riadh Hossen</a></p>
                </div>
            </div>
        );
    }
}

export default Result;
