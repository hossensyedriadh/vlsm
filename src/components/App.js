import React from "react";
import "./App.css";
import SubnetClass from "../modules/Subnet";
import SubnetModule from "../modules/SubnetModule";
import AddressingModule from "../modules/AddressingModule";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Result from "./Result";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            network_address: "",
            cidr: "",
            subnet_mask: "",
            subnet_hosts: [],
            calculated: false,
            calculated_subnets: [],
            sumOfHosts: 0
        };
        this.handleVlsmFormSubmit = this.handleVlsmFormSubmit.bind(this);
        this.handleNetworkAddressChange = this.handleNetworkAddressChange.bind(this);
        this.handleNetworkAddressValidation = this.handleNetworkAddressValidation.bind(this);
        this.handleCidrSubnetMaskValidation = this.handleCidrSubnetMaskValidation.bind(this);
        this.handleValidateHosts = this.handleValidateHosts.bind(this);
    }

    componentDidMount() {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    handleNetworkAddressChange = (e) => {
        this.setState({network_address: String(e.target.value)});
    }

    handleNetworkAddressValidation = (e) => {
        const ip_regex = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.|$)){4}\b/;

        let field = document.getElementById('network_address_field');

        if (ip_regex.test(String(e.target.value))) {
            field.className = 'field';
        } else {
            field.className = 'field error';
        }
    }

    handleCidrSubnetMaskValidation = (e) => {
        let field = document.getElementById('cidr_or_mask_field');

        const mask_regex = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.|$)){4}\b/;
        const cidr_regex = /^[0-9]{1,2}$/;

        if (mask_regex.test(String(e.target.value))) {
            this.setState({subnet_mask: String(e.target.value)});
            this.setState({cidr: AddressingModule.getCidr(String(e.target.value))});
            field.className = 'field';
        } else if (cidr_regex.test(String(e.target.value))) {
            this.setState({cidr: Number(e.target.value)});
            this.setState({subnet_mask: AddressingModule.getSubnetMask(Number(e.target.value))});
            if (Number(e.target.value) >= 0 && Number(e.target.value) <= 32) {
                field.className = 'field';
            } else {
                field.className = 'field error';
            }
        } else {
            field.className = 'field error';
        }
    }

    handleValidateHosts = (e) => {
        const regex = /^[0-9,\s]+$/;

        let field = document.getElementById('subnet_hosts_field');

        if (regex.test(String(e.target.value))) {
            field.className = 'required field';
        } else {
            field.className = 'required field error';
        }

        let nums;

        if (regex.test(String(e.target.value))) {
            if (String(e.target.value).includes(" ")) {
                nums = String(e.target.value).split(", ");
            } else {
                nums = String(e.target.value).split(",");
            }
            this.setState({subnet_hosts: nums});

            let sum = 0;
            for (let i = 0; i < nums.length; i += 1) {
                sum += Number(Number(nums[i]) + Number(2))
            }

            this.setState({sumOfHosts: sum});
        }
    }

    handleVlsmFormSubmit = (e) => {
        e.preventDefault();

        const ip_regex = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.|$)){4}\b/;

        if (ip_regex.test(this.state.network_address)) {
            if (!AddressingModule.isSubnetMaskContiguous(this.state.subnet_mask)) {
                toast.error("Subnet mask not contiguous");
            } else {
                if (this.state.sumOfHosts > AddressingModule.getTotalAddresses(this.state.cidr)) {
                    toast.error("Network too small to perform VLSM for given subnetworks");
                } else {
                    let hosts = this.state.subnet_hosts;
                    hosts.sort((a, b) => {
                        return b - a;
                    });

                    let network = new SubnetClass(this.state.network_address, this.state.cidr);
                    let result = SubnetModule.doSubnet(hosts, network);

                    if (result.length > 0) {
                        this.setState({calculated: true, calculated_subnets: result});
                    }

                    toast.success("Calculation successful");
                    console.clear();
                }
            }
        } else {
            toast.error("Invalid Network address");
        }
    }

    clearResults = () => {
        this.setState({
            network_address: "",
            cidr: "",
            subnet_mask: "",
            subnet_hosts: [],
            calculated: false,
            calculated_subnets: [],
            sumOfHosts: 0
        });
    }

    render() {
        if (this.state.calculated && this.state.calculated_subnets.length > 0) {
            return <Result result={this.state.calculated_subnets} hosts={this.state.subnet_hosts}
                           network_address={this.state.network_address} cidr={this.state.cidr}
                           subnet_mask={this.state.subnet_mask}/>
        }

        return (
            <div id='main_div'>
                <h3 className='ui dividing header'>VLSM Calculator</h3>
                <br/>
                <div className='ui raised segment'>
                    <form className='ui form' autoComplete={'off'} onSubmit={this.handleVlsmFormSubmit}>
                        <div className='field'>
                            <div className='two required fields'>
                                <div className='field' id='network_address_field'>
                                    <label htmlFor='network_address'>Network address</label>
                                    <input type='text' id='network_address' className='ui input' required={true}
                                           style={{fontStyle: "italic"}} value={this.state.network_address}
                                           onKeyUp={this.handleNetworkAddressValidation}
                                           onChange={this.handleNetworkAddressChange}
                                           placeholder='i.e.: 192.168.1.0'/>
                                </div>
                                <div className='field' id='cidr_or_mask_field'>
                                    <label htmlFor='cidr_or_mask'>CIDR or Subnet Mask</label>
                                    <input type='text' id='cidr_or_mask' className='ui input' required={true}
                                           style={{fontStyle: "italic"}}
                                           onKeyUp={this.handleCidrSubnetMaskValidation}
                                           placeholder='i.e.: 24 or 255.255.255.0'/>
                                </div>
                            </div>
                            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                            <h3 className='ui dividing header'/>
                            <div className='field'>
                                <div className='required field' id='subnet_hosts_field'>
                                    <label htmlFor='subnet_hosts'>Hosts in each subnet (comma delimited)</label>
                                    <input type='text' id='subnet_hosts' className='ui input'
                                           required={true} onKeyUp={this.handleValidateHosts}
                                           placeholder='i.e.: 15, 29, 8, 16'/>
                                </div>
                            </div>
                            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                            <h3 className='ui dividing header'/>
                            <div className='field' id='buttons_div'>
                                <button type='submit' id='calculate_button' className='ui green button'>
                                    <i className='calculator icon'/>
                                    Calculate
                                </button>
                                <button type='reset' onClick={this.clearResults} className='ui button'>
                                    <i className='times icon'/>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </form>
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

export default App;
