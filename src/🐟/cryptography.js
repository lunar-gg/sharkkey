import readline from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process';
import CryptoJS from 'crypto-js'
import crypto from 'crypto'
import md6Hash from 'md6-hash';
import TOTP from 'totp.js';
import { getHWID } from 'hwid'
import ip from 'ip'
import os from 'os'
import yesno from 'yesno';
import si from 'systeminformation'
import fs from 'fs'
import path from 'path'
import base32 from 'thirty-two'
import clipboard from 'clipboardy'
import qrcode from 'qrcode-terminal'
import process from 'process'
import { Buffer } from 'node:buffer';
/**
 * Contains cryptographic functions for 🦈.js
 */
console.vlog = (() => {})
var idObjectFile;
String.prototype.hexEncode = function() {
    var hex, i;
    var result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }
    return result;
}
String.prototype.hexDecode = function() {
    let hex = this.toString();
    let result = "";
    for (let i = 0; i < hex.length; i += 4) {
        const code = parseInt(hex.substr(i, 4), 16);
        result += String.fromCharCode(code);
    }
    return result;
};

class cryptography {
    static hash = class {
        /**
         * Function to hash a string using the MD6 algorithm
         * @param {string} string Message to hash 
         * @param {number} size Size, 0 (Recomended:at least 128) - 512 | 0 < d ≤ 512 bits
         * @returns {string} MD6 hashed string
         */
        static getMD6(string, size) {
            return md6Hash(string, { size: size })
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
                    .digest('hex')

                /** @type {string[]} array of strings, containing different parts of baseHash */
                let shitedHashParts = [
                    cryptography.shift.doShift(baseHash.slice(0, 8)),
                    cryptography.shift.doShift(baseHash.slice(8, 16)),
                    cryptography.shift.doShift(baseHash.slice(16, 24)),
                    cryptography.shift.doShift(baseHash.slice(24, 32))
                ]

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
                    cryptography.shift.doShift(
                        crypto.createHash('shake128')
                        .update(`${shitedHashParts[0]}${shitedHashParts[2]}`)
                        .digest('hex')
                    ).toString() +
                    cryptography.shift.doShift(
                        crypto.createHash('shake128')
                        .update(`${shitedHashParts[1]}${shitedHashParts[3]}`)
                        .digest('hex')
                    ).toString()

                ).digest('hex')

                /** 
                 * gets the middle part of shiftedCombinedHashes,
                 * shifts it,
                 * and then shifts that output, and then returns it.
                 * @type {string} */
                if (short) {
                    // truncate the output to 16 chars // 32 byte
                    return cryptography.shift.doShift(
                        cryptography.shift.doShift(
                            shiftedCombinedHashes.substring(8, 24)
                        )
                    )
                } else {
                    return cryptography.shift.doShift(
                        cryptography.shift.doShift(
                            shiftedCombinedHashes
                        )
                    )
                }

            } // baseHashLength 32, outputHashLength 16 // 32 (depends on short true\false)
        static fish128(data, inputEncoding = "utf8") {
                let baseHash = crypto.createHash('shake128', { outputLength: 32 })
                    .update(data, inputEncoding)
                    .digest('hex');
                let shiftedHashParts = [
                    cryptography.shift.doShift(baseHash.slice(0, 16)),
                    cryptography.shift.doShift(baseHash.slice(16, 32)),
                    cryptography.shift.doShift(baseHash.slice(32, 48)),
                    cryptography.shift.doShift(baseHash.slice(48, 64))
                ];

                let shiftedCombinedHashes = crypto.createHash('shake128', { outputLength: 32 }).update(
                    cryptography.shift.doShift(
                        crypto.createHash('shake128')
                        .update(`${shiftedHashParts[0]}${shiftedHashParts[2]}`)
                        .digest('hex')
                    ).toString() +
                    cryptography.shift.doShift(
                        crypto.createHash('shake128')
                        .update(`${shiftedHashParts[1]}${shiftedHashParts[3]}`)
                        .digest('hex')
                    ).toString()
                ).digest('hex');

                return cryptography.shift.doShift(
                    cryptography.shift.doShift(
                        shiftedCombinedHashes
                    )
                );
            } // baseHashLength 64, outputHashLength 64
        static fish256(data, inputEncoding = "utf8") {
                let baseHash = crypto.createHash('shake256', { outputLength: 64 })
                    .update(data, inputEncoding)
                    .digest('hex');

                let shiftedHashParts = [
                    cryptography.shift.doShift(baseHash.slice(0, 32)),
                    cryptography.shift.doShift(baseHash.slice(32, 64)),
                    cryptography.shift.doShift(baseHash.slice(64, 96)),
                    cryptography.shift.doShift(baseHash.slice(96, 128))
                ];
                let shiftedCombinedHashes = crypto.createHash('shake256', { outputLength: 64 }).update(
                    cryptography.shift.doShift(
                        crypto.createHash('shake256')
                        .update(`${shiftedHashParts[0]}${shiftedHashParts[2]}`)
                        .digest('hex')
                    ).toString() +
                    cryptography.shift.doShift(
                        crypto.createHash('shake256')
                        .update(`${shiftedHashParts[1]}${shiftedHashParts[3]}`)
                        .digest('hex')
                    ).toString()
                ).digest('hex');

                return cryptography.shift.doShift(
                    cryptography.shift.doShift(
                        shiftedCombinedHashes
                    )
                );
            } // baseHashLength 128, outputHashLength 128
        static fish512(data, inputEncoding = "utf8") {
                let baseHash = crypto.createHash('shake256', { outputLength: 128 })
                    .update(data, inputEncoding)
                    .digest('hex');
                let shiftedHashParts = [
                    cryptography.shift.doShift(baseHash.slice(0, 64)),
                    cryptography.shift.doShift(baseHash.slice(64, 128)),
                    cryptography.shift.doShift(baseHash.slice(128, 192)),
                    cryptography.shift.doShift(baseHash.slice(192, 256))
                ];

                let shiftedCombinedHashes = crypto.createHash('shake256', { outputLength: 128 }).update(
                    cryptography.shift.doShift(
                        crypto.createHash('shake256')
                        .update(`${shiftedHashParts[0]}${shiftedHashParts[2]}`)
                        .digest('hex')
                    ).toString() +
                    cryptography.shift.doShift(
                        crypto.createHash('shake256')
                        .update(`${shiftedHashParts[1]}${shiftedHashParts[3]}`)
                        .digest('hex')
                    ).toString()
                ).digest('hex');

                return cryptography.shift.doShift(
                    cryptography.shift.doShift(
                        shiftedCombinedHashes
                    )
                );
            } // baseHashLength 256, outputHashLength 256
    }
    static getFilePath(filePath) {
        const filename = path.basename(filePath);
        const extension = path.extname(filePath);
        const directoryPath = path.dirname(filePath);
        return {
            filename,
            extension,
            directoryPath
        }
    }
    static getKeyFromPassphrase(passphrase) {
        return crypto.pbkdf2Sync(passphrase, 'salt', 100000, 32, 'sha512');
    }
    static async calculateKey(key, features, createIDFile, file) {
        var id = "";
        // If no features are set, we use default settings, HWID locking
        if (features.length === 0 || features.includes("hwid")) {
            // get hwid
            id += await getHWID({ hash: false })
        }
        if (features.includes("distro") || features.includes("hostname") || features.includes("platform") || features.includes("serial")) {
            var osInfo = await si.osInfo();
        }
        if (features.includes("lip")) {
            id += `${await ip.address()}`
        }
        if (features.includes("username")) {
            id += `${os.userInfo().username}`
        }
        if (features.includes("timezone")) {
            id += `${Intl.DateTimeFormat().resolvedOptions().timeZone}`
        }
        if (features.includes("locale")) {
            id += `${Intl.DateTimeFormat().resolvedOptions().locale}`
        }
        if (features.includes("distro")) {
            id += `${osInfo.distro}`;
        }
        if (features.includes("hostname")) {
            id += `${osInfo.hostname}`;
        }
        if (features.includes("platform")) {
            id += `${osInfo.platform}`;
        }
        if (features.includes("serial")) {
            id += `${osInfo.serial}`;
        }
        if (features.includes("filename")) {
            id += `${file}`
        }

        // Remove the spaces from the ID string
        id = id.replace(/ /g, "")
        console.vlog(id)

        // Turn our ID into a SHA256 hash
        id = `${CryptoJS.SHA256(id)}`
        console.vlog(id)

        // ID needs to be a SHA256 hashed string, 64 chars
        console.vlog("hwid 0 " + id)
        var idObject = cryptography.handle.identifierHash(`${id}`)
        console.vlog("hwid 1", `${idObject[0]}${idObject[1]}`)
        idObject = cryptography.handle.identifierHash(`${idObject[0]}${idObject[1]}`)
        console.vlog("hwid 2", `${idObject[0]}${idObject[1]}`)
        var halfId = idObject[0]
        var halfId2 = idObject[1]
        if (createIDFile) {
            let expiresTimestamp = cryptography.object.addExpire(1, "hours")
            let filePath = cryptography.getFilePath(file)
            idObjectFile = {
                "name": "ID for file encrypted with SharkKey",
                "id": {
                    0: halfId,
                    1: halfId2
                },
                "associatedFiles": [
                    { filename: filePath.filename, md5: cryptography.hash.fish64(fs.readFileSync(file, "utf8")) }
                ],
                "expires": `${expiresTimestamp}`
            }
        }
        // Work with the MD6 hash of the user's chosen key
        // TODO: change var names to reflect the change to MD6 from MD5
        let md6key = cryptography.hash.getMD6(key, 128)
        console.vlog("md6 0", md6key)
        md6key = cryptography.handle.md6(md6key)
        console.vlog("md6 1", md6key)
        md6key = cryptography.hash.getMD6(md6key, 128)
        console.vlog("md6 2", md6key)
        md6key = cryptography.handle.md6(md6key)
        console.vlog("md6 3", md6key)

        console.vlog({
            halfId,
            md6key,
            halfId2
        })

        // Combine everything and shift by the value of the first integer found in the combined string
        let combined = `${halfId}${md6key}${halfId2}`
        console.vlog(combined)
        let final = cryptography.shift.doShift(combined)
        return final
    }
    static shift = class {
        static doShiftReverse(str) {
            let shiftTimes = str.match(/\d/)[0];
            let shiftAmount = str.length - (shiftTimes % str.length);
            let shifted = str.slice(shiftAmount) + str.slice(0, shiftAmount);
            return shifted;
        }
        static doShift(str) {
            // Get first integer in string
            let shiftTimes = str.match(/\d/)[0];
            // Calculate the effective shift amount within the string length
            let shiftAmount = shiftTimes % str.length;
            // Perform the shift by slicing the string and concatenating the parts
            let shifted = str.slice(-shiftAmount) + str.slice(0, -shiftAmount);
            return shifted;
        }
    }
    static handle = class {
        static md6(md5key) {
            console.vlog("-md6", md5key)

            // Reverse md5
            md5key = md5key.split("").reverse().join("")

            // Shift it by its own first int
            md5key = cryptography.shift.doShift(md5key)

            // Reverse md5
            md5key = md5key.split("").reverse().join("")

            // split by every other - into two arrays (xx, yy)
            let zz = md5key.split('') // Array of every char
            let xx = zz.filter((element, index) => {
                return index % 2 === 0;
            })
            let yy = zz.filter((element, index) => {
                return index % 2 !== 0;
            });

            // Convert the two "halves" of the md5 hash back into strings
            let md5h1 = xx.join('').toString()
            let md5h2 = yy.join('').toString()

            // split md5h1 into two strings, and then shift them individually,
            // lastly converting them back into a string called md5h1final
            let md5h1final = `${cryptography.shift.doShift(md5h1.slice(0, md5h1.length / 2))}${cryptography.shift.doShift(md5h1.slice(md5h1.length / 2, md5h1.length))}`

            // split md5h2 into two strings, and then shift them individually,
            // lastly converting them back into a string called md5h2final
            let md5h2final = `${cryptography.shift.doShift(md5h2.slice(0, md5h2.length / 2))}${cryptography.shift.doShift(md5h2.slice(md5h2.length / 2, md5h2.length))}`

            // combine the 2 halves, and then shift, set md5key to the output
            md5key = cryptography.shift.doShift(`${md5h1final}${md5h2final}`)
            return md5key
        }
        static identifierHash(id) {
            // Goofy splitting of the id hash
            // every char goes into a different string (x, y)
            let arr = id.split('')
            let x = arr.filter((element, index) => {
                return index % 2 === 0;
            })
            let y = arr.filter((element, index) => {
                return index % 2 !== 0;
            });

            let halfId = cryptography.shift.doShift(x.join(''))
            let halfId2 = cryptography.shift.doShift(y.join(''))

            if (id.length === 64) {
                // The two "halves" of the hwid
                // We are by design throwing away 32 chars here, to make
                // hard to reverse it.
                /** last 16 chars of string */
                halfId = x.join('').slice(16, x.join('').length)

                /** First 16 chars of string */
                halfId2 = y.join('').slice(0, y.join('').length / 2)
            }
            console.vlog({ 0: halfId, 1: halfId2 })
            return { 0: halfId, 1: halfId2 }
        }
    }
    static hex = class {
        static obfuscateHexString = (hexString) => {
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
            let obfuscatedString = '';
            for (let i = 0; i < hexString.length; i++) {
                const hexDigit = hexString[i];
                if (hexMapping.hasOwnProperty(hexDigit)) {
                    obfuscatedString += hexMapping[hexDigit];
                } else {
                    obfuscatedString += hexDigit;
                }
            }
            return obfuscatedString;
        };

        static unobfuscateHexString = (obfuscatedHex) => {
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
            let deobfuscatedString = '';
            for (let i = 0; i < obfuscatedHex.length; i++) {
                const hexDigit = obfuscatedHex[i];
                if (hexMapping.hasOwnProperty(hexDigit)) {
                    deobfuscatedString += hexMapping[hexDigit];
                } else {
                    deobfuscatedString += hexDigit;
                }
            }
            return deobfuscatedString;
        };
    }
    static object = class {
            static encryptObject(obj, passphrase) {
                const jsonString = JSON.stringify(obj);
                const parsedKey = cryptography.getKeyFromPassphrase(passphrase);
                let encryptedString = CryptoJS.AES.encrypt(jsonString, parsedKey, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                // Convert the encrypted string to hex before obfuscation
                encryptedString = CryptoJS.enc.Hex.stringify(encryptedString.ciphertext);
                encryptedString = cryptography.hex.obfuscateHexString(encryptedString);
                return encryptedString;
            }
            static decryptObject(passphrase, id) {
                const parsedKey = cryptography.getKeyFromPassphrase(passphrase);
                let encryptedString = id;
                encryptedString = cryptography.hex.unobfuscateHexString(encryptedString);
                // Convert the deobfuscated hex string back to base64
                encryptedString = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encryptedString));
                const bytes = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
                const IDObject = JSON.parse(decryptedString);
                return IDObject;
            }
            static addExpire(duration, unit) {
                const expirationDate = new Date();

                if (unit === 'hours') {
                    expirationDate.setHours(expirationDate.getHours() + duration);
                } else if (unit === 'days') {
                    expirationDate.setDate(expirationDate.getDate() + duration);
                } else if (unit === 'years') {
                    expirationDate.setFullYear(expirationDate.getFullYear() + duration);
                }

                return expirationDate;
            }
            static hasExpired(jsonObject) {
                if (jsonObject.expires instanceof Date) {
                    const currentTime = new Date();
                    return currentTime > jsonObject.expires;
                }
                return false;
            }
            static readFileObject(rawData) {
                const obfuscatedHex = rawData.toString('utf8');

                const unobfuscatedHex = cryptography.hex.unobfuscateHexString(obfuscatedHex);

                const decodedString = unobfuscatedHex.hexDecode()

                const parsedObject = JSON.parse(decodedString);
                return parsedObject;
            }

            static writeFileObject(rawEncrypted, features = [], file, useTOTP, key) {
                var showFile = "Hidden"
                if (features.includes("filename")) { showFile = file }
                var jsonData = {
                    "raw": `${rawEncrypted}`,
                    "file": showFile,
                    "features": features,
                    "TOTP": false
                }
                if (useTOTP) {
                    jsonData.TOTP = true
                        // Hash the pw using fish128
                    let hashedKey = cryptography.hash.fish128(key, "utf8")
                        // base32 encode
                    let b32key = base32.encode(hashedKey).toString().replace(/=/g, "")
                        // create otp
                    let otp = new cryptography.totp(b32key)
                    let gaUrl = otp.gaURL(decodeURIComponent(path.basename(file).replace(/\./g, "_")), encodeURIComponent(os.userInfo().username + "@🦈🔑"))
                    console.log("✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨")
                    qrcode.generate(gaUrl, { small: true });
                    console.log("Scan above QR code with Google Authenticator, or go to the url manually, or use the key in your auth app of choice.")
                    console.log("URL:", gaUrl)
                    console.log("Key:", b32key)
                }

                let hexString = JSON.stringify(jsonData, null, 4).hexEncode()
                return cryptography.hex.obfuscateHexString(hexString)
            }
        }
        /**
         * Encrypts text by given key
         * @param String text to encrypt
         * @param Buffer masterkey
         * @returns String encrypted text, base64 encoded
         */
    static aese(text, key, iv) {
            try {
                console.log(text, key)
                console.log(iv)
                    // derive key: 32 byte key length - in assumption the masterkey is a cryptographic and NOT a password there is no need for
                    // a large number of iterations. It may can replaced by HKDF
                    // AES 256 GCM Mode
                var cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

                // encrypt the given text
                var encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
                // extract the auth tag
                var tag = cipher.getAuthTag() // 16c
                    // generate output
                return Buffer.concat([Buffer.from(iv, "hex"), tag, encrypted]).toString("base64")

            } catch (e) {
                console.log(e)
            }

            // error
            return null;
        }
        /**
         * Decrypts text by given key
         * @param String base64 encoded input data
         * @param Buffer masterkey
         * @returns String decrypted (original) text
         */
    static aesd(data, key, iv) {
            console.log("owo", data, key, iv)
            try {
                // base64 decoding
                var bData = new Buffer.from(data, 'base64');
                // random initialization vector
                var tag = bData.slice(iv.length, iv.length + 16);
                var text = bData.slice(iv.length + 16);
                console.log(bData.toString(), tag.toString(), text.toString())
                    // AES 256 GCM Mode
                var decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
                decipher.setAuthTag(tag);

                // encrypt the given text
                var decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');

                return Buffer.from(decrypted).toString("utf8");

            } catch (e) {}

            // error
            return null;
        }
        /**
         * Encrypts file
         * @param {string} key 
         * @param {string} file 
         * @param {boolean} deleteOriginal 
         * @param {string[]} [features=[]] 
         */
    static async encrypt(key, file, deleteOriginal = false, features = [], createIDFile = false, isString = false, doCopy = false) {
        // Basic error checking in encrypt flow
        try {
            var fileData;
            if (isString) {
                fileData = Buffer.from(file, "utf8").toString("utf8")
            } else {
                fileData = fs.readFileSync(file, "utf8")
            }
            let buff = crypto.createCipheriv('aes-256-cbc', cryptography.hash.fish64(key, "utf8", false), cryptography.hash.fish64(key, "utf8", true))
            var rawEncrypted = Buffer.from(
                    buff.update(fileData, 'utf8', 'hex') + buff.final('hex')
                ).toString('base64') // Encrypts data and converts to hex and base64
            var encrypted = cryptography.object.writeFileObject(rawEncrypted, features, file)
            encrypted = btoa(encrypted)
        } catch (err) {
            // how 
            console.log("Error encrypting file.")
            console.error(err)
            process.exit(0)
        }
        try {
            if (isString) {
                // We are encrypting a string
                if (doCopy) {
                    clipboard.writeSync(encrypted)
                }
                return encrypted
            } else {
                // We are encrypting a file
                /**
                 * Basic check to see if the file we are going to
                 * be writing to exists already, if true then we
                 * ask if we should overwrite it
                 */
                if (fs.existsSync(file + '.🦈🔑')) {
                    const overwriteFile = await yesno({
                        question: `The file ${file + '.🦈🔑'} already exists, do you want to overwrite it?\ny/n:`,
                        defaultValue: false
                    });
                    switch (overwriteFile) {
                        case true:
                            fs.writeFileSync(file + '.🦈🔑', `${encrypted}`, "utf8")
                            if (doCopy) {
                                clipboard.writeSync(`${encrypted}`)
                            }
                            console.vlog("Encrypted and overwritten", file + '.sharkkey')
                            if (createIDFile) {
                                try {
                                    fs.writeFileSync(file + '.🦈🔑🪪', await cryptography.object.encryptObject(idObjectFile, key), "utf8")
                                } catch (err) {
                                    console.log("There was an error writing the ID.")
                                    console.error(err)
                                }
                            }
                            break;

                            /** 
                             * Exit here unless true, as we cant continue.
                             */

                        case false:
                            console.vlog("You chose not to overwrite the file, please rename or move the file yourself, and then try again.")
                            process.exit(0)
                            break;
                        default:
                            throw new Error("You chose not to overwrite the file.");
                    }
                } else {
                    fs.writeFileSync(file + '.🦈🔑', encrypted, "utf8")
                    if (doCopy) {
                        clipboard.writeSync(`${encrypted}`)
                    }
                    console.vlog("Encrypted", file + '.🦈🔑')
                    if (createIDFile) {
                        try {
                            fs.writeFileSync(file + '.🦈🔑🪪', await cryptography.object.encryptObject(idObjectFile, key), "utf8")
                        } catch (err) {
                            console.log("There was an error writing the ID.")
                            console.error(err)
                        }
                    }
                }
            }

        } catch (err) {
            // idek how, like no storage? used by other process?
            console.log("There was an error writing the file, or outputting the string")
            throw new Error(err)
        }
        // if --deleteOriginal CLI flag was found
        // try to delete the original file
        try {
            if (deleteOriginal) {
                console.vlog("Deleting original")
                fs.unlinkSync(file)
            }
        } catch (err) {
            // Something went wrong, idk maybe permissions?
            console.log("Error deleting original file")
            console.error(err)
        }
        return fs.existsSync(file + '.🦈🔑')
    }

    /**
     * Decrypts file
     * @param {string} key 
     * @param {string} file 
     * @param {boolean} deleteOriginal 
     * @param {boolean} [isString=false] 
     * @param {boolean} [doCopy=false] 
     */
    static async decrypt(key, file, deleteOriginal = false, isString = false, doCopy = false) {
        // Basic error checking in decrypt flow

        // Try to decrypt, if this fails its either because:
        // User forgot their key
        // The HWID dosnt match up, meaning this is not the old machine
        // Could also be caused by HWID changing randomly.
        try {
            var rawFileData;
            if (isString) {
                rawFileData = atob(Buffer.from(file, "utf8").toString("utf8"))
            } else {
                rawFileData = atob(fs.readFileSync(file, "utf8"))
            }
            let jsonData = cryptography.object.readFileObject(rawFileData)
            console.log(jsonData)
            var hashKey = await cryptography.calculateKey(key, jsonData.features, false)
            const buff = Buffer.from(jsonData.raw, 'base64')
            const decipher = crypto.createDecipheriv('aes-256-cbc',
                cryptography.hash.fish64(hashKey, "utf8", false),
                cryptography.hash.fish64(hashKey, "utf8", true))

            var final = decipher.update(
                    buff.toString('utf8'),
                    'hex',
                    'utf8') +
                decipher.final('utf8');

            if (jsonData.TOTP) {
                // base32 encode
                let b32key = base32.encode(hashKey).toString().replace(/=/g, "")
                    // create otp
                let otp = new cryptography.totp(b32key)
                let userotp;
                const rl = readline.createInterface({ input, output });

                const answer = await rl.question('Enter the code found in your authenticator app ');
                userotp = `${answer}`
                rl.close();

                if (`${otp.genOTP()}` === `${userotp}`) {
                    console.log("Authenticated!")
                } else {
                    throw new Error("Incorrect TOTP")
                }
            }
            var originalText = final
            if (isString) {
                if (doCopy) {
                    clipboard.writeSync(originalText)
                }
                return originalText
            }
        } catch (err) {
            console.log("Error decrypting file. Have you entered the correct key?")
            console.error(err)
            throw new Error(err)

        }
        /**
         * Basic check to see if the file we are going to
         * be writing to exists already, if true then we
         * ask if we should overwrite it
         */
        try {
            if (fs.existsSync(file.replace(".🦈🔑", ""))) {
                const overwriteFile = await yesno({
                    question: `The file ${file.replace(".🦈🔑", "")} already exists, do you want to overwrite it?\ny/n:`,
                    defaultValue: false
                });
                switch (overwriteFile) {
                    case true:
                        fs.writeFileSync(file.replace('.🦈🔑', ''), originalText)
                        console.vlog("Decrypted and overwritten.", file)
                        break;

                        /** 
                         * Exit here unless true, as we cant continue.
                         */
                    default:
                        console.vlog("You chose not to overwrite the file, please rename or move the file yourself, and then try again.")
                        process.exit(0)
                        break;
                }
            } else {
                fs.writeFileSync(file.replace('.🦈🔑', ''), originalText)
            }
        } catch (err) {
            // how? file in use?
            console.log("Error writing file...")
            throw new Error(err)
        }
        try {
            // if --deleteOriginal CLI flag was found
            // try to delete the original file
            if (deleteOriginal) {
                console.vlog("Deleting original")
                fs.unlinkSync(file)
            }
        } catch (err) {
            // something went wrong, most likely permissions, or file already being used (somehow)
            console.log("Error deleting original file")
        }
        return fs.existsSync(file.replace('.🦈🔑', ''))
    }
    static totp = TOTP
    static checkid(file, key, doCopy = false) {
        if (fs.existsSync(file)) {
            let fileData = fs.readFileSync(file, 'utf8')
            let id = cryptography.object.decryptObject(key, fileData)
            if (doCopy) {
                clipboard.writeSync(JSON.stringify(id, null, 2))
            }
            return id
        }
    }
}
export default cryptography