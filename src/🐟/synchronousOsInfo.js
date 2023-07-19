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
class util {
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

    static getCodepage() {
        if (_windows) {
            if (!codepage) {
                try {
                    const stdout = execSync('chcp', execOptsWin);
                    const lines = stdout.toString().split('\r\n');
                    const parts = lines[0].split(':');
                    codepage = parts.length > 1 ? parts[1].replace('.', '').trim() : '';
                } catch (err) {
                    codepage = '437';
                }
            }
            return codepage;
        }
        if (_linux || _darwin || _freebsd || _openbsd || _netbsd) {
            if (!codepage) {
                try {
                    const stdout = execSync('echo $LANG');
                    const lines = stdout.toString().split('\r\n');
                    const parts = lines[0].split('.');
                    codepage = parts.length > 1 ? parts[1].trim() : '';
                    if (!codepage) {
                        codepage = 'UTF-8';
                    }
                } catch (err) {
                    codepage = 'UTF-8';
                }
            }
            return codepage;
        }
    }
}
const execOptsWin = {
    windowsHide: true,
    maxBuffer: 1024 * 20000,
    encoding: 'UTF-8',
    env: Array.from(process.env)
};
let codepage = '';
const _linux = (_platform === 'linux' || _platform === 'android');
const _darwin = (_platform === 'darwin');
const _windows = (_platform === 'win32');
const _freebsd = (_platform === 'freebsd');
const _openbsd = (_platform === 'openbsd');
const _netbsd = (_platform === 'netbsd');

function osInfo() {
    let result = {
        platform: (_platform === 'win32' ? 'Windows' : _platform),
        distro: 'unknown',
        release: 'unknown',
        codename: '',
        kernel: os.release(),
        arch: os.arch(),
        hostname: os.hostname(),
        codepage: '',
        logofile: '',
        serial: '',
        build: '',
        servicepack: '',
        uefi: false
    };

    if (_linux) {
        let release = {};
        let lines = execSync('cat /etc/*-release; cat /usr/lib/os-release; cat /etc/openwrt_release').toString().split('\n');
        lines.forEach(function(line) {
            if (line.indexOf('=') !== -1) {
                release[line.split('=')[0].trim().toUpperCase()] = line.split('=')[1].trim();
            }
        });
        let releaseVersion = (release.VERSION || '').replace(/"/g, '');
        let codename = (release.DISTRIB_CODENAME || release.VERSION_CODENAME || '').replace(/"/g, '');
        if (releaseVersion.indexOf('(') >= 0) {
            codename = releaseVersion.split('(')[1].replace(/[()]/g, '').trim();
            releaseVersion = releaseVersion.split('(')[0].trim();
        }
        result.distro = (release.DISTRIB_ID || release.NAME || 'unknown').replace(/"/g, '');
        result.logofile = getLogoFile(result.distro);
        result.release = (releaseVersion || release.DISTRIB_RELEASE || release.VERSION_ID || 'unknown').replace(/"/g, '');
        result.codename = codename;
        result.codepage = util.getCodepage();
        result.build = (release.BUILD_ID || '').replace(/"/g, '').trim();
    }
    if (_darwin) {
        let lines = execSync('sw_vers; sysctl kern.ostype kern.osrelease kern.osrevision kern.uuid').toString().split('\n');
        result.serial = util.getValue(lines, 'kern.uuid');
        result.distro = util.getValue(lines, 'ProductName');
        result.release = (util.getValue(lines, 'ProductVersion', ':', true, true) + ' ' + util.getValue(lines, 'ProductVersionExtra', ':', true, true)).trim();
        result.build = util.getValue(lines, 'BuildVersion');
        result.logofile = getLogoFile(result.distro);
        result.codename = 'macOS';
        result.codename = (result.release.indexOf('10.4') > -1 ? 'Mac OS X Tiger' : result.codename);
        result.codename = (result.release.indexOf('10.5') > -1 ? 'Mac OS X Leopard' : result.codename);
        result.codename = (result.release.indexOf('10.6') > -1 ? 'Mac OS X Snow Leopard' : result.codename);
        result.codename = (result.release.indexOf('10.7') > -1 ? 'Mac OS X Lion' : result.codename);
        result.codename = (result.release.indexOf('10.8') > -1 ? 'OS X Mountain Lion' : result.codename);
        result.codename = (result.release.indexOf('10.9') > -1 ? 'OS X Mavericks' : result.codename);
        result.codename = (result.release.indexOf('10.10') > -1 ? 'OS X Yosemite' : result.codename);
        result.codename = (result.release.indexOf('10.11') > -1 ? 'OS X El Capitan' : result.codename);
        result.codename = (result.release.indexOf('10.12') > -1 ? 'macOS Sierra' : result.codename);
        result.codename = (result.release.indexOf('10.13') > -1 ? 'macOS High Sierra' : result.codename);
        result.codename = (result.release.indexOf('10.14') > -1 ? 'macOS Mojave' : result.codename);
        result.codename = (result.release.indexOf('10.15') > -1 ? 'macOS Catalina' : result.codename);
        result.codename = (result.release.startsWith('11.') ? 'macOS Big Sur' : result.codename);
        result.codename = (result.release.startsWith('12.') ? 'macOS Monterey' : result.codename);
        result.codename = (result.release.startsWith('13.') ? 'macOS Ventura' : result.codename);
        result.codename = (result.release.startsWith('14.') ? 'macOS Sonoma' : result.codename);
        result.uefi = true;
        result.codepage = util.getCodepage();
    }
    if (_windows) {
        let string = execSync('powershell -command "Get-CimInstance Win32_OperatingSystem | select Caption,SerialNumber,BuildNumber,ServicePackMajorVersion,ServicePackMinorVersion | fl"')
            //string += "\r\n" + execSync('powershell -command "(Get-CimInstance Win32_ComputerSystem).HypervisorPresent"')
            //string += "\r\n" + execSync('powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SystemInformation]::TerminalServerSession"')
        let lines = string.toString().split('\r\n')
        result.distro = util.getValue(lines, 'Caption', ':').trim();
        result.serial = util.getValue(lines, 'SerialNumber', ':').trim();
        result.build = util.getValue(lines, 'BuildNumber', ':').trim();
        result.servicepack = util.getValue(lines, 'ServicePackMajorVersion', ':').trim() + '.' + util.getValue(lines, 'ServicePackMinorVersion', ':').trim();
        result.codepage = util.getCodepage();
        /*
        const hyperv = data.results[1] ? data.results[1].toString().toLowerCase() : '';
        result.hypervisor = hyperv.indexOf('true') !== -1;
        const term = data.results[2] ? data.results[2].toString() : '';
        result.remoteSession = (term.toString().toLowerCase().indexOf('true') >= 0);
        */
    }
    return result
}

function getUniqueMacAdresses() {
    let macs = [];
    try {
        const ifaces = os.networkInterfaces();
        for (let dev in ifaces) {
            if ({}.hasOwnProperty.call(ifaces, dev)) {
                ifaces[dev].forEach(function(details) {
                    if (details && details.mac && details.mac !== '00:00:00:00:00:00') {
                        const mac = details.mac.toLowerCase();
                        if (macs.indexOf(mac) === -1) {
                            macs.push(mac);
                        }
                    }
                });
            }
        }
        macs = macs.sort(function(a, b) {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
        });
    } catch (e) {
        macs.push('00:00:00:00:00:00');
    }
    return macs;
}

function getLogoFile(distro) {
    distro = distro || '';
    distro = distro.toLowerCase();
    let result = _platform;
    if (_windows) {
        result = 'windows';
    } else if (distro.indexOf('mac os') !== -1) {
        result = 'apple';
    } else if (distro.indexOf('arch') !== -1) {
        result = 'arch';
    } else if (distro.indexOf('centos') !== -1) {
        result = 'centos';
    } else if (distro.indexOf('coreos') !== -1) {
        result = 'coreos';
    } else if (distro.indexOf('debian') !== -1) {
        result = 'debian';
    } else if (distro.indexOf('deepin') !== -1) {
        result = 'deepin';
    } else if (distro.indexOf('elementary') !== -1) {
        result = 'elementary';
    } else if (distro.indexOf('fedora') !== -1) {
        result = 'fedora';
    } else if (distro.indexOf('gentoo') !== -1) {
        result = 'gentoo';
    } else if (distro.indexOf('mageia') !== -1) {
        result = 'mageia';
    } else if (distro.indexOf('mandriva') !== -1) {
        result = 'mandriva';
    } else if (distro.indexOf('manjaro') !== -1) {
        result = 'manjaro';
    } else if (distro.indexOf('mint') !== -1) {
        result = 'mint';
    } else if (distro.indexOf('mx') !== -1) {
        result = 'mx';
    } else if (distro.indexOf('openbsd') !== -1) {
        result = 'openbsd';
    } else if (distro.indexOf('freebsd') !== -1) {
        result = 'freebsd';
    } else if (distro.indexOf('opensuse') !== -1) {
        result = 'opensuse';
    } else if (distro.indexOf('pclinuxos') !== -1) {
        result = 'pclinuxos';
    } else if (distro.indexOf('puppy') !== -1) {
        result = 'puppy';
    } else if (distro.indexOf('raspbian') !== -1) {
        result = 'raspbian';
    } else if (distro.indexOf('reactos') !== -1) {
        result = 'reactos';
    } else if (distro.indexOf('redhat') !== -1) {
        result = 'redhat';
    } else if (distro.indexOf('slackware') !== -1) {
        result = 'slackware';
    } else if (distro.indexOf('sugar') !== -1) {
        result = 'sugar';
    } else if (distro.indexOf('steam') !== -1) {
        result = 'steam';
    } else if (distro.indexOf('suse') !== -1) {
        result = 'suse';
    } else if (distro.indexOf('mate') !== -1) {
        result = 'ubuntu-mate';
    } else if (distro.indexOf('lubuntu') !== -1) {
        result = 'lubuntu';
    } else if (distro.indexOf('xubuntu') !== -1) {
        result = 'xubuntu';
    } else if (distro.indexOf('ubuntu') !== -1) {
        result = 'ubuntu';
    } else if (distro.indexOf('solaris') !== -1) {
        result = 'solaris';
    } else if (distro.indexOf('tails') !== -1) {
        result = 'tails';
    } else if (distro.indexOf('feren') !== -1) {
        result = 'ferenos';
    } else if (distro.indexOf('robolinux') !== -1) {
        result = 'robolinux';
    } else if (_linux && distro) {
        result = distro.toLowerCase().trim().replace(/\s+/g, '-');
    }
    return result;
}

function time() {
    let t = new Date().toString().split(' ');
    return {
        current: Date.now(),
        uptime: os.uptime(),
        timezone: (t.length >= 7) ? t[5] : '',
        timezoneName: Intl ? Intl.DateTimeFormat().resolvedOptions().timeZone : (t.length >= 7) ? t.slice(6).join(' ').replace(/\(/g, '').replace(/\)/g, '') : ''
    };
}

function shell() {
    if (_windows) {
        return "cmd"
    } else {
        let result = ''
        try {
            let shellCmd = execSync('echo $SHELL')
            result = shellCmd.toString().split('\n')[0];
        } catch (err) {
            result = "UNKNOWN"
        }
        return result
    }
}
export default {
    "osInfo": osInfo,
    "shell": shell,
    "time": time,
    "getLogoFile": getLogoFile,
    "getUniqueMacAdresses": getUniqueMacAdresses
}