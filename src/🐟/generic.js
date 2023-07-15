import process from 'process'
import path from 'path'
import fs from 'fs'
/** super boring generic io stuff */
class generic {
    /**
     * Function to output the hardcoded ascii art by arrays because im lazy
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
            @*********@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`.split("\n")
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
            @@@@@@@@@@@@@@@******@@@@@@@@@@@@@@@@@@@`.split("\n")
        let out = ""
        sharkarray.forEach((line, index) => {
            out += `${line + keyarray[index]}`.replace(new RegExp(/    /g), "") + "\n"
        })
        return out
    }
    static showHelp() {
        console.log('Usage: sharkkey <mode> <key> <file> [--verbose] [--deleteOriginal]');
        console.log('Options:');
        console.log('  mode:     "encrypt", "decrypt", or "check"');
        console.log('  key:      A string without spaces or special characters');
        console.log('  file:     A file name or a path to a file');
        console.log('  --verbose Enables verbose mode');
        console.log('  --deleteOriginal Deletes the original file after processing');
        process.exit(0);
    }
    static checkCommandLineFlags() {
        const args = process.argv.slice(2); // Remove 'node' and script name from arguments

        // Display help/info screen if no arguments present
        if (args.length === 0) {}

        const mode = args[0];
        const key = args[1];
        const file = args[2];
        let idFile;
        let verbose = false;
        let deleteOriginal = false;
        let createIDFile = false;
        let useID = false

        // Check mode
        if (mode !== 'encrypt' && mode !== 'decrypt' && mode !== 'checkid') {
            console.log(`Invalid mode: '${mode}'. Mode must be 'encrypt' or 'decrypt'.`);
            generic.showHelp()
            process.exit(1);
        }

        // Check key
        const keyRegex = /^[a-zA-Z0-9]+$/;
        if (!keyRegex.test(key)) {
            console.log('Invalid key: Key should be a string without spaces or special characters.');
            generic.showHelp()
            process.exit(1);
        }

        // Check file existence
        const filePath = file.includes('/') ? file : `${process.cwd()}/${file}`;
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: '${file}'.`);
            generic.showHelp()
            process.exit(1);
        }

        // Check verbose flag
        if (args.includes('--verbose')) {
            verbose = true;
        }

        // Check deleteOriginal flag
        if (args.includes('--deleteOriginal')) {
            deleteOriginal = true;
        }

        // Check createIDFile flag
        if (args.includes('--createIDFile')) {
            createIDFile = true;
        }

        // Check useID flag
        if (args.includes('--useID')) {
            useID = true;
            idFile = args[3]

            // Check idFile existence
            const idFilePath = idFile.includes('/') ? idFile : `${process.cwd()}/${idFile}`;
            if (!fs.existsSync(idFilePath)) {
                console.log(`idFile not found: '${idFile}'.`);
                generic.showHelp()
                process.exit(1);
            }
        }

        return { mode, key, file, verbose, deleteOriginal, createIDFile, useID, idFile };
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
        /**
         * if(verbose) console.log(message);
         * if(!verbose) ();
         * @param {string} message Message
         */
    static vlog(message) {
        // Check verbose flag
        if (process.argv.slice(2).includes('--verbose')) {
            console.log(message)
        } // Only log if the --verbose flag has been found
    }
}
export default generic