const CDP = require('chrome-remote-interface');
const file = require('fs');

const url = 'https://www.test.com/cl';
const format = 'jpeg';
const viewportWidth = 800;
 
const atob = require('atob');
 
const btoa = require('btoa');
// import mock from './mock.js';

const mock = require('./mock');
CDP(async (client) => {


    const { DOM, Runtime, Network, Page } = client;

    // Enable events on domains we are interested in.
    await Page.enable();
    await DOM.enable();
    await Network.enable(); 
    await Runtime.enable();

    await Page.navigate({url});
    await Network.setRequestInterception({ patterns: [{ urlPattern: '*/cl/api/coupons*',resourceType: 'XHR', interceptionStage: 'HeadersReceived' }] });

    Network.requestIntercepted(async ({ interceptionId, request, responseStatusCode}) => {
 
        console.log(`Intercepted ${request.url} {interception id: ${interceptionId}}`);
     
        const response = await Network.getResponseBodyForInterception({ interceptionId });
        // const request = await Network.get
        const bodyData = response.base64Encoded ? atob(response.body) : response.body;
        console.log(bodyData);
        const newBody = JSON.parse(mock);
     
        const newHeaders = [
     
          'Connection: closed',
     
          'Content-Length: ' + newBody.length,
     
          'Content-Type: application/json;charset=UTF-8'
     
        ];
     
        Network.continueInterceptedRequest({
     
          interceptionId,
     
          rawResponse: btoa('HTTP/1.1 200 OK' + '\r\n' + newHeaders.join('\r\n') + '\r\n\r\n' + newBody)
     
        });
     
      });
     


//     await Page.loadEventFired();
//     const options = {
//         x: 950,
//         y: 420,
//         button: 'right',
//         clickCount: 1
//     };
//     Promise.resolve().then(() => {
//         options.type = 'mousePressed';
//         return client.Input.dispatchMouseEvent(options);
//     }).then(() => {
//         options.type = 'mouseReleased';
//         return client.Input.dispatchMouseEvent(options);
//     }).catch((err) => {
//         console.error(err);
//     }).then(() => {
//         client.close();
//     });
// }).on('error', (err) => {
//     console.error(err);
});