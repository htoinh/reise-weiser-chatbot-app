import{readFile, writeFile} from "node:fs/promises"

const packageJsonPath = new URL("../package.json", import.meta.url);
const versionJsonPath = new URL("../version.json", import.meta.url);

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"),);
const versionJson = {version: packageJson.version,};
await writeFile(versionJsonPath, `${JSON.stringify(versionJson, null, 2)}\n`, "utf8",);
