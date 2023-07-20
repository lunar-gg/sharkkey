import process from 'process';
import cryptography from "./🐟/cryptography.js";
import compression from './🐟/compression.js';
/**
 * 🦈.js Base class, Includes basic functions,
 * and imports to other classes stored in ./🐟/
 */
class Shark {
    /**
     * Function to output the hardcoded ascii art by arrays
     * @returns String with ascii art 🦈🔑
     */
    static art() {
        const keyarray = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            @@@@@@@@@@@@@@@@@@@@@@**************@@@@
            @@@@@@@@@@@@@@@@@@@*******************@@
            @@@@@@@@@@@@@@@@@@*************@@@@****@
            @@@@@@@@@@@@@@@@@***********************
            @@@@@@@@@@@@@@@@@***********************
            @@@@@@@@@@@@@@@@@@**********************
            @@@@@@@@@@@@@@@@***********************@
            @@@@@@@@@@@@@************************@@@
            @@@@@@@@@@@*********************@@@@@@@@
            @@@@@@@@**************@@@@@@@@@@@@@@@@@@
            @@@@@@***********@@@@@@@@@@@@@@@@@@@@@@@
            @@@*************@@@@@@@@@@@@@@@@@@@@@@@@
            @***********@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            @***********@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            @*********@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`.split("\n");
        const sharkarray = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            @@@@@@@@@@@@@@@@@@@@@@@@@@********@@@@@@
            @@@@@@@@@@@@@*********************@@@@@@
            @@@@@@@@**************************@@@@@@
            @@@@*********************************@@@
            @@**********&&*****(**(***************@@
            @********..........(..(...***,...******@
            @@@**,......................*,.....****@
            @@@@@@..............................***@
            @@@@@@@@@@@@@@@@@@@@@*****@@@@......***@
            @@@@@@@@@@*******@@@@@@***@@@@......**@@
            @@@@@@@@@@@@********@@@@@@@@......***@@@
            @@@@@@@@@@@@@@*********.......,****@@@@@
            @@@@@@@@@@@@@@@@*******,********@@@@@@@@
            @@@@@@@@@@@@@@@@@******@@@@@@@@@@@@@@@@@
            @@@@@@@@@@@@@@@******@@@@@@@@@@@@@@@@@@@`.split("\n");
        let out = ""; // Declare out so we can use it

        /* Goes through every item in the array, and concats
        the same item from the other array to it 
        And also removes every occurance of 4 spaces */
        sharkarray.forEach((line, index) => {
            out += `${line + keyarray[index]}`.replace(new RegExp(/ {4}/g), "") + "\n";
        });
        return out;
    }

    /**
     * Logs <message> to console if "--verbose"
     * is found in the args
     * @param {string} message Message
     */
    static vlog(message) {
        // Check args for verbose flag
        if (process.argv.slice(2).includes('--verbose')) {
            console.log(message);
        } // Only log if the --verbose flag has been found
    }

    // Imports the cryptography class
    static cryptography = cryptography;
    // Imports the compression class
    static compression = compression;
}
export default Shark;