import shark from './🦈.js'
import { Command } from 'commander'
console.vlog = shark.vlog

const program = new Command()
    .name("sharkkey")
    .description(shark.art())
    .option("-v, --verbose", "Output verbose logs")
    .showHelpAfterError(true)
program
    .command("encrypt")
    .name("encrypt")
    .description("Encrypt files, folders, or strings.")
    .argument('<file>', 'File to encrypt')
    .argument('<pass>', "Password")
    .option('-cid, --createID',
        "Create a ID file along with the encrypted file.")
    .option('-do, --deleteOriginal',
        "Delete original file after encryption")
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
    .action(async(file, pass, options) => { // Still needs to add logic
        let features = []
        Object.keys(options).forEach(opt => {
            if (opt !== "deleteOriginal" && opt !== "createID") {
                features.push(opt)
            }
        })
        const hashKey = await shark.cryptography.calculateKey(
            pass,
            features,
            options.createID ||
            !typeof options.createID === "undefined",
            file)
        try {
            let infoStr = `✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
            Filename: ${file}
            Key: ${hashKey}
            Features: ${features}
            Deleted Original: ${options.deleteOriginal || !typeof options.deleteOriginal === "undefined"}
            Created ID: ${options.createID || !typeof options.createID === "undefined"}
            
            Remember never to share the Key with anyone,
            as they would be able to decrypt your file with it.
            
            You can decrypt the file using 🦈🔑, your password,
            and if you made one, the file's 🦈🔑🪪
            ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`
            shark.cryptography.encrypt(hashKey,
                file,
                options.deleteOriginal || !typeof options.deleteOriginal === "undefined",
                features,
                options.createID || !typeof options.createID === "undefined",
                `${file}.🦈🔑🪪`).then(() => {
                console.log(infoStr.replace(new RegExp(/            /g), ""))
            })
        } catch (error) {
            console.log("Something happened while trying to encrypt!")
            throw new Error(error)
        }

    });
program
    .command("decrypt")
    .description("Decrypt files, folders, or strings")
    .argument('<file>', 'File to decrypt')
    .argument('<pass>', "Password")
    .argument('[id-file]',
        "(optional) 🦈🔑 ID file path")
    .option('-uid, --useID',
        "Use a 🦈🔑 ID File to decrypt the file, along with the pass.")
    .option('-do, --deleteOriginal',
        "Delete original file after encryption")
    .action((file, pass, idfile, options) => {
        if (!options.useID ||
            typeof options.useID === "undefined") {
            // Dont use ID to decrypt file
            shark.cryptography.decrypt(
                pass,
                file,
                options.deleteOriginal || !typeof options.deleteOriginal === "undefined"
            )
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
    .action((file, password) => {
        console.log(file, password)
    });
program.parse(process.argv);