const { execFileSync, spawn, execFile } = require("child_process");
const http = require("http");
const path = require("path");

const rootDir = __dirname;
const frontendDir = path.join(rootDir, "frontend");
const backendDir = path.join(rootDir, "backend");
const npmCommand = process.platform === "win32" ? "cmd.exe" : "npm";
const npmArgs = (args) => process.platform === "win32" ? ["/d", "/s", "/c", "npm", ...args] : args;
const buildOnly = process.argv.includes("--build-only");

function runBuild(script) {
  execFileSync(npmCommand, npmArgs(["run", script]), {
    cwd: frontendDir,
    stdio: "inherit",
  });
}

try {
  runBuild("build");
  runBuild("build:admin");
} catch (error) {
  console.error("MealBridge build failed. Check the messages above.");
  process.exit(error.status || 1);
}

if (buildOnly) {
  process.exit(0);
}

function openBrowser() {
  execFile("cmd.exe", ["/c", "start", "", "http://localhost:5000/"], {
    windowsHide: true,
  });
}

function isBackendRunning() {
  return new Promise((resolve) => {
    const request = http.get("http://localhost:5000/", (response) => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 500);
    });

    request.setTimeout(1000, () => {
      request.destroy();
      resolve(false);
    });
    request.on("error", () => resolve(false));
  });
}

isBackendRunning().then((backendRunning) => {
  if (backendRunning) {
    openBrowser();
    return;
  }

  const backend = spawn(npmCommand, npmArgs(["start"]), {
    cwd: backendDir,
    stdio: "inherit",
    windowsHide: true,
  });

  backend.once("error", (error) => {
    console.error(`Unable to start the MealBridge backend: ${error.message}`);
    process.exit(1);
  });

  backend.once("exit", (code) => {
    if (code && code !== 0) {
      console.error(`MealBridge backend stopped with code ${code}.`);
    }
    process.exit(code || 0);
  });

  setTimeout(openBrowser, 1500);

  const stopBackend = () => {
    if (!backend.killed) backend.kill();
  };

  process.on("SIGINT", stopBackend);
  process.on("SIGTERM", stopBackend);
}).catch((error) => {
  console.error(`Unable to launch MealBridge: ${error.message}`);
  process.exit(1);
});
