const CDP = require('chrome-remote-interface');
const file = require('fs');

const url = 'https://www.google.com';
const format = 'jpeg';
const viewportWidth = 800;


CDP(async (client) => {


    const { DOM, Emulation, Network, Page } = client;

    // Enable events on domains we are interested in.
    await Page.enable();
    await DOM.enable();
    await Network.enable();

    await Page.navigate({ url });
    await Page.loadEventFired();
    const options = {
        x: 950,
        y: 420,
        button: 'right',
        clickCount: 1
    };
    Promise.resolve().then(() => {
        options.type = 'mousePressed';
        return client.Input.dispatchMouseEvent(options);
    }).then(() => {
        options.type = 'mouseReleased';
        return client.Input.dispatchMouseEvent(options);
    }).catch((err) => {
        console.error(err);
    }).then(() => {
        client.close();
    });
}).on('error', (err) => {
    console.error(err);
});