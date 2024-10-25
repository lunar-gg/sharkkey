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
            return { info: "No drives found." };
        }

        /* Removed for now
        // If only one drive in array, return the object instead of an array with only one item
        if (driveArray.length == 1) {
            return driveArray[0];
        }
         */

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
                return { info: "No drives found." };
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
    static parsePlistOutput(plistStr) {
        // Convert the plist XML to JSON format using plutil
        const jsonStr = execSync(`echo '${plistStr.replace(/'/g, '\'\\\'\'')}' | plutil -convert json -o - -`, { shell: '/bin/bash' }).toString();
        return JSON.parse(jsonStr);
    }

    static getMacOSDriveInfo(diskName) {
        try {
            const infoStr = execSync(`diskutil info -plist ${diskName}`).toString();
            return Helpers.parsePlistOutput(infoStr);
        } catch (error) {
            console.error(`Error getting info for disk ${diskName}:`, error);
            return null;
        }
    }

    static getDriveLetter(index) {
        if (driveLettersArray.length > 0) {
            driveLettersArray.forEach(dl => { // If no drive name, set the name to Unnamed Drive
                if (dl.Label === null) dl.Label = "Unnamed Disk";
            });
            return driveLettersArray[index];
        }
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
        driveArray = DrivePopulator.populateArrays();
    }

    static filter(options) {
        if (!options.filter || Object.keys(options.filter).length === 0) {
            return; // No filtering needed, exit early
        }

        const { key, value, limit } = options.filter;

        if (typeof limit === "number") {
            if (!key && !value) {
                driveArray = driveArray.slice(0, limit);
            } else {
                throw new Error("Filter key and/or value have incorrect types");
            }
        } else if (typeof key === "string" && (typeof value === "string" || typeof value === "number")) {
            if (typeof driveArray[0][key] === "string" || typeof driveArray[0][key] === "number") {
                driveArray = driveArray.filter((drive) => drive[key] === value);
            } else {
                throw new Error("Invalid key type in driveArray.");
            }
        } else {
            throw new Error("The options.filter object is missing either the 'key' or 'value' key.");
        }
    }

}

/**
 * Class responsible for handling drive population across different operating systems.
 * Supports Windows, macOS, and Linux platforms with platform-specific implementations.
 */
class DrivePopulator {
    /**
     * Main entry point for drive population. Detects the current platform and calls
     * the appropriate population method.
     * @returns {Array<Object>} Array of drive objects containing platform-specific drive information
     * @throws {Error} If the current platform is not supported
     */
    static populateArrays() {
        const platform = os.platform();
        const populator = DrivePopulator.getPopulator(platform);
        return populator();
    }

    /**
     * Returns the appropriate drive population function for the given platform
     * @param {string} platform - The operating system platform (win32, darwin, or linux)
     * @returns {Function} Platform-specific drive population function
     * @throws {Error} If the platform is not supported
     */
    static getPopulator(platform) {
        const populators = {
            win32: DrivePopulator.populateWindowsDrives,
            darwin: DrivePopulator.populateMacOSDrives,
            linux: DrivePopulator.populateLinuxDrives,
        };

        const populator = populators[platform];
        if (!populator) {
            throw new Error("Your OS is not supported by disklist");
        }

        return populator;
    }

    /**
     * Windows-specific drive population implementation
     * @returns {Array<Object>} Array of Windows drive objects
     */
    static populateWindowsDrives() {
        // const driveLetters = DrivePopulator.getWindowsDriveLetters();
        const drives = DrivePopulator.getWindowsDrives();

        return drives.map(drive => {
            const dl = Helpers.getDriveLetter(drive.Index);
            return DrivePopulator.createWindowsDriveObject(drive, dl);
        });
    }

    /**
     * Retrieves Windows drive letters and their properties using PowerShell
     * @returns {Array<Object>} Array of drive letter information objects
     */
    static getWindowsDriveLetters() {
        const command = 'Get-CimInstance Win32_Volume | Where-Object { $_.DriveType -eq 2 -or $_.DriveType -eq 3 } | ' +
            'ForEach-Object { if ($_.DriveLetter) { [PSCustomObject]@{ ' +
            'DriveLetter = $_.DriveLetter; IsReadOnly = [bool]($_.Attributes -band 1); ' +
            'BootVolume = $_.BootVolume; Label = $_.Label } } } | ConvertTo-json';
        return JSON.parse(execSync(command, { 'shell': 'powershell.exe' }));
    }

    /**
     * Retrieves detailed Windows drive information using PowerShell
     * @returns {Array<Object>} Array of detailed drive information objects
     */
    static getWindowsDrives() {
        const command = 'gwmi win32_diskdrive | select Model, CapabilityDescriptions, Index, PNPDeviceID, ' +
            'MediaType, SerialNumber, Size, Name, InterfaceType, BytesPerSector, Partitions, Status, ' +
            'SectorsPerTrack, TotalCylinders, TotalHeads, TotalSectors, TotalTracks, TracksPerCylinder, ' +
            'CompressionMethod, FirmwareRevision, Manufacturer | ConvertTo-json';
        return JSON.parse(execSync(command, { 'shell': 'powershell.exe' }));
    }

    /**
     * Creates a standardized drive object from Windows-specific drive information
     * @param {Object} drive - Windows drive information
     * @param {Object} dl - Drive letter information
     * @returns {Object} Standardized drive object
     */
    static createWindowsDriveObject(drive, dl) {
        return {
            device: drive.Name,
            displayName: dl.DriveLetter,
            description: drive.Model,
            size: drive.Size,
            mountpoints: [{
                path: dl.DriveLetter + '/'
            }],
            raw: drive.Name,
            protected: dl.IsReadOnly,
            system: dl.BootVolume,
            label: dl.Label,
            removable: drive.MediaType === 'Removable Media'
        };
    }

    /**
     * macOS-specific drive population implementation
     * @returns {Array<Object>} Array of macOS drive objects
     */
    static populateMacOSDrives() {
        const diskList = DrivePopulator.getMacOSDiskList();
        return DrivePopulator.processMacOSDisks(diskList);
    }

    /**
     * Retrieves macOS disk list using diskutil
     * @returns {Object} Parsed plist output containing disk information
     */
    static getMacOSDiskList() {
        const diskListStr = execSync('diskutil list -plist').toString();
        return Helpers.parsePlistOutput(diskListStr);
    }

    /**
     * Processes macOS disk list and filters out disk images
     * @param {Object} diskList - Parsed disk list from diskutil
     * @returns {Array<Object>} Array of processed drive objects
     */
    static processMacOSDisks(diskList) {
        const drives = [];
        for (const disk of diskList.AllDisksAndPartitions) {
            const driveObject = DrivePopulator.createMacOSDriveObject(disk);
            // Filter out mounted disk images (e.g., DMG files)
            if (driveObject && driveObject.busProtocol !== 'Disk Image') {
                drives.push(driveObject);
            }
        }
        return drives;
    }

    /**
     * Creates a standardized drive object from macOS-specific disk information
     * @param {Object} diskName - Disk identifier information
     * @returns {Object|null} Standardized drive object or null if disk info cannot be retrieved
     */
    static createMacOSDriveObject(diskName) {
        const diskInfo = Helpers.getMacOSDriveInfo('/dev/' + diskName.DeviceIdentifier);
        if (!diskInfo) return null;

        return {
            device: diskInfo.DeviceNode,
            displayName: diskInfo.DeviceNode,
            description: diskInfo.DeviceModel || 'Unknown',
            size: diskInfo.Size,
            mountpoints: diskInfo.MountPoint ? [{ path: diskInfo.MountPoint }] : [],
            raw: diskInfo.DeviceNode,
            protected: !diskInfo.WritableMedia,
            system: diskInfo.SystemImage || false,
            label: diskInfo.VolumeName || 'Unnamed Disk',
            removable: diskInfo.RemovableMedia || diskInfo.Ejectable || false,
            // macOS-specific properties
            volumeType: diskInfo.VolumeType,
            fileSystem: diskInfo.FilesystemType,
            busProtocol: diskInfo.BusProtocol,
            smartStatus: diskInfo.SMARTStatus,
            bootable: diskInfo.Bootable || false
        };
    }

    /**
     * Linux-specific drive population implementation
     * @returns {Array<Object>} Array of Linux drive objects
     */
    static populateLinuxDrives() {
        const drives = DrivePopulator.getLinuxDrives();
        return DrivePopulator.processLinuxDrives(drives);
    }

    /**
     * Retrieves Linux drive information using lsblk
     * @returns {Object} Parsed JSON output from lsblk command
     */
    static getLinuxDrives() {
        const command = 'lsblk -J -b -s -o NAME,SIZE,RO,TYPE,MOUNTPOINT,LABEL,RM';
        return JSON.parse(execSync(command).toString());
    }

    /**
     * Processes Linux drive information and filters for disk devices
     * @param {Object} drives - Parsed output from lsblk
     * @returns {Array<Object>} Array of processed drive objects
     */
    static processLinuxDrives(drives) {
        return drives.blockdevices
            .filter(item => item.type === 'disk')
            .map(item => DrivePopulator.createLinuxDriveObject(item));
    }

    /**
     * Creates a standardized drive object from Linux-specific drive information
     * @param {Object} item - Linux block device information
     * @returns {Object} Standardized drive object
     */
    static createLinuxDriveObject(item) {
        const driveLetter = `/dev/${item.name}`;
        return {
            device: driveLetter,
            displayName: driveLetter,
            description: Helpers.getDriveDescription(item.name),
            size: item.size,
            mountpoints: item.mountpoint ? [{ path: item.mountpoint }] : [],
            raw: driveLetter,
            protected: item.ro === '1',
            system: false, // Linux can't directly identify boot drive
            label: item.label ? item.label.trim() : 'Unnamed Disk',
            removable: item.rm
        };
    }
}