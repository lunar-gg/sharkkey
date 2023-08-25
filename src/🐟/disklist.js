import { execSync } from 'node:child_process';
import os from 'node:os';
// Set up in global scope
let driveLettersArray = [];
let driveArray = [];
/**
 * disklist.listDrives({ returnOnlyRemovable: false }).then(drives => {
    console.dir(drives);
}).catch(err => {
    console.error(err);
});
 */
export default class Disklist {
    /**
     * Get drives sync
     * @param {Object} options - Options object
     * @param {boolean} options.returnOnlyRemovable - Return only removable devices (eg: USB drives) - Default:false
     * @param {Object} options.filter - Filter object - Default:{}
     * @param {string} options.filter.key - Filter key name, eg: "InterfaceType" or "Partitions" (CaSe SeNsItIvE)
     * @param {(string|number)} options.filter.value - Filter value (filter.key === filter.value) eg: "USB", 2
     * @param {number} options.filter.limit - Limit the number of items in the returned array.
     * @returns {(Object|Array<Object>)} Returns either am array of objects of the drive, or a single drive object
     */
    static listDrivesSync(options = { returnOnlyRemovable: false, filter: {} }) {
        Helpers.populateArrays();
        // Return only removable devices if param is set to it
        if (options.returnOnlyRemovable) {
            driveArray = driveArray.filter((drive) => drive.MediaType === "Removable Media");
        }

        try {
            Helpers.filter(options);
        } catch (err) {
            throw new Error(err);
        }

        /** Final checks and returns */

        // If driveArray is empty, throw error
        if (driveArray.length == 0) {
            throw new Error("No drives found");
        }
        // If only one drive in array, return the object instead of an array with only one item
        if (driveArray.length == 1) {
            return driveArray[0];
        }
        // If not caught by above checks, return the driveArray
        return driveArray;
    }

    /**
     * Get drives
     * @param {Object} options - Options object
     * @param {boolean} options.returnOnlyRemovable - Return only removable devices (eg: USB drives) - Default:false
     * @param {Object} options.filter - Filter object - Default:{}
     * @param {string} options.filter.key - Filter key name, eg: "InterfaceType" or "Partitions" (CaSe SeNsItIvE)
     * @param {(string|number)} options.filter.value - Filter value (filter.key === filter.value) eg: "USB", 2
     * @param {number} options.filter.limit - Limit the number of items in the returned array.
     * @returns {(Object|Array<Object>)} Returns either am array of objects of the drive, or a single drive object
     */
    static async listDrives(options = { returnOnlyRemovable: false, filter: {} }) {
        return new Promise((resolve, reject) => {
            Helpers.populateArrays();
            // Return only removable devices if param is set to it
            if (options.returnOnlyRemovable) {
                driveArray = driveArray.filter((drive) => drive.MediaType === "Removable Media");
            }

            try {
                Helpers.filter(options);
            } catch (err) {
                reject(err);
            }

            /** Final checks and returns */

            // If driveArray is empty, throw error
            if (driveArray.length == 0) {
                throw new Error("No drives found");
            }
            // If only one drive in array, return the object instead of an array with only one item
            if (driveArray.length == 1) {
                resolve(driveArray[0]);
            }
            // If not caught by above checks, return the driveArray
            resolve(driveArray);
        });
    }
}
class Helpers {
    static getDriveLetter(index) {
        driveLettersArray.forEach(dl => { // If no drive name, set the name to Unnamed Drive
            if (dl.Label === null) dl.Label = "Unnamed Disk";
        });
        return driveLettersArray[index];
    }
    static getDriveDescription(deviceName) {
        try {
            const udevadmOutput = execSync(`udevadm info --query=property --name=${deviceName}`).toString();
            const modelMatch = udevadmOutput.match(/ID_MODEL=(.*)/);
            if (modelMatch) {
                return modelMatch[1];
            }
        } catch (error) {
            console.error('Error getting drive description:', error);
        }

        return 'Unnamed Disk';
    }
    static populateArrays() {
        // Declare function scoped vars
        let drives = [];
        switch (os.platform()) {
            case "win32":
                // Get the drive letters / root paths + device name
                driveLettersArray = JSON.parse(execSync('Get-CimInstance Win32_Volume | Where-Object { $_.DriveType -eq 2 -or $_.DriveType -eq 3 } | ForEach-Object { if ($_.DriveLetter) { [PSCustomObject]@{ DriveLetter = $_.DriveLetter; IsReadOnly = [bool]($_.Attributes -band 1); BootVolume = $_.BootVolume; Label = $_.Label } } } | ConvertTo-json', { 'shell': 'powershell.exe' }));
                // Get drives, along with some info about them.
                drives = JSON.parse(execSync('gwmi win32_diskdrive | select Model, CapabilityDescriptions, Index, PNPDeviceID, MediaType, SerialNumber, Size, Name, InterfaceType, BytesPerSector, Partitions, Status, SectorsPerTrack, TotalCylinders, TotalHeads, TotalSectors, TotalTracks, TracksPerCylinder, CompressionMethod, FirmwareRevision, Manufacturer | ConvertTo-json', { 'shell': 'powershell.exe' }));
                // Enumerate the array of drives, and add the keys from getDriveLetter() to the drive objectuyhgvbkhjhj
                drives.forEach(drive => {
                    let dl = Helpers.getDriveLetter(drive.Index);
                    driveArray.push({
                        device: drive.Name,
                        displayName: dl.DriveLetter,
                        description: drive.Model,
                        size: drive.Size,
                        mountpoints: [{
                            path: drive.DriveLetter + '/'
                        }],
                        raw: drive.Name,
                        protected: dl.IsReadOnly,
                        system: dl.BootVolume,
                        label: dl.Label,
                        removable: drive.MediaType === 'Removable Media'
                    });
                });
                break;
            case "darwin":
                throw new Error("MacOS Support planned later");
            case "linux":
                drives = JSON.parse(execSync('lsblk -J -b -s -o NAME,SIZE,RO,TYPE,MOUNTPOINT,LABEL,RM').toString());

                for (const item of drives.blockdevices) {
                    if (item.type === 'disk') {
                        const driveLetter = `/dev/${item.name}`;
                        const displayName = driveLetter;
                        const description = Helpers.getDriveDescription(item.name);
                        const isReadOnly = item.ro === '1';
                        const isSystem = false; // For Linux, we can't directly identify the boot drive like in Windows.
                        const removable = item.rm;
                        let mountpoints = [];
                        if (item.mountpoint) {
                            mountpoints.push({ path: item.mountpoint });
                        }

                        const raw = driveLetter;
                        const label = item.label ? item.label.trim() : 'Unnamed Disk';

                        const driveObject = {
                            device: raw,
                            displayName,
                            description,
                            size: item.size,
                            mountpoints,
                            raw,
                            protected: isReadOnly,
                            system: isSystem,
                            label,
                            removable: removable,
                        };

                        driveArray.push(driveObject);
                    }
                }
                break;
            default:
                throw new Error("Your OS is not supported by disklist");
        }
    }
    static filter(options) {
        // Check if options.filter is defined and not empty
        if (options.filter && Object.keys(options.filter).length !== 0) {
            // Destructure the filter properties
            const { key, value, limit } = options.filter;

            // Check for valid key and value types
            if (typeof key === "string" && (typeof value === "string" || typeof value === "number")) {
                // Check if the specified key type is valid in driveArray
                if (typeof driveArray[0][key] === "string" || typeof driveArray[0][key] === "number") {
                    // Apply the filter based on the key-value pair
                    driveArray = driveArray.filter((drive) => drive[key] === value);
                } else {
                    // Throw an error for an invalid key type
                    throw new Error("Invalid key type in driveArray.");
                }
            } else if (limit && typeof limit === "number") {
                // Check if key or value are provided with an invalid limit type
                if (key || value) {
                    throw new Error("Filter key and/or value have incorrect types");
                } else {
                    // Slice the driveArray to match the specified limit
                    driveArray = driveArray.slice(0, options.filter.limit);
                }
            } else {
                // Throw an error for missing key or value
                throw new Error("The options.filter object is missing either the 'key' or 'value' key.");
            }
        }
    }
}