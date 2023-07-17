import shark from './🦈.js'
import { Command } from 'commander'
import process from 'node:process';
const program = new Command()
    .name("sharkkey")
    .description(shark.art())
    .option("-v, --verbose", "Output verbose logs")
    .showHelpAfterError(true)
program
    .command("encrypt")
    .name("encrypt")
    .description("Encrypt files, folders, or strings.")
    .argument('<file-or-string>', 'File to encrypt - or string if the -s or --string flag is used.')
    .argument('<pass>', "Password")
    .option('-cid, --createID',
        "Create a ID file along with the encrypted file.")
    .option('-do, --deleteOriginal',
        "Delete original file after encryption")
    .option('-s, --string',
        "Encrypt a string instead of a file")
    .option('-c, --copy',
        "Copy the encrypted file or string to the clipboard after encryption")
    .option('--hwid',
        "Include the hardware ID as part of the encryption process")
    .option('--distro',
        "Include the name of the operating system distribution as part of the encryption process")
    .option('--lip',
        "Include the local IP address as part of the encryption process")
    .option('--username',
        "Include the username associated with the user account as part of the encryption process")
    .option('--timezone',
        "Include the current timezone information as part of the encryption process")
    .option('--locale',
        "Include the locale settings (language and region) as part of the encryption process")
    .option('--hostname',
        "Include the hostname of the system as part of the encryption process")
    .option('--platform',
        "Include the platform information (e.g., operating system type) as part of the encryption process")
    .option('--serial',
        "Include the serial number of the device as part of the encryption process")
    .option('--filename',
        "Include the name of the file being encrypted as part of the encryption process")
    .option('--totp',
        "Require TOTP authentacation before decrypting")
    .action(async(file, pass, options) => {
        let features = []
        for (const opt in options) {
            if (opt !== "deleteOriginal" && opt !== "createID" && opt !== "string") {
                features.push(opt)
            }
        }

        if (features.length == 0) {
            features.push("None, this means anyone with the password can decrypt.")
        }
        const hashKey = await shark.cryptography.calculateKey(
            pass,
            features,
            options.createID ||
            typeof options.createID !== "undefined",
            file)
        try {
            let infoStrFile = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
            Filename: ${file}
            Key: ${hashKey}
            Features: ${features}
            Deleted Original: ${options.deleteOriginal || typeof options.deleteOriginal !== "undefined"}
            Created ID: ${options.createID || typeof options.createID !== "undefined"}
            TOTP: ${options.totp || false}
            Remember never to share the Key with anyone,
            as they would be able to decrypt your file with it.
            
            You can decrypt the file using 🦈🔑, your password,
            and if you made one, the file's 🦈🔑🪪
            ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`
            let infoStr = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
            Encrypted string: __string__
            Key: ${hashKey}
            Features: ${features}

            Remember never to share the Key with anyone,
            as they would be able to decrypt your file with it.
            
            You can decrypt the string using 🦈🔑 & your password
            ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`
            if (options.string || typeof options.string !== "undefined") {
                let encryptedStr = await shark.cryptography.encrypt(hashKey,
                    file,
                    options.deleteOriginal || typeof options.deleteOriginal !== "undefined",
                    features,
                    options.createID || typeof options.createID !== "undefined",
                    options.string || typeof options.string !== "undefined", options.copy || false)
                if (options.copy || false) {
                    console.log(infoStr.replace(new RegExp(/(?!\\n) +/g), "")
                        .replace("__string__", encryptedStr)
                        .replace("Remember", "The encrypted string has been copied to your clipboard.\n\nRemember")
                    )
                } else {
                    console.log(infoStr.replace(new RegExp(/(?!\\n) +/g), "")
                        .replace("__string__", encryptedStr)
                    )
                }

            } else {
                await shark.cryptography.encrypt(hashKey,
                    file,
                    options.deleteOriginal || typeof options.deleteOriginal !== "undefined",
                    features,
                    options.createID || typeof options.createID !== "undefined",
                    false,
                    options.copy || false)
                if (options.copy || false) {
                    console.log(infoStrFile.replace(new RegExp(/ {12}/g), "")
                        .replace("Remember", "The contents of the encrypted file has been copied to your clipboard.\n\nRemember")
                    )
                } else {
                    console.log(infoStrFile.replace(new RegExp(/ {12}/g), ""))
                }

            }
        } catch (error) {
            console.log("Something happened while trying to encrypt!")
            throw new Error(error)
        }

    });
program
    .command("decrypt")
    .description("Decrypt files, folders, or strings")
    .argument('<file-or-string>', 'File to decrypt - or string if the -s or --string flag is used.')
    .argument('<pass>', "Password")
    .argument('[id-file]',
        "(optional) 🦈🔑 ID file path")
    .option('-uid, --useID',
        "Use a 🦈🔑 ID File to decrypt the file, along with the pass.")
    .option('-do, --deleteOriginal',
        "Delete original file after encryption")
    .option('-s, --string',
        "Encrypt a string instead of a file")
    .option('-c, --copy',
        "Copy the decrypted file or string to the clipboard after decryption")
    .action(async(file, pass, idfile, options) => {
        if (!options.useID ||
            typeof options.useID === "undefined") {
            let infoStr = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
                Decrypted string: __string__

                🦈🔑
                ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`
            let infoStrFile = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
                Decrypted file: ${file.replace(".🦈🔑","")}

                🦈🔑
                ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`

            // Dont use ID to decrypt file
            if (options.string || false) {
                var originalText = await shark.cryptography.decrypt(
                    pass,
                    file,
                    options.deleteOriginal || typeof options.deleteOriginal !== "undefined",
                    true,
                    options.copy || false
                )
                if (options.copy || false) {
                    console.log(infoStr
                        .replace(new RegExp(/(?!\\n) +/g), "")
                        .replace("__string__", originalText)
                        .replace("🦈🔑\n✨", "The decrypted string has been copied to your clipboard\n\n🦈🔑\n✨"))
                } else {
                    console.log(infoStr
                        .replace(new RegExp(/(?!\\n) +/g), "")
                        .replace("__string__", originalText)
                    )
                }
            } else {
                await shark.cryptography.decrypt(
                    pass,
                    file,
                    options.deleteOriginal || typeof options.deleteOriginal !== "undefined",
                    options.string || false,
                    options.copy || false
                )
                if (options.copy || false) {
                    console.log(infoStrFile
                        .replace(new RegExp(/ {16}/g), "")
                        .replace("🦈🔑\n✨", "The content of the decrypted file has been copied to your clipboard\n\n🦈🔑\n✨"))
                } else {
                    console.log(infoStrFile
                        .replace(new RegExp(/ {16}/g), "")
                    )
                }
            }

        } else {
            // Use ID to decrypt fiie
            console.log(file, pass, idfile, options.useID)
        }
    });
program
    .command("checkid")
    .description("Get information about a 🦈🔑 ID - If you have the password")
    .argument('<file>', '🦈🔑 ID file')
    .argument('<pass>', "Password")
    .option('-c, --copy',
        "Copy the id info to the clipboard (JSON)")
    .action(async(file, password, options) => {
        let idInfo = await shark.cryptography.checkid(file, password, options.copy || false)
        let infoStr = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
        ID Info
        File: ${file}
        Associated Files: ${JSON.stringify(idInfo.associatedFiles)}
        Expires: ${idInfo.expires}
        id: ${JSON.stringify(idInfo.id)}

        🦈🔑
        ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`
        if (options.copy || false) {
            console.log(infoStr
                .replace(new RegExp(/(?!\\n) +/g), "")
                .replace("🦈🔑\n", "The raw JSON data has been copied to your clipboard.\n\n🦈🔑\n")
            )
        } else {
            console.log(infoStr
                .replace(new RegExp(/(?!\\n) +/g), "")
            )
        }
    });
program.parse(process.argv);