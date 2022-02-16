import ConversionModule from "./ConversionModule";
import * as Exceptions from "./Exceptions";
import {toast} from "react-toastify";

class AddressingModule {
    getNetworkAddress = (host, cidr) => {
        host = String(host);
        cidr = Number(cidr);

        let hostBinary = "";

        for (let i = 0; i < 4; i += 1) {
            hostBinary = hostBinary.concat(ConversionModule.toByte(
                ConversionModule.decToBin(Number(host.split(".")[i]))));
        }

        let bin = hostBinary.toString().split('');

        let binaryNetworkAddress = "";

        for (let i = 0; i < bin.length; i += 1) {
            if (i === 8 || i === 16 || i === 24) {
                binaryNetworkAddress = binaryNetworkAddress.concat(".");
            }

            if (i > cidr - 1) {
                binaryNetworkAddress = binaryNetworkAddress.concat("0");
            } else {
                binaryNetworkAddress = binaryNetworkAddress.concat(String(bin[i]));
            }
        }

        return this.getDottedDecimalAddress(binaryNetworkAddress);
    }

    getDottedDecimalAddress = (binaryAddress) => {
        binaryAddress = String(binaryAddress);

        let dottedDecimalAddress = "";

        let splitDottedBinaryNetworkAddress = binaryAddress.split(".");

        for (let i = 0; i < splitDottedBinaryNetworkAddress.length; i += 1) {
            dottedDecimalAddress = dottedDecimalAddress.concat(String(ConversionModule.binToDec(splitDottedBinaryNetworkAddress[i])));

            if (i < splitDottedBinaryNetworkAddress.length - 1) {
                dottedDecimalAddress = dottedDecimalAddress.concat(".");
            }
        }

        return dottedDecimalAddress;
    }

    getDefaultGateway = (networkAddress) => {
        networkAddress = String(networkAddress);

        let dottedDecimalNetworkAddress = networkAddress.split(".");

        dottedDecimalNetworkAddress[dottedDecimalNetworkAddress.length - 1] =
            String(Number(Number(dottedDecimalNetworkAddress[dottedDecimalNetworkAddress.length - 1]) + Number(1)));

        let dottedDecimalDefaultGateway = "";

        for (let i = 0; i < dottedDecimalNetworkAddress.length; i += 1) {
            dottedDecimalDefaultGateway = dottedDecimalDefaultGateway.concat(dottedDecimalNetworkAddress[i]);

            if (i < dottedDecimalNetworkAddress.length - 1) {
                dottedDecimalDefaultGateway = dottedDecimalDefaultGateway.concat(".");
            }
        }

        return dottedDecimalDefaultGateway.toString();
    }

    getBroadcastAddress = (host, cidr) => {
        host = String(host);
        cidr = Number(cidr);

        let broadcastDecimalBytes = host.split(".");

        let broadcastBinary = "";

        for (let i = 0; i < 4; i += 1) {
            broadcastBinary = broadcastBinary.concat(ConversionModule.toByte(ConversionModule.decToBin(Number(broadcastDecimalBytes[i]))));
        }

        let bin = broadcastBinary.toString().split('');

        let binaryBroadcastAddress = "";

        for (let i = 0; i < bin.length; i += 1) {
            if (i === 8 || i === 16 || i === 24) {
                binaryBroadcastAddress = binaryBroadcastAddress.concat(".");
            }

            if (i > cidr - 1) {
                binaryBroadcastAddress = binaryBroadcastAddress.concat("1");
            } else {
                binaryBroadcastAddress = binaryBroadcastAddress.concat(String(bin[i]));
            }
        }

        return this.getDottedDecimalAddress(binaryBroadcastAddress);
    }

    getWildcardAddress = (broadcastAddress) => {
        broadcastAddress = String(broadcastAddress);

        let dottedDecimalBroadcastAddress = broadcastAddress.split(".");

        dottedDecimalBroadcastAddress[dottedDecimalBroadcastAddress.length - 1] =
            String(Number(dottedDecimalBroadcastAddress[dottedDecimalBroadcastAddress.length - 1]) - 1);

        let dottedDecimalLastHost = "";

        for (let i = 0; i < dottedDecimalBroadcastAddress.length; i += 1) {
            dottedDecimalLastHost = dottedDecimalLastHost.concat(dottedDecimalBroadcastAddress[i]);

            if (i < dottedDecimalBroadcastAddress.length - 1) {
                dottedDecimalLastHost = dottedDecimalLastHost.concat(".");
            }
        }

        return dottedDecimalLastHost.toString();
    }

    getCidr = (subnetMask) => {
        subnetMask = String(subnetMask);
        let splitSubnetMask = subnetMask.split(".");

        let plainSubnetMask = "";

        for (let i = 0; i < splitSubnetMask.length; i += 1) {
            plainSubnetMask = plainSubnetMask.concat(ConversionModule.toByte(ConversionModule.decToBin(Number(splitSubnetMask[i]))));
        }

        let cidr1 = 0;

        for (let i = 0; i < plainSubnetMask.length; i += 1) {
            if (plainSubnetMask.charAt(i) === '1') {
                cidr1 += 1;
            }

            if (plainSubnetMask.charAt(i + 1) === '0') {
                break;
            }
        }

        let cidr2 = 0;

        for (let i = 0; i < plainSubnetMask.length; i += 1) {
            if (plainSubnetMask.charAt(i) === '1') {
                cidr2 += 1;
            }
        }

        if (cidr1 === cidr2) {
            return cidr1;
        } else {
            throw Exceptions.SUBNET_MASK_EXCEPTION;
        }
    }

    getSubnetMask = (cidr) => {
        cidr = Number(cidr);

        let mask = "";

        for (let i = 1; i <= 32; i += 1) {
            if (i === 9 || i === 17 || i === 25) {
                mask = mask.concat(".");
            }

            if (i < cidr + 1) {
                mask = mask.concat("1");
            } else {
                mask = mask.concat("0");
            }
        }

        let splitSubnetBytes = mask.toString().split(".");
        let subnetBytes = new Array(4);

        for (let i = 0; i < splitSubnetBytes.length; i += 1) {
            subnetBytes[i] = ConversionModule.binToDec(splitSubnetBytes[i]);
        }

        let decimal = "";

        for (let i = 0; i < subnetBytes.length; i += 1) {
            decimal = decimal.concat(String(subnetBytes[i]));

            if (i < subnetBytes.length - 1) {
                decimal = decimal.concat(".");
            }
        }

        return decimal.toString();
    }

    getTotalAddresses = (cidr) => {
        cidr = Number(cidr);

        if (cidr >= 0 && cidr <= 32) {
            return Number(Math.pow(2, 32 - cidr));
        }

        throw Exceptions.ILLEGAL_ARGUMENT_EXCEPTION;
    }

    getAvailableHostAddresses = (cidr) => {
        cidr = Number(cidr);

        if (cidr >= 0 && cidr <= 32) {
            return Number(Math.pow(2, 32 - cidr)) - 2;
        }
        throw Exceptions.ILLEGAL_ARGUMENT_EXCEPTION;
    }
}

export default new AddressingModule();
