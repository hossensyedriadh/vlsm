import React from "react";
import AddressingModule from "../modules/AddressingModule";
import "./Subnet.css";

class Subnet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hosts: Number(this.props.hosts),
            address: String(this.props.info.address),
            cidr: Number(this.props.info.cidr),
            subnet_mask: String(this.props.info.subnetMask)
        };
    }

    componentDidMount() {
        this.setState({
            default_gateway: AddressingModule.getDefaultGateway(this.state.address),
            broadcast_address: AddressingModule.getBroadcastAddress(this.state.address, this.state.cidr),
            wildcard_address: AddressingModule.getLastHostAddress(AddressingModule.getBroadcastAddress(this.state.address, this.state.cidr)),
            addresses_available: AddressingModule.getAvailableHostAddresses(this.state.cidr)
        });
    }

    render() {
        return (
            <div className='ui raised segment' id='subnet_div'>
                <div className='active title'>
                        <span>
                            <strong>Hosts: </strong>{this.state.hosts} | <strong>Address: </strong>{this.state.address} | <strong>CIDR: </strong>{this.state.cidr} | <strong>Subnet
                            Mask: </strong>{this.state.subnet_mask}</span>
                    <i className='dropdown icon' id='dropdown_icon'/>
                </div>
                <div className='active content'>
                    <p><strong>Default Gateway: </strong>{this.state.default_gateway} | <strong>Broadcast
                        Address: </strong>{this.state.broadcast_address} | <strong>Last Host
                        Address: </strong> {this.state.wildcard_address}</p>
                    <p><strong>Available host addresses: </strong>{this.state.addresses_available}</p>
                </div>
            </div>
        );
    }
}

export default Subnet;
