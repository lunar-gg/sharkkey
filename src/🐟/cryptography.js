// Native imports
import process from 'node:process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { Buffer } from 'node:buffer';
// First party Imports
import syncOsInfo from './synchronousOsInfo.js';
// Third party imports
import readlineSync from 'readline-sync';
import md6Hash from 'md6-hash';
import TOTP from 'totp.js';
import ip from 'ip';
import base32 from 'thirty-two';
import clipboard from 'clipboardy';
import qrcode from 'qrcode-terminal';
import nodeMachineId from 'node-machine-id';
import drivelist from './disklist.js';
import Compression from './compression.js';
const { machineIdSync } = nodeMachineId;
// Declare idObjectFile so we can use it globally
let idObjectFile;
/**
 * Contains cryptographic functions for 🦈.js
 */
class Cryptography {
    /**
     * A class that contains various hashing functions
     */
    static hash = class {

        /**
         * Function to hash a string using the MD6 algorithm
         * @param {string} string Message to hash 
         * @param {number} size Size, 0 (Recomended:at least 128) - 512 | 0 < d ≤ 512 bits
         * @returns {string} MD6 hashed string
         */
        static getMD6(string, size) {
            return md6Hash(string, { size: size });
        }

        /**
         * Reasonably secure 64 bit hashing of a string
         * @param {string} data Data to be hashed
         * @param {crypto.Encoding} inputEncoding The encoding of the data string.
         * @param {boolean} short If set to true, the output will be 16 chars, else output will be 32 chars.
         * @returns {string} Hashed data string
         * @property {string} baseHash shake128 hash of data
         * Uses shake128, shifting, and string mutations to get the desired 64 bit output
         */
        static fish64(data, inputEncoding = "utf8", short = false) {
                /** @type {string} shake128 hash of data */
                let baseHash = crypto.createHash('shake128')
                    .update(data, inputEncoding)
                    .digest('hex');

                /** @type {string[]} array of strings, containing different parts of baseHash */
                let shitedHashParts = [
                    Cryptography.shift(baseHash.slice(0, 8)),
                    Cryptography.shift(baseHash.slice(8, 16)),
                    Cryptography.shift(baseHash.slice(16, 24)),
                    Cryptography.shift(baseHash.slice(24, 32))
                ];

                /** 
                 * combines and shifts the shiftedHashParts into one hash
                 * @type {string} 
                 * combines first and third part of the shiftedHash, hashes them using shake128,
                 * then shifts the hash
                 * combines second and fourth part of the shiftedHash, hashes them using shake128,
                 * then shifts the hash
                 * 
                 * combines those two, shifts them, and hashes them using shake128
                 */

                let shiftedCombinedHashes = crypto.createHash('shake128').update(
                    Cryptography.shift(
                        crypto.createHash('shake128')
                        .update(`${shitedHashParts[0]}${shitedHashParts[2]}`)
                        .digest('hex')
                    ).toString() +
                    Cryptography.shift(
                        crypto.createHash('shake128')
                        .update(`${shitedHashParts[1]}${shitedHashParts[3]}`)
                        .digest('hex')
                    ).toString()

                ).digest('hex');

                /** 
                 * gets the middle part of shiftedCombinedHashes,
                 * shifts it,
                 * and then shifts that output, and then returns it.
                 * @type {string} */
                if (short) {
                    // truncate the output to 16 chars // 32 byte
                    return Cryptography.shift(
                        Cryptography.shift(
                            shiftedCombinedHashes.substring(8, 24)
                        )
                    );
                } else {
                    return Cryptography.shift(
                        Cryptography.shift(
                            shiftedCombinedHashes
                        )
                    );
                }

            } // baseHashLength 32, outputHashLength 16 // 32 (depends on short true\false)
        static fish128(data, inputEncoding = "utf8") {
                let baseHash = crypto.createHash('shake128', { outputLength: 32 })
                    .update(data, inputEncoding)
                    .digest('hex');
                let shiftedHashParts = [
                    Cryptography.shift(baseHash.slice(0, 16)),
                    Cryptography.shift(baseHash.slice(16, 32)),
                    Cryptography.shift(baseHash.slice(32, 48)),
                    Cryptography.shift(baseHash.slice(48, 64))
                ];

                let shiftedCombinedHashes = crypto.createHash('shake128', { outputLength: 32 }).update(
                    Cryptography.shift(
                        crypto.createHash('shake128')
                        .update(`${shiftedHashParts[0]}${shiftedHashParts[2]}`)
                        .digest('hex')
                    ).toString() +
                    Cryptography.shift(
                        crypto.createHash('shake128')
                        .update(`${shiftedHashParts[1]}${shiftedHashParts[3]}`)
                        .digest('hex')
                    ).toString()
                ).digest('hex');

                return Cryptography.shift(
                    Cryptography.shift(
                        shiftedCombinedHashes
                    )
                );
            } // baseHashLength 64, outputHashLength 64
        static fish256(data, inputEncoding = "utf8") {
                let baseHash = crypto.createHash('shake256', { outputLength: 64 })
                    .update(data, inputEncoding)
                    .digest('hex');

                let shiftedHashParts = [
                    Cryptography.shift(baseHash.slice(0, 32)),
                    Cryptography.shift(baseHash.slice(32, 64)),
                    Cryptography.shift(baseHash.slice(64, 96)),
                    Cryptography.shift(baseHash.slice(96, 128))
                ];
                let shiftedCombinedHashes = crypto.createHash('shake256', { outputLength: 64 }).update(
                    Cryptography.shift(
                        crypto.createHash('shake256')
                        .update(`${shiftedHashParts[0]}${shiftedHashParts[2]}`)
                        .digest('hex')
                    ).toString() +
                    Cryptography.shift(
                        crypto.createHash('shake256')
                        .update(`${shiftedHashParts[1]}${shiftedHashParts[3]}`)
                        .digest('hex')
                    ).toString()
                ).digest('hex');

                return Cryptography.shift(
                    Cryptography.shift(
                        shiftedCombinedHashes
                    )
                );
            } // baseHashLength 128, outputHashLength 128
        static fish512(data, inputEncoding = "utf8") {
                let baseHash = crypto.createHash('shake256', { outputLength: 128 })
                    .update(data, inputEncoding)
                    .digest('hex');
                let shiftedHashParts = [
                    Cryptography.shift(baseHash.slice(0, 64)),
                    Cryptography.shift(baseHash.slice(64, 128)),
                    Cryptography.shift(baseHash.slice(128, 192)),
                    Cryptography.shift(baseHash.slice(192, 256))
                ];

                let shiftedCombinedHashes = crypto.createHash('shake256', { outputLength: 128 }).update(
                    Cryptography.shift(
                        crypto.createHash('shake256')
                        .update(`${shiftedHashParts[0]}${shiftedHashParts[2]}`)
                        .digest('hex')
                    ).toString() +
                    Cryptography.shift(
                        crypto.createHash('shake256')
                        .update(`${shiftedHashParts[1]}${shiftedHashParts[3]}`)
                        .digest('hex')
                    ).toString()
                ).digest('hex');

                return Cryptography.shift(
                    Cryptography.shift(
                        shiftedCombinedHashes
                    )
                );
            } // baseHashLength 256, outputHashLength 256
    };

    /**
     * Turns a file path into a object containing filename, extention, and path
     * @param {string} filePath 
     * @returns {object}
     */
    static getFilePath(filePath) {
        const filename = path.basename(filePath);
        const extension = path.extname(filePath);
        const directoryPath = path.dirname(filePath);
        return {
            filename,
            extension,
            directoryPath
        };
    }

    /**
     * Given features[] and "file path or string" returns computed ID string
     * @param {string[]} features Array of strings, taken from args, containing info about what info we use to create the ID string for encryption
     * @param {string} file File path, or just a text string if --string is used
     * @returns {string} Computed ID string
     */
    static createIDString(features, file) {
        let id = "";
        let osInfo;
        if (features.includes("hwid")) {
            // get hwid
            id += machineIdSync(true);
        }
        if (features.includes("distro") || features.includes("hostname") || features.includes("platform") || features.includes("serial")) {
            osInfo = syncOsInfo();
        }
        if (features.includes("lip")) {
            id += `${ip.address()}`;
        }
        if (features.includes("username")) {
            id += `${os.userInfo().username}`;
        }
        if (features.includes("timezone")) {
            id += `${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
        }
        if (features.includes("locale")) {
            id += `${Intl.DateTimeFormat().resolvedOptions().locale}`;
        }
        if (features.includes("distro")) {
            id += `${osInfo.distro}`;
        }
        if (features.includes("hostname")) {
            id += `${os.hostname}`;
        }
        if (features.includes("platform")) {
            id += `${osInfo.platform}`;
        }
        if (features.includes("serial")) {
            id += `${osInfo.serial}`;
        }
        if (features.includes("filename")) {
            id += `${file}`;
        }
        /*
        For this to work we need to refactor disklist.js to provide the exact same output no matter what machine its connected to (win/unix/darwin)
        As of right now, the output is different depending on what OS it is, even tho it is the same physical drive.

        if (features.includes("usb")) {
            let drive = Cryptography.usb.getSerialHex() || false;
            if (typeof drive !== 'object') throw new Error("No useable USB drive connected.");
            console.log(`Using drive ${drive.displayName} - ${drive.description} for encryption. This means you need this USB drive to be connected when you decrypt.`);
            id += `${drive.serial}`;
        }
        */
        // Remove the spaces from the ID string
        id = id.replace(/ /g, "");
        return id;
    }

    /**
     * Generates a key used for encryption and decryption based on the users password, and a list of "features"
     * @param {string} password User chosen password
     * @param {string[]} featuresArray Array of strings, taken from args, containing info about what info we use to create the ID string for encryption
     * @param {boolean} createIDFile Wether or not we should create an ID file
     * @param {string} file file name or path
     * @returns {string} Key used for encryption and decryption
     */
    static calculateKey(password, featuresArray, createIDFile, file) {
        // Generate the ID string
        let id = Cryptography.createIDString(featuresArray, file);

        // Turn the ID into a SHA256 hash
        id = `${crypto.createHash('sha256').update(id).digest('hex')}`;

        // Handle the ID - and turn it into an object with the two halves
        let idObject = Cryptography.handle.identifierHash(id);

        // Combine the two halves, and do it again
        idObject = Cryptography.handle.identifierHash(`${idObject[0]}${idObject[1]}`);

        // Declare the variables so we can use them later
        let halfId = idObject[0];
        let halfId2 = idObject[1];

        if (createIDFile) { // if we need to create an ID file along with the encrypted file

            // Generate the timestamp for when the ID file should be invalid
            let expiresTimestamp = Cryptography.object.addExpire(1, "hours");
            let filePath = Cryptography.getFilePath(file); // Get the full file path for the file we're encrypting

            // Set the idObjectFile object
            idObjectFile = {
                "name": "ID for file encrypted with SharkKey",
                "id": {
                    0: halfId,
                    1: halfId2
                },
                "associatedFiles": [
                    { filename: filePath.filename, md5: Cryptography.hash.fish64(fs.readFileSync(file, "utf8")) }
                ],
                "expires": `${expiresTimestamp}`
            };
        }

        // Work with the MD6 hash of the user's chosen key
        const md6key = Cryptography.handle.md6(
            Cryptography.hash.getMD6(
                Cryptography.handle.md6(
                    Cryptography.hash.getMD6(password, 128),
                    128),
                128
            )
        );

        // Combine everything and shift by the value of the first integer found in the combined string
        let combined = `${halfId}${md6key}${halfId2}`;
        let final = Cryptography.shift(combined);
        return final; // Return the final key
    }

    /**
     * Shifts the given string by the first integer in the string.
     * @param {*} str 
     * @returns {string}
     */
    static shift(str) {
        // Get first integer in string
        let shiftTimes = str.match(/\d/)[0];
        // Calculate the effective shift amount within the string length
        let shiftAmount = shiftTimes % str.length;
        // Perform the shift by slicing the string and concatenating the parts
        let shifted = str.slice(-shiftAmount) + str.slice(0, -shiftAmount);
        return shifted; // Return the shifted string
    }

    /**
     * A class that provides methods for handling md6 hashes, and the identifierHash
     */
    static handle = class {

        /**
         * Applies various methods to alter the MD6 hash
         * @param {string} md6key MD6 Hash
         * @returns {string} Altered MD6 hash.
         */
        static md6(md6key) {
            // Reverse md6
            md6key = md6key.split("").reverse().join("");

            // Shift it by its own first int
            md6key = Cryptography.shift(md6key);

            // Reverse md6
            md6key = md6key.split("").reverse().join("");

            // split by every other - into two arrays (xx, yy)
            let zz = md6key.split(''); // Array of every char
            let xx = zz.filter((element, index) => {
                return index % 2 === 0;
            });
            let yy = zz.filter((element, index) => {
                return index % 2 !== 0;
            });

            // Convert the two "halves" of the md5 hash back into strings
            let md6h1 = xx.join('').toString();
            let md6h2 = yy.join('').toString();

            // split md6h1 into two strings, and then shift them individually,
            // lastly converting them back into a string called md6h1final
            let md6h1final = `${Cryptography.shift(md6h1.slice(0, md6h1.length / 2))}${Cryptography.shift(md6h1.slice(md6h1.length / 2, md6h1.length))}`;

            // split md6h2 into two strings, and then shift them individually,
            // lastly converting them back into a string called md6h2final
            let md6h2final = `${Cryptography.shift(md6h2.slice(0, md6h2.length / 2))}${Cryptography.shift(md6h2.slice(md6h2.length / 2, md6h2.length))}`;

            // combine the 2 halves, and then shift, set md6key to the output
            md6key = Cryptography.shift(`${md6h1final}${md6h2final}`);

            // return the result
            return md6key;
        }

        /**
         * Performs string manipulations and shifting to the id
         * and returns a object with the two halves
         * @param {string} id 
         * @returns {object} { 0: <halfid1>, 1: <halfid2}
         */
        static identifierHash(id) {
            // split by every other char - into two arrays (x, y)
            let arr = id.split('');
            let x = arr.filter((element, index) => {
                return index % 2 === 0;
            });
            let y = arr.filter((element, index) => {
                return index % 2 !== 0;
            });

            // Turn them back into strings, and shift them individually
            let halfId = Cryptography.shift(x.join(''));
            let halfId2 = Cryptography.shift(y.join(''));

            if (id.length === 64) {
                // The two "halves" of the hwid
                // We are by design throwing away 32 chars here, to make
                // hard to reverse it.
                /** last 16 chars of string */
                halfId = x.join('').slice(16, x.join('').length);

                /** First 16 chars of string */
                halfId2 = y.join('').slice(0, y.join('').length / 2);
            }
            // Return object with the half ids
            return { 0: halfId, 1: halfId2 };
        }
    };

    /**
     * A class that provides functions to obfuscate and deobfuscate hex strings
     */
    static hex = class {
        /**
         * Obfuscates a given hexadecimal string by replacing each digit
         * with its corresponding obfuscated value from the hexMapping object.
         * @param {string} hexString - The hexadecimal string to be obfuscated.
         * @returns {string} - The obfuscated hexadecimal string.
         */
        static obfuscateHexString = (hexString) => {
            // A mapping object that defines the obfuscated values for each hexadecimal digit.
            const hexMapping = {
                '0': 'f',
                '1': 'e',
                '2': 'd',
                '3': 'c',
                '4': 'b',
                '5': 'a',
                '6': '9',
                '7': '8',
                '8': '7',
                '9': '6',
                'a': '5',
                'b': '4',
                'c': '3',
                'd': '2',
                'e': '1',
                'f': '0'
            };
            // Declare obfuscatedString so we can use it later
            let obfuscatedString = '';

            for (const hexDigit of hexString) {
                // Check if the hexMapping contains the current hexDigit.
                if (Object.prototype.hasOwnProperty.call(hexMapping, hexDigit)) {
                    // if the hexDigit is found in the mapping, replace it. If not, leave it as it is
                    obfuscatedString += hexMapping[hexDigit];
                } else {
                    obfuscatedString += hexDigit;
                }
            }
            // Return obfuscated string
            return obfuscatedString;
        };

        /**
         * Deobfuscates a given obfuscated hexadecimal string by replacing each digit
         * with its corresponding deobfuscated value from the hexMapping object.
         * @param {string} obfuscatedHex - The hexadecimal string to be deobfuscated.
         * @returns {string} - The deobfuscated hexadecimal string.
         */
        static unobfuscateHexString = (obfuscatedHex) => {
            // A mapping object that defines the deobfuscated values for each hexadecimal digit.
            const hexMapping = {
                'f': '0',
                'e': '1',
                'd': '2',
                'c': '3',
                'b': '4',
                'a': '5',
                '9': '6',
                '8': '7',
                '7': '8',
                '6': '9',
                '5': 'a',
                '4': 'b',
                '3': 'c',
                '2': 'd',
                '1': 'e',
                '0': 'f'
            };
            // Declare deobfuscatedString so we can use it layer
            let deobfuscatedString = '';

            for (const hexDigit of obfuscatedHex) {
                if (Object.prototype.hasOwnProperty.call(hexMapping, hexDigit)) {
                    // if the hexDigit is found in the mapping, replace it. If not, leave it as it is
                    deobfuscatedString += hexMapping[hexDigit];
                } else {
                    deobfuscatedString += hexDigit;
                }
            }

            // Return the deobfuscated string
            return deobfuscatedString;
        };
    };

    /**
     * A class that provides functions to encrypt and decrypt objects
     */
    static object = class {

        /**
         * Encrypts the given object with the given passphrase
         * @param {object} obj
         * @param {string} passphrase User chosen password
         * @returns {string} Encrypted and obfuscated string
         */
        static encryptObject(obj, passphrase) {
            const jsonString = JSON.stringify(obj); // Stringify the object

            // Parses the given passphrase into a pbkdf2 (sha512) hash
            const parsedKey = Cryptography.hash.fish128(passphrase, "utf8");

            // Create the cipher and encrypt the data
            const iv = Buffer.from(Cryptography.hash.fish64(parsedKey, "utf8", true), 'utf8');
            const cipher = crypto.createCipheriv('aes-256-gcm', Cryptography.hash.fish64(parsedKey, "utf8", false), iv);
            let enc = cipher.update(jsonString, 'utf8', 'hex'),
                tag;
            enc += cipher.final('hex');
            tag = cipher.getAuthTag();
            let rawEncrypted = enc + "$$" + tag.toString('hex') + "$$" + iv.toString('hex');
            // Obfuscate the encrypted string
            let encryptedString = Cryptography.hex.obfuscateHexString(rawEncrypted);
            return encryptedString; // Return the obfuscated string
        }

        /**
         * Decrypts the given string into a object using the given passphrase
         * @param {string} passphrase User chosen password
         * @param {string} data Encrypted and obfuscated object
         * @returns {object} Decrypted and deobfuscated object
         */
        static decryptObject(passphrase, data) {
            // Parse provided passphrase
            const parsedKey = Cryptography.hash.fish128(passphrase, "utf8");

            // Define encryptedString as the input parameter id, and unobfuscate it
            let encryptedString = data;
            encryptedString = Cryptography.hex.unobfuscateHexString(encryptedString);

            // Create the decipher
            let cipherSplit = encryptedString.split("$$");
            let text = cipherSplit[0];
            let tag = Buffer.from(cipherSplit[1], 'hex');
            let iv = Buffer.from(cipherSplit[2], 'hex');
            const decipher = crypto.createDecipheriv('aes-256-gcm', Cryptography.hash.fish64(parsedKey, "utf8", false), iv);

            // Decrypt the data
            decipher.setAuthTag(tag);
            let decryptedData = decipher.update(text, 'hex', 'utf8');
            decryptedData += decipher.final('utf8');

            // Parse the object and return it
            const IDObject = JSON.parse(decryptedData);
            return IDObject;
        }

        /**
         * Function that outputs a timestamp given a unit and duration
         * @param {number} duration 
         * @param {string} unit Either "hours", "days", or "years"
         * @returns {Date}
         */
        static addExpire(duration, unit) {
            // Define expirationDate
            let expirationDate = new Date();

            // Modify the expirationDate
            switch (unit) {
                case "hours":
                    expirationDate.setHours(expirationDate.getHours() + duration);
                    break;
                case "days":
                    expirationDate.setDate(expirationDate.getDate() + duration);
                    break;
                case "years":
                    expirationDate.setFullYear(expirationDate.getFullYear() + duration);
                    break;
                default:
                    throw new Error("Required parameter <unit> in addExpire() was undefined, or not set correctly.");
            }

            // Return expirationDate (instanceof Date)
            return expirationDate;
        }

        /**
         * Reads the "expires" value of a object, returns true if the timestamp in the object is in the past.
         * @param {object} jsonObject 
         * @returns 
         */
        static hasExpired(jsonObject) {
            if (!jsonObject.expires) throw new Error("Object doesn't have a <expires> key.");
            try {
                if (jsonObject.expires instanceof Date) {
                    const currentTime = new Date();
                    return currentTime > jsonObject.expires;
                }
            } catch (err) {
                console.log(err);
                throw new Error("An error occured whilst trying to check if the object has expired.");
            }
            return false;
        }

        /**
         * Function that unobfuscates and returns the JSON object given the raw file data
         * @param {string} rawFileData Raw file data (Make sure it's not Base64 encoded.)
         * @returns {object}
         */
        static readFileObject(rawFileData) {
            try {
                // Unobfuscate the data
                const unobfuscatedHex = Cryptography.hex.unobfuscateHexString(rawFileData);
                // Decode from hex to utf8
                const decodedString = Buffer.from(unobfuscatedHex, "hex").toString("utf8");
                // Parse the JSON object
                const parsedObject = JSON.parse(decodedString);
                return parsedObject;
            } catch (err) {
                console.log(err);
                throw new Error("An error occured while trying to read the file object.");
            }
        }

        /**
         * 
         * @param {string} rawEncrypted Base64 encoded (and encrypted) string
         * @param {string} key encryption key
         * @param {string[]} features Array containing the "features" / ways to encrypt
         * @param {string} file filename / file path, Defaults to "string" when --string is used
         * @returns {string} Hex encoded and obfuscated JSON object
         */
        static writeFileObject(rawEncrypted, key, features = [], file = "string") {
            let showFile = "Hidden";
            let useTOTP = features.includes("totp") || false;
            if (features.includes("filename")) { showFile = file; }

            let jsonData = {
                "raw": `${rawEncrypted}`,
                "file": showFile,
                "features": features,
                "TOTP": false
            };

            // Setup TOTP
            // 🦈--> Find a better way to implement this more securely.
            if (useTOTP) {
                jsonData.TOTP = true;
                // Hash the key using fish128
                let hashedKey = Cryptography.hash.fish128(key, "utf8");
                // base32 encode
                let b32key = base32.encode(hashedKey).toString().replace(/=/g, "");
                // create otp
                let otp = new Cryptography.totp(b32key);
                // generate a URL useable by Google Authenticator
                let gaUrl = otp.gaURL(decodeURIComponent(path.basename(file).replace(/\./g, "_")), encodeURIComponent(os.userInfo().username + "@🦈🔑"));
                // Log to console to show the user
                console.log("✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨");
                qrcode.generate(gaUrl, { small: true }); // Generate and show QR Code
                console.log("Scan above QR code with Google Authenticator, or go to the url manually, or use the key in your auth app of choice.");
                console.log("URL:", gaUrl);
                console.log("Key:", b32key);
            }

            // Stringify, encode to hex, and obfuscate it. - and then return it
            let hexString = Buffer.from(JSON.stringify(jsonData, null, 4), "utf8").toString("hex");
            return Cryptography.hex.obfuscateHexString(hexString);
        }
    };

    /**
     * Encrypts given data and returns a  Base64 encoded hex obfuscated object that contains file / string info, and the raw encrypted data
     * @param {string} data file name / file path OR string to encrypt if --string is used
     * @param {string} key Hashed (id string + password) string
     * @param {boolean} isString If the data is a string and not a file(path) set to true if --string is used
     * @param {string[]} [features=[]] Array of strings, taken from args, containing info about what info we use to create the ID string for encryption
     * @returns {string} Base64 encoded hex obfuscated object that contains file / string info, and the raw encrypted data
     */
    static encryptData(data, key, isString, features) {
        let dataToEncrypt;

        switch (isString) {
            // If we want to encrypt a string
            case true:
                dataToEncrypt = data;
                break;
                // If we want to encrypt a file
            case false:
                dataToEncrypt = fs.readFileSync(data, "utf8");
                break;
            default:
                throw new Error("Required parameter <isString> in encryptData() was undefined, or not set correctly.");
        }
        // Define variables so we can use them in the catch{}
        let rawEncrypted;
        let encrypted;
        // Basic error checking in encrypt flow
        try {
            const iv = Buffer.from(Cryptography.hash.fish64(key, "utf8", true), 'utf8');
            const cipher = crypto.createCipheriv('aes-256-gcm', Cryptography.hash.fish64(key, "utf8", false), iv);
            let enc = cipher.update(dataToEncrypt, 'utf8', 'hex'),
                tag;
            enc += cipher.final('hex');
            tag = cipher.getAuthTag();
            rawEncrypted = enc + "$$" + tag.toString('hex') + "$$" + iv.toString('hex');
            encrypted = Cryptography.object.writeFileObject(rawEncrypted, key, features, isString ? "string" : data);

            return Buffer.from(encrypted, "utf8").toString("base64"); // encrypts to base64
        } catch (err) {
            console.error(err);
            process.exit(0);
        }
    }

    /**
     * Function to check if files exist, and ask for permission to overwrite them if they do
     * @param {string} file file name / path
     * @param {string} mode Either "encrypt" or "decrypt" - Used for determing file extentions
     * @param {boolean} [createIDFile=false] if we want to create a ID file along with the encrypted file
     */
    static prepareSave(file, mode, createIDFile = false) {
        let fileString;

        // define fileString depending on what "mode" we're using
        switch (mode) {
            case "encrypt":
                fileString = file + '.🦈🔑';
                break;
            case "decrypt":
                fileString = file.replace(".🦈🔑", "");
                break;
            default:
                throw new Error("Required parameter <mode> in prepareSave() is either undefined, or incorrectly set.");
        }

        // We test for fileString OR keyfile, as if fileString dosn't exist, but keyfile does, we're gonna get an exception.
        if (fs.existsSync(fileString) || fs.existsSync(file + '.🦈🔑🪪')) {
            // Ask user for permission to overwrite
            const overwriteFile = readlineSync.keyInYNStrict(`The file ${fileString} already exists, do you want to overwrite it?`);
            switch (overwriteFile) {
                // We should overwrite the file, so delete it.
                case true:
                    // Only check if the mode is encrypt and we need to create an ID file.
                    if (createIDFile || mode === "encrypt") {
                        if (fs.existsSync(file + '.🦈🔑🪪')) {
                            // Key file already exists, but we've been given permission to overwrite. So delete the key file.
                            fs.unlinkSync(file + '.🦈🔑🪪');
                        }
                    }
                    return true;
                case false:
                    // Unable to proceed, as we can't overwrite the files.
                    // 🦈--> maybe use console.log() to show the message, and then use process.exit(1) instead of throwing an error.
                    throw new Error("You chose not to overwrite the file, please rename or move the file yourself, and then try again.");
                default:
                    throw new Error("When asked for permission to overwrite, the user input was invalid.");
            }
        }
        // File(s) dosn't exist, so we can just return true
        return true;
    }

    /**
     * Main encryption flow
     * @param {string} key Hashed (id string + password) string
     * @param {string} data file name / file path OR string to encrypt if --string is used
     * @param {boolean} deleteOriginal if we should delete the original (unencrypted) file after we have created a new encrypted one
     * @param {string[]} features Array of strings, taken from args, containing info about what info we use to create the ID string for encryption
     * @param {boolean} createIDFile If we should create a ID file along with the encrypted file
     * @param {boolean} isString If the data is a string and not a file(path) set to true if --string is used
     * @param {boolean} doCopy If we should copy the output to the clipboard
     * @param {string} [userkey="cHaNgE-mE"] Password for ID files, if created.
     * @returns {object} Object that contains information about the operation (file location +++)
     */
    static encrypt(key, data, deleteOriginal = false, options) {

        let features = options.features || [];
        let createIDFile = options.createIDFile || false;
        let isString = options.isString || false;
        let doCopy = options.doCopy || false;
        let userkey = options.userkey || 'cHaNgE-mE';
        let compression = options.compression || false;

        let encrypted = Cryptography.encryptData(data, key, isString, features);

        if (compression) {
            encrypted = Compression.compressString(encrypted);
        }
        // 🦈--> Add return statements with objects
        try {
            switch (isString) {
                case true: // Return the encrypted string
                    if (doCopy) {
                        // Copy the encrypted string into the clipboard
                        clipboard.writeSync(encrypted);
                    }
                    return encrypted;
                case false: // Save file
                    // Check if files exist, if they do - ask for permission to overwrite
                    if (Cryptography.prepareSave(data, "encrypt", createIDFile)) {
                        // We are ready to save
                        fs.writeFileSync(data + '.🦈🔑', `${encrypted}`, "utf8");
                        if (doCopy) {
                            clipboard.writeSync(`${encrypted}`);
                        }
                        if (createIDFile) {
                            fs.writeFileSync(data + '.🦈🔑🪪', Cryptography.object.encryptObject(idObjectFile, userkey), "utf8");
                        }
                    } else { throw new Error("Enexpected return value from prepareSave() in the encryption flow"); }
                    break;
                default:
                    throw new Error("Value isString was neither true or false");
            }

            // if we need to delete the original file
            if (deleteOriginal) {
                fs.unlinkSync(data);
            }

            // we return wether the file exists so we only return true if the file has been created
            return fs.existsSync(data + '.🦈🔑');
        } catch (err) {
            // 🦈--> maybe use console.log() to show the message, and then use process.exit(1) instead of throwing an error.
            console.log("There was an error writing the file(s), or outputting the string");
            throw new Error(err);
        }
    }

    /**
     * Decrypts given data wether it being a file (path) or a string
     * @param {string} key User password. Note that this is not the hased (id string + password), this is just the users password.
     * @param {string} data name / file path OR string to decrypt if --string is used
     * @param {boolean} isString If the data is a string and not a file(path) - set to true if --string is used
     * @returns {string} Decrypted data
     */
    static decryptData(key, data, isString, compression = false) {
        // declare dataToDecrypt for use later
        let dataToDecrypt;
        let file;
        try {
            // set dataToDecrypt to the correct data, and decode it from Base64
            switch (isString) {
                case true:
                    file = 'string';
                    if (compression) {
                        data = Compression.decompressString(data);
                    }
                    dataToDecrypt = Buffer.from(data, "base64").toString("utf8");
                    break;
                case false:
                    file = data.replace('.🦈🔑', '');
                    if (compression) {
                        dataToDecrypt = Buffer.from(Compression.decompressString(fs.readFileSync(data, "utf8")), "base64").toString("utf8");
                    } else {
                        dataToDecrypt = Buffer.from(fs.readFileSync(data, "utf8"), "base64").toString("utf8");
                    }
                    break;
                default:
                    console.log("decryptData() - Parameter - isString:", isString);
                    throw new Error("Required parameter <isString> in decryptData() was undefined, or set incorrectly.");
            }

            // Get the json object from the file
            let jsonData = Cryptography.object.readFileObject(dataToDecrypt);

            // Calculate the hashed key
            let hashKey = Cryptography.calculateKey(key, jsonData.features, false, file);

            // Check if the file is secured with TOTP
            // 🦈--> Gotta think of a better way of implementing this, as of right now - anyone with the source code, JS knowlege, and time can bypass it.
            if (jsonData.TOTP) {
                // TOTP is enabled, Ask the user for their auth code, and validate it
                // base32 encode
                let b32key = base32.encode(hashKey).toString().replace(/=/g, "");
                let otp = new Cryptography.totp(b32key); // create otp

                // Ask the user for their TOTP code
                let userotp = readlineSync.questionInt("Enter the code found in your authenticator app ");

                // Check if user input is correct, if not - stop and throw error
                if (!otp.verify(userotp.toString())) {
                    throw new Error("Incorrect TOTP!");
                } // Continue and allow decryption
            }

            // Decrypt the data
            let cipherSplit = jsonData.raw.split("$$");
            let text = cipherSplit[0];
            let tag = Buffer.from(cipherSplit[1], 'hex');
            let iv = Buffer.from(cipherSplit[2], 'hex');
            const decipher = crypto.createDecipheriv('aes-256-gcm', Cryptography.hash.fish64(hashKey, "utf8", false), iv);
            decipher.setAuthTag(tag);
            let decryptedData = decipher.update(text, 'hex', 'utf8');
            decryptedData += decipher.final('utf8');
            return decryptedData; // Return the decrypted data
        } catch (err) { // 99% chance of it being cased by using the incorrect password, but log to console just in case.
            throw new Error("An error occured while decrypting! - Have you entered the right password?");
        }
    }

    /**
     * Main decrypt flow
     * @param {string} key 
     * @param {string} file 
     * @param {boolean} deleteOriginal 
     * @param {boolean} [isString=false] 
     * @param {boolean} [doCopy=false] 
     */
    static decrypt(key, file, deleteOriginal = false, isString = false, doCopy = false, compression = false) {
        // Decrypt the file / string
        let originalText = Cryptography.decryptData(key, file, isString, compression); // We declare it here first so we can use it in the low later.

        switch (isString) {
            case true:
                if (doCopy) {
                    clipboard.writeSync(originalText);
                }
                return originalText;
            case false:
                // Check if file exists, if it does - ask for permission to overwrite
                if (Cryptography.prepareSave(file, "decrypt")) {
                    // We are ready to save
                    fs.writeFileSync(file.replace('.🦈🔑', ''), originalText);

                    // Copy to clipboard
                    if (doCopy) {
                        clipboard.writeSync(originalText);
                    }

                } else { throw new Error("Enexpected return value from prepareSave() in the decrypt flow"); }
                break;
            default:
                throw new Error("Required parameter isString was neither true or false");
        }
        // Delete original file (making sure isString is false, as if it was true, there would be no original file to delete.)
        try {
            if (deleteOriginal && !isString) {
                // It dosnt matter if the file exists, as then we wouldn't need to delete it, it's just here to avoid an exception.
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            }
        } catch (err) {
            // something went wrong, most likely permissions, or file being locked (Used by another process). It's not fatal, so we don't need to throw an error or stop the program.
            console.error("Error deleting original file");
        }

        // we return wether the file exists so we only return true if the file has been created
        return fs.existsSync(file.replace('.🦈🔑', ''));
    }

    // Declare TOTP (from totp.js) here so we can use it everywhere
    static totp = TOTP;

    /**
     * Function to get info from an ID file
     * @param {string} file File name / path of ID file
     * @param {string} key User password. Note that this is not the hased (id string + password), this is just the users password.
     * @param {boolean} doCopy If we should copy the output to the clipboard
     * @returns {object} ID Object
     */
    static checkid(file, key, doCopy = false) {
            if (fs.existsSync(file)) {
                let id;
                let fileData = fs.readFileSync(file, 'utf8');
                try { // Try to decrypt
                    id = Cryptography.object.decryptObject(key, fileData);
                } catch (err) { // 99% chance of it being cased by using the incorrect password, but log to console just in case.
                    console.log(err);
                    throw new Error("An error occured while trying to decrypt the file info! - Have you entered the right password?");
                }
                if (doCopy) {
                    // Stringify the id object and copy it to the clipboard
                    clipboard.writeSync(JSON.stringify(id, null, 2));
                }
                return id; // Return the id object
            } else // 🦈--> This is not serious enough to stop the program, so write an exception handler on the other end.
            { throw new Error("File does not exist."); }
        }
        /**
         * Class to work with USB Hard drives for verification
         */
    static usb = class {
        /**
         * @param {boolean} [useUnsafeIdentifiers=false] Wether or not to use unsafe drive identifiers that might change, such as display name, mountpoints, and label
         * If set to false, we will use these values: Size, Protected, System, Removable
         * @returns Hex string a pseudo serial number of the USB Drive
         * TODO: Add var with name so we get the correct USB Drive, and not just some random one.
         * TODO: Add function to return USB Drive name, and other identifiers to show to the user
         * so they can select the right USB drive they would like to use for encryption.
         */
        static getSerialHex(useUnsafeIdentifiers = false) {
            try {
                const drives = drivelist.listDrivesSync({ returnOnlyRemovable: false });
                let drive = drives.find(_drive => _drive.removable && !_drive.system);
                let driveHashString;
                switch (useUnsafeIdentifiers) {
                    case true:
                        driveHashString = drive.displayName + drive.label +
                            JSON.stringify(drive.mountpoints) + drive.description + drive.size +
                            drive.removable + drive.system + drive.protected;
                        break;
                    case false:
                        driveHashString = drive.size + drive.removable +
                            drive.system + drive.protected;
                        break;
                }
                driveHashString = Buffer.from(encodeURIComponent(driveHashString.replace(/ /g, ""))).toString("hex");
                return {
                    displayName: drive.displayName,
                    description: drive.description,
                    serial: Cryptography.hash.fish512(driveHashString, "hex")
                };
            } catch (err) {
                throw new Error(err);
            }
        }
        static checkSerial() {

        }
    };
}
export default Cryptography;