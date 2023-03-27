const https = require("https");

class NetApi {
  constructor(tgbot) {
    this.tgbot = tgbot;
  }

  async sendMessage(chatId, message) {
    const url = `https://api.telegram.org/bot${this.tgbot}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=HTML`;
    // const url = `https://api.telegram.org/bot${this.tgbot}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=Markdown`;
    return this.sendRequest(url);
  }

  async sendPhoto(chatId, photo) {
    const url = `https://api.telegram.org/bot${this.tgbot}/sendPhoto`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    return this.sendMultipartRequest(url, options, chatId, photo);
  }

  async sendRequest(url) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            const response = JSON.parse(data);

            if (response.ok) {
              resolve(response.result);
            } else {
              reject(response.description);
            }
          });
        })
        .on("error", (err) => {
          reject(err.message);
        });
    });
  }

  async sendMultipartRequest(url, options, chatId, photo) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const response = JSON.parse(data);

          if (response.ok) {
            resolve(response.result);
          } else {
            reject(response.description);
          }
        });
      });

      const form = req.form();
      form.append("chat_id", chatId);
      form.append("photo", photo);

      req.on("error", (err) => {
        reject(err.message);
      });

      req.end();
    });
  }
}

module.exports = { NetApi };
