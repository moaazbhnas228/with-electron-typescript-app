// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, Menu } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Hunt Wilson | Label Printer",
    width: isDev ? 1600 : 800,
    height: isDev ? 1200 : 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);

  return mainWindow;
}

function implementMenu() {
  // Menu template
  const menu: Array<Electron.MenuItemConstructorOptions> = [
    // { role: "fileMenu" },
  ];

  // Implement menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
}

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  createMainWindow();
  implementMenu();

  ipcMain.on("print", function print(event) {
    const win = BrowserWindow.getFocusedWindow();
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
app.on("window-all-closed", () => {
  // On macOS, it is common for applications to stay open even after all windows have been closed.
  const isMac = process.platform === "darwin";
  if (!isMac) {
    app.quit();
  }
});

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});
