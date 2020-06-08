const wi = require("@arcsine/win-info");
const fp = require("find-process");

const { Client } = require("discord-rpc");
const client = new Client({ transport: "ipc" });

const start = new Date();

async function update() {
    const apps = await fp("name", "PaintDotNet");
    let app;
    for (let i = 0; i < apps.length; i++) {
        if (["PaintDotNet.exe"].includes(apps[i].name)) {
            app = apps[i];
        }
    }

    let window;
    if (app) window = wi.getByPidSync(app.pid);
    if (window) window.filename = window.title.split(" -")[0];
    window.version = window.title.split(" -")[1];

    client.setActivity({
        details: window.version,
        state: window && window.filename ? `Editing: ${window.filename}` : "Editing Unknown",
        startTimestamp: start,
        largeImageKey: "paint",
        largeImageText: "Paint.Net"
    }, app.pid || null);
}

update();

client.on("ready", () => {
    console.log("✓ Online and ready to rock!")
    update();
    setInterval(() => {
        update();
    }, 15000);
});

console.log("Connecting...");
client.login({ clientId: "526756173148585996" });

process.on("unhandledRejection", console.error);