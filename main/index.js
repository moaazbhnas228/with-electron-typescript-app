"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = require("path");
const url_1 = require("url");
// Packages
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const electron_next_1 = __importDefault(require("electron-next"));
function createMainWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        title: "Hunt Wilson | Label Printer",
        width: electron_is_dev_1.default ? 1600 : 800,
        height: electron_is_dev_1.default ? 1200 : 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: (0, path_1.join)(__dirname, "preload.js"),
        },
    });
    if (electron_is_dev_1.default) {
        mainWindow.webContents.openDevTools();
    }
    const url = electron_is_dev_1.default
        ? "http://localhost:8000/"
        : (0, url_1.format)({
            pathname: (0, path_1.join)(__dirname, "../renderer/out/index.html"),
            protocol: "file:",
            slashes: true,
        });
    mainWindow.loadURL(url);
    return mainWindow;
}
function implementMenu() {
    // Menu template
    const menu = [
    // { role: "fileMenu" },
    ];
    // Implement menu
    const mainMenu = electron_1.Menu.buildFromTemplate(menu);
    electron_1.Menu.setApplicationMenu(mainMenu);
}
// Prepare the renderer once the app is ready
electron_1.app.on("ready", async () => {
    await (0, electron_next_1.default)("./renderer");
    createMainWindow();
    implementMenu();
    electron_1.ipcMain.on("print", function print(event) {
        const win = electron_1.BrowserWindow.getFocusedWindow();
        if (win) {
            win.webContents.print({ silent: true, printBackground: true });
        }
    });
    // mainWindow.webContents.print(
    //   {
    //     silent: false,
    //     deviceName: "My Printer",
    //     pageRanges: [{ from: 0, to: 1 }],
    //   },
    //   function (success, errorType) {
    //     console.log("⚡", { success, errorType });
    //   }
    // );
});
// Quit the app once all windows are closed
electron_1.app.on("window-all-closed", () => {
    // On macOS, it is common for applications to stay open even after all windows have been closed.
    const isMac = process.platform === "darwin";
    if (!isMac) {
        electron_1.app.quit();
    }
});
// listen the channel `message` and resend the received message to the renderer process
electron_1.ipcMain.on("message", (event, message) => {
    console.log(message);
    setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});
