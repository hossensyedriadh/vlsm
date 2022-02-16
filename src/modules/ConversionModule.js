import * as Exceptions from "./Exceptions";

class ConversionModule {
    binToDec = (bin) => {
        bin = String(bin);

        let base = Number(bin.length);
        let dec = new Array(base);

        for (let i = Math.pow(2, base - 1), j = 0; i >= 1 && j < dec.length; i >>= 1, j += 1) {
            dec[j] = i;
        }

        let binArray = bin.split('');
        let octet = 0;

        for (let i = 0; i < dec.length; i += 1) {
            if (binArray[i] === '1') {
                octet += dec[i];
            }
        }

        return octet;
    }

    decToBin = (dec) => {
        dec = Number(dec);

        if (dec === 0) {
            return "0";
        }

        if (dec === 1) {
            return "1";
        }

        if (dec > 1) {
            let bin = "";

            let count = 0;
            for (let i = 1; i <= dec; i <<= 1) {
                count += 1;
            }

            let array = new Array(count);

            for (let i = 1, j = 0; i <= dec && j < array.length; i <<= 1, j += 1) {
                array[j] = i;
            }

            for (let i = array.length - 1; i >= 0; i -= 1) {
                if (dec - array[i] >= 0) {
                    dec -= array[i];
                    bin = bin.concat("1");
                } else {
                    bin = bin.concat("0");
                }
            }

            return bin.toString();
        } else {
            throw Exceptions.ILLEGAL_ARGUMENT_EXCEPTION;
        }
    }

    toByte = (bin) => {
        bin = String(bin);
        let binLength = bin.length;

        if (binLength % 8 !== 0 && binLength < 8) {
            let temp = bin;
            bin = "";
            bin = bin.concat("0".repeat(8 - binLength));
            bin = bin.concat(temp);
        }

        return bin.toString();
    }

    format = (bin, size) => {
        bin = String(bin);
        size = Number(size);

        let binLength = bin.length;

        if (binLength % size !== 0 && binLength < size) {
            let temp = bin;
            bin = "";
            bin = bin.concat("0".repeat(size - binLength));
            bin = bin.concat(temp);
        }

        return bin.toString();
    }
}

export default new ConversionModule();
