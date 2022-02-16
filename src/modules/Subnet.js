import AddressingModule from "./AddressingModule";

class Subnet {
    #address = "";
    #cidr = 0;
    #subnetMask = "";

    constructor(address, cidr) {
        this.#address = String(address);
        this.#cidr = Number(cidr);
        this.#subnetMask = AddressingModule.getSubnetMask(Number(cidr));
        this._address = String(address);
        this._cidr = Number(cidr);
        this._subnetMask = AddressingModule.getSubnetMask(Number(cidr));
    }

    get address() {
        return this._address;
    }

    get cidr() {
        return this._cidr;
    }

    get subnetMask() {
        return this._subnetMask;
    }
}

export default Subnet;
