class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "d20ffb61-63a0-420d-b40b-e34b0dd064f3",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
