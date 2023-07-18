# 🦈🔑
[![Node.js Build](https://github.com/lunar-gg/sharkkey/actions/workflows/Node.yml/badge.svg?branch=main)](https://github.com/lunar-gg/sharkkey/actions/workflows/Node.yml)
[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/lunar-gg/sharkkey/main)

![Known Vulnerabilities](https://snyk.io/test/github/lunar-gg/sharkkey/badge.svg)
[![codecov](https://codecov.io/gh/lunar-gg/sharkkey/branch/main/graph/badge.svg?token=316VHCOLS6)](https://codecov.io/gh/lunar-gg/sharkkey)
[![OSSAR](https://github.com/lunar-gg/sharkkey/actions/workflows/ossar.yml/badge.svg)](https://github.com/lunar-gg/sharkkey/actions/workflows/ossar.yml)
[![Codacy Security Scan](https://github.com/lunar-gg/sharkkey/actions/workflows/codacy.yml/badge.svg)](https://github.com/lunar-gg/sharkkey/actions/workflows/codacy.yml)

## Do not use, as the encryption workflow is constantly changing, so files encrypted with one version might not be decryptable with new versions. (Until the final workflow has been decided)
### Resonably secure encryption

Changelog 7/17/23 13~ :
* TOTP (Time-based one time password) (example: Google Authentacater)
* Completely removed all MD5 ussage to be safe against collision attacks
* Auto building binaries via Github Actions
* compiling macOS x64 binaries (arm is a bit weird right now but im working on it)

Changelog 7/17/23 12~ :
* Added --copy & --string that allows copying results to clipboard, and encrypting and decrypting of strings instead of files.
* Added checkid file that allows getting info about a ID file given the key
* Prettified* console output

Upcomming:
* Directory encryption \ decryption (zip, encrypt zip w extra metadata)
* Save and load password from env, then use with --saved / -sv
* Write docs