#!/usr/bin/env node

// Ref 1: https://github.com/sanathkr/go-npm
// Ref 2: https://blog.xendit.engineer/how-we-repurposed-npm-to-publish-and-distribute-our-go-binaries-for-internal-cli-23981b80911b

"use strict";

import binLinks from "bin-links";
import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import tar from "tar";
import zlib from "zlib";

// Mapping from Node's `process.arch` to Golang's `$GOARCH`
const ARCH_MAPPING = {
    x64: "amd64",
    arm64: "arm64",
};

// Mapping between Node's `process.platform` to Golang's
const PLATFORM_MAPPING = {
    darwin: "darwin",
    linux: "linux",
    win32: "windows",
};

const readPackageJson = async () => {
    const packageJsonPath = path.join(".", "package.json");
    const contents = await fs.promises.readFile(packageJsonPath);
    return JSON.parse(contents);
};


const parsePackageJson = (packageJson) => {
    const arch = ARCH_MAPPING[process.arch];
    if (!arch) {
        throw Error(
            "Installation is not supported for this architecture: " + process.arch
        );
    }
  
    const platform = PLATFORM_MAPPING[process.platform];
    if (!platform) {
        throw Error(
            "Installation is not supported for this platform: " + process.platform
        );
    }

    // Build the download url from package.json
    const pkgName = packageJson.name;
    const version = packageJson.version;
    const repo = packageJson.repository;
    const url = `https://github.com/${repo}/releases/download/v${version}/${pkgName}_${platform}_${arch}.tar.gz`;

    let binPath = path.join("bin", "squire");
    if (platform == "windows") {
        binPath += ".exe";
    }

    return { binPath, url };
};

const errGlobal = `Installing Squire CLI as a global module is not supported.`

async function main() {
    const yarnGlobal = JSON.parse(
            process.env.npm_config_argv || "{}"
        ).original?.includes("global");

    if (process.env.npm_config_global || yarnGlobal) {
        throw errGlobal;
    }   
    
    const pkg = await readPackageJson();
    const { binPath, url } = parsePackageJson(pkg);
    const binDir = path.dirname(binPath);
    await fs.promises.mkdir(binDir, { recursive: true });

    // First we will Un-GZip, then we will untar.
    const ungz = zlib.createGunzip();
    const binName = path.basename(binPath);
    const untar = tar.x({ cwd: binDir }, [binName]);

    // Use local binary for now, will move this to a release later
    const useLocal = true;

    if (useLocal) {
        const localBin = path.resolve(".", "squire-cli");
        await fs.promises.copyFile(localBin, binPath);
        // return;
    } else {
        console.info("Downloading", url);
        const resp = await fetch(url);
        resp.body.pipe(ungz).pipe(untar);
        await new Promise((resolve, reject) => {
            untar.on("error", reject);
            untar.on("end", () => resolve());
        });
    }

    // Link the binaries in postinstall to support yarn
    await binLinks({
        path: path.resolve("."),
        pkg: { ...pkg, bin: { [pkg.name]: binPath } },
    });

    console.info("Installed Squire CLI successfully");
}

await main();