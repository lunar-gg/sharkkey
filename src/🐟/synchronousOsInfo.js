import os from 'os'
import { execSync } from 'child_process'
import process from 'process'
/* 
Code in this file was blatantly stolen from https://github.com/sebhildebrandt/systeminformation
as i needed a quick and dirty synchronous way to get OS information.

Go sponser them!
https://ko-fi.com/sebhildebrandt
https://www.buymeacoffee.com/systeminfo

License:
The MIT License (MIT)

Copyright (c) 2014-2023 Sebastian Hildebrandt

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
let _platform = process.platform;
class Util {
    static getValue(lines, property, separator, trimmed, lineMatch) {
        separator = separator || ':';
        property = property.toLowerCase();
        trimmed = trimmed || false;
        lineMatch = lineMatch || false;
        let result = '';
        lines.some((line) => {
            let lineLower = line.toLowerCase().replace(/\t/g, '');
            if (trimmed) {
                lineLower = lineLower.trim();
            }
            if (lineLower.startsWith(property) && (lineMatch ? (lineLower.match(property + separator)) || (lineLower.match(property + ' ' + separator)) : true)) {
                const parts = trimmed ? line.trim().split(separator) : line.split(separator);
                if (parts.length >= 2) {
                    parts.shift();
                    result = parts.join(separator).trim();
                    return true;
                }
            }
        });
        return result;
    }

}

const _linux = (_platform === 'linux' || _platform === 'android');
const _darwin = (_platform === 'darwin');
const _windows = (_platform === 'win32');

function osInfo() {
    let result = {
        platform: (_platform === 'win32' ? 'Windows' : _platform),
        distro: 'unknown',
        release: 'unknown',
        codename: '',
        kernel: os.release(),
        arch: os.arch(),
        hostname: os.hostname(),
        serial: '',
        build: '',
        servicepack: '',
    };
    switch (true) {
        case _linux:
            return handleLinux(result)
        case _windows:
            return handleWin(result)
        case _darwin:
            return handleDarwin(result)
        default:
            throw new Error("Unsupported OS!")
    }
}

function handleLinux(result) {
    let release = {};
    let lines = execSync('cat /etc/*-release; cat /usr/lib/os-release; cat /etc/openwrt_release').toString().split('\n');
    lines.forEach(function(line) {
        if (line.indexOf('=') !== -1) {
            release[line.split('=')[0].trim().toUpperCase()] = line.split('=')[1].trim();
        }
    });
    let releaseVersion = (release.VERSION || '').replace(/"/g, '');
    if (releaseVersion.indexOf('(') >= 0) {
        releaseVersion = releaseVersion.split('(')[0].trim();
    }
    result.distro = (release.DISTRIB_ID || release.NAME || 'unknown').replace(/"/g, '');
    result.release = (releaseVersion || release.DISTRIB_RELEASE || release.VERSION_ID || 'unknown').replace(/"/g, '');
    result.build = (release.BUILD_ID || '').replace(/"/g, '').trim();
    result.codename = "Linux"
    return result
}

function handleWin(result) {
    let string = execSync('powershell -command "Get-CimInstance Win32_OperatingSystem | select Caption,SerialNumber,BuildNumber,ServicePackMajorVersion,ServicePackMinorVersion | fl"')
    let lines = string.toString().split('\r\n')
    result.distro = Util.getValue(lines, 'Caption', ':').trim();
    result.serial = Util.getValue(lines, 'SerialNumber', ':').trim();
    result.build = Util.getValue(lines, 'BuildNumber', ':').trim();
    result.codename = "Microsoft Windows"
    return result
}

function handleDarwin(result) {
    let lines = execSync('sw_vers; sysctl kern.ostype kern.osrelease kern.osrevision kern.uuid').toString().split('\n');
    result.serial = Util.getValue(lines, 'kern.uuid');
    result.distro = Util.getValue(lines, 'ProductName');
    result.release = (Util.getValue(lines, 'ProductVersion', ':', true, true) + ' ' + Util.getValue(lines, 'ProductVersionExtra', ':', true, true)).trim();
    result.build = Util.getValue(lines, 'BuildVersion');
    result.codename = 'macOS';
    return result
}
export default osInfo