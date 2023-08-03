# 🦈🔑

[![Node.js Build](https://github.com/lunar-gg/sharkkey/actions/workflows/Node.yml/badge.svg?branch=main)](https://github.com/lunar-gg/sharkkey/actions/workflows/Node.yml)
[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/lunar-gg/sharkkey/main)

![Known Vulnerabilities](https://snyk.io/test/github/lunar-gg/sharkkey/badge.svg)
[![codecov](https://codecov.io/gh/lunar-gg/sharkkey/branch/main/graph/badge.svg?token=316VHCOLS6)](https://codecov.io/gh/lunar-gg/sharkkey)
[![OSSAR](https://github.com/lunar-gg/sharkkey/actions/workflows/ossar.yml/badge.svg)](https://github.com/lunar-gg/sharkkey/actions/workflows/ossar.yml)
[![Codacy Security Scan](https://github.com/lunar-gg/sharkkey/actions/workflows/codacy.yml/badge.svg)](https://github.com/lunar-gg/sharkkey/actions/workflows/codacy.yml)
[![ESLint](https://github.com/lunar-gg/sharkkey/actions/workflows/eslint.yml/badge.svg)](https://github.com/lunar-gg/sharkkey/actions/workflows/eslint.yml)

## Do not use (yet),

Because the encryption workflow is constantly changing,
So files encrypted with one version might not be decryptable with new versions.
(Until the final workflow has been decided)

### Resonably secure encryption

Changelog 7/19/23 03~ :
-   General code quality improvements (Ongoing)

-   Switched from own hex encoding \ decoding to node:buffer

-   Completely switched away from CryptoJS in favour of the native node:crypto

-   Wrote JSDocs for everything in
    - 🐟/cryptography.js,
    - 🐟/compression.js,
    - index.js,
    - 🦈.js

-   Deleted 🐟/generic.js and moved functions to 🦈.js

-   Improved the encryptObject function by switching to aes-256-cbc

-   Wrote comments for everything in:
    - 🐟/cryptography.js,
    - 🐟/compression.js,
    - index.js,
    - 🦈.js

-   switched to readlineSync for gathering user input (2fa, Y/N)

-   Created 🐟/synchronousOsInfo.js (sebhildebrandt/systeminformation)

-   Removed unused dependencies (hwid, systeminformation, yesno, crypto-js)

Changelog 7/17/23 13~ :
- TOTP (Time-based one time password) (example: Google Authentacater)
- Completely removed all MD5 ussage to be safe against collision attacks
- Auto building binaries via Github Actions
- compiling macOS x64 binaries

Changelog 7/17/23 12~ :
-   Added:
    - \--string: work with strings instead of files.
    - \--copy: copy results to clipboard.

-   Added checkid file that allows getting info about a ID file given the key

-   Prettified\* console output

Upcomming:
- Directory encryption \ decryption (zip, encrypt zip w extra metadata)
- Save and load password from env, then use with --saved / -sv
- Write docs
