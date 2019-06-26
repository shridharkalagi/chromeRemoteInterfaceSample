const CDP = require('chrome-remote-interface');
const url = 'https://www.kroger.com/cl';
const atob = require('atob');
const btoa = require('btoa');
const mock = require('./mock');
CDP(async (client) => {

  const { Network, Page } = client;

  // Enable events on domains we are interested in.
  await Page.enable();
  await Network.enable();

  await Page.navigate({ url });
  await Network.setRequestInterception({ patterns: [{ urlPattern: '*/cl/api/coupons*', resourceType: 'XHR', interceptionStage: 'HeadersReceived' }] });

  Network.requestIntercepted(async ({ interceptionId, request, responseStatusCode }) => {
    console.log(`Intercepted ${request.url} {interception id: ${interceptionId}}`);

    const response = await Network.getResponseBodyForInterception({ interceptionId });

    const bodyData = response.base64Encoded ? atob(response.body) : response.body;

    // console.log(bodyData);
    const newBody = mock;

    const newHeaders = [
      'Connection: closed',
      'Content-Length: ' + newBody.length,
      'Content-Type: application/json;charset=UTF-8'
    ];

    Network.continueInterceptedRequest({
      interceptionId,
      rawResponse: btoa('HTTP/1.1 200 OK' + '\r\n' + newHeaders.join('\r\n') + '\r\n\r\n' + JSON.stringify(newBody))
    });
  });
  await Page.navigate({ url });
});