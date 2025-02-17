
export default class Api {
    constructor({baseUrl, headers}) {
      // constructor body
      this.baseUrl = baseUrl;
      this.headers = headers;
    }
  
    getInitialCards() {
      return fetch(`${this.baseUrl}/cards`, {
        headers: this.headers
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        });
    }
  
    // other methods for working with the API
  }
  
  // export the class