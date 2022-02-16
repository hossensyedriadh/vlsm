import AddressingModule from "./AddressingModule";
import ConversionModule from "./ConversionModule";
import Subnet from "./Subnet";
import * as Exceptions from "./Exceptions";

class SubnetModule {
    doSubnet = (hosts, majorNetwork) => {
        hosts.sort((a, b) => {
            return b - a;
        });

        let subnets = new Array(hosts.length);
        let mtHosts = new Array(hosts.length);

        let sumOfHosts = 0;

        for (let i = 0; i < hosts.length; i += 1) {
            mtHosts[i] = hosts[i] + 2;
            sumOfHosts += mtHosts[i];
        }

        if (sumOfHosts <= AddressingModule.getTotalAddresses(majorNetwork.cidr)) {
            let cidr = new Array(hosts.length);

            //calculating CIDR values
            for (let i = 0; i < cidr.length; i += 1) {
                for (let j = 32; j >= majorNetwork.cidr; j -= 1) {
                    if (mtHosts[i] <= AddressingModule.getTotalAddresses(j)) {
                        cidr[i] = j;
                        break;
                    }
                }
            }

            //calculating the static network portion
            let staticAddress = AddressingModule.getNetworkAddress(majorNetwork.address, majorNetwork.cidr);
            let splitDecimalStaticAddress = staticAddress.split(".");

            let binaryStaticAddress = "";

            for (let i = 0; i < splitDecimalStaticAddress.length; i += 1) {
                binaryStaticAddress = binaryStaticAddress.concat(ConversionModule.toByte(ConversionModule.decToBin(Number(splitDecimalStaticAddress[i]))));
            }

            //splitting apart the host address bits from the whole address
            binaryStaticAddress = binaryStaticAddress.substring(0, majorNetwork.cidr);

            //calculating bits available for host address
            let hostPortionBitLength = 32 - majorNetwork.cidr;

            let addresses = new Array(subnets.length);
            addresses[0] = Number(ConversionModule.format("0", hostPortionBitLength));

            //generating host address bits
            for (let i = 1; i < addresses.length; i += 1) {
                addresses[i] = addresses[i - 1] + AddressingModule.getTotalAddresses(cidr[i - 1]);
            }

            let subnetAddresses = new Array(addresses.length);

            //forming subnet addresses in plain binary
            for (let i = 0; i < subnetAddresses.length; i += 1) {
                subnetAddresses[i] = binaryStaticAddress.concat(ConversionModule.format(ConversionModule.decToBin(addresses[i]), hostPortionBitLength));
            }

            let decimalSubnetAddresses = new Array(subnetAddresses.length);

            //converting plain binary addresses into dotted decimal subnet addresses
            for (let i = 0; i < decimalSubnetAddresses.length; i += 1) {
                let binarySplitAddress = subnetAddresses[i].toString().match(/.{8}/g);

                let decimalSplitAddress = new Array(4);
                for (let j = 0; j < binarySplitAddress.length; j += 1) {
                    decimalSplitAddress[j] = ConversionModule.binToDec(binarySplitAddress[j]);
                }

                let formedAddress = "";
                for (let j = 0; j < decimalSplitAddress.length; j += 1) {
                    if (j > 0) {
                        formedAddress = formedAddress.concat(".").concat(String(decimalSplitAddress[j]));
                    } else {
                        formedAddress = formedAddress.concat(String(decimalSplitAddress[j]));
                    }
                }

                decimalSubnetAddresses[i] = formedAddress;
            }

            //building subnet address objects with cidr
            for (let i = 0; i < decimalSubnetAddresses.length; i += 1) {
                subnets[i] = new Subnet(decimalSubnetAddresses[i], cidr[i]);
            }

            return subnets;
        }

        throw Exceptions.SUBNET_EXCEPTION;
    }
}

export default new SubnetModule();
