
export default class Api {
    constructor(baseUrl, headers) {
      // constructor body
      this.baseUrl = baseUrl;
      this.headers = headers;
    }
    getAppInfo(){
      return Promise.all([this.getInitialCards(), this.getUserInfo()]);
    }
    getInitialCards() {
      return fetch(`${this.baseUrl}/cards`, {
        headers: this.headers
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          Promise.reject(`Error: ${res.status}`);
        });
    }
  
    // other methods for working with the API
    getUserInfo() {
      return fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          Promise.reject(`Error: ${res.status}`);
        });
    }

     editUserInfo({ name, about }) {
      return fetch(`${this._baseUrl}/users/me`, {
        method: "PATCH",
        headers: this._headers,
        // Send the data in the body as a JSON string.
        body: JSON.stringify({
          name,
          about,
        }),
      }).then(res => {
        if (res.ok){
          console.log(res.json());
          return res.json();
        }
        Promise.reject(`Error: ${res.status}`);
      });
    }

   async  addPostCards(name, link){
      return fetch(`${this.baseUrl}/cards`, {
        method: "POST",
        headers: this.headers,
        // Send the data in the body as a JSON string.
        body: JSON.stringify({
          name,
          link,
        }),
      }).then(res => {
        if (res.ok) {
          console.log(res.json())
          return res.json();
        }
        Promise.reject(`Error: ${res.status}`);
      });
    };

  async  editAvatarInfo( avatar ) {
      return fetch(`${this.baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: this.headers,
        // Send the data in the body as a JSON string.
        body: JSON.stringify({
          avatar
        }),
      }).then(res => {
        if (res.ok) {
          return res.json();
        }
        Promise.reject(`Error: ${res.status}`);
      });
    }
  }
  
  // export the class