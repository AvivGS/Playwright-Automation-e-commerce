export default class NetworkUtils {
  constructor(page) {
    this.page = page;
    this.requests = [];
  }

  captureRequest(urlPattern, method = "GET") {
    this.page.on("request", (request) => {
      if (request.url().includes(urlPattern) && request.method() === method) {
        console.log(`Captured request: ${request.url()}`);
        this.requests.push(request);
      }
    });
  }

  captureResponse(urlPattern, expectedStatus = 200) {
    this.page.on("response", (response) => {
      if (
        response.url().includes(urlPattern) &&
        response.status() === expectedStatus
      ) {
        console.log(
          `Captured response: ${response.url()} with status: ${response.status()}`
        );
      }
    });
  }

  verifyRequestCaptured(urlPattern) {
    return this.requests.some((request) => request.url().includes(urlPattern));
  }
}
