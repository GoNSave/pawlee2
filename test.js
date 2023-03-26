// import {
//   getZones,
//   getUser,
//   updateUser,
//   addUser,
//   getQuestions,
//   getAnswers,
// } from "./firebase/index.js";

const projectId = "gns-gpt-bot";
const location = "us"; // Format is 'us' or 'eu'
// const processorId = "e7a923443fcb4ffb"; // form parser id
const processorId = "1af71b78f04c04c3"; // form processor trained for surge fee

const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;

const client = new DocumentProcessorServiceClient();

const { googleapi } = require("googleapis");

// googleapi.client
//   .init({
//     apiKey: "<YOUR_API_KEY>",
//     discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
//     clientId: "<YOUR_CLIENT_ID>",
//     scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
//   })
//   .then(
//     function () {
//       // API client loaded and ready to use
//     },
//     function (error) {
//       console.log("Error loading API client:", error);
//     }
//   );

// const auth = new googleapi.auth.GoogleAuth({
//   keyFile: "<PATH_TO_KEY_FILE>",
//   scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
// });

// googleapi.client
//   .init({
//     apiKey: "<YOUR_API_KEY>",
//     discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
//     clientId: "<YOUR_CLIENT_ID>",
//     scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
//   })
//   .then(
//     function () {
//       // API client loaded and ready to use
//     },
//     function (error) {
//       console.log("Error loading API client:", error);
//     }
//   );

//   googleapi.client.sheets.spreadsheets.values
//   .get({
//     spreadsheetId: "<YOUR_SPREADSHEET_ID>",
//     range: "Sheet1!A1:B10",
//   })
//   .then(
//     function (response) {
//       var data = response.result.values;
//       console.log("Data:", data);
//     },
//     function (error) {
//       console.log("Error:", error);
//     }
//   );

// const sheets = google.sheets({ version: "v4", auth });

async function quickstart() {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  const filePath = "./assets/receipts/file_26656.jpg";
  const fs = require("fs").promises;
  const imageFile = await fs.readFile(filePath);

  const encodedImage = Buffer.from(imageFile).toString("base64");

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: "image/png",
    },
  };

  const [result] = await client.processDocument(request);
  const { document } = result;

  const { text } = document;
  console.log("------------------ document start -------------");
  console.log(text);
  console.log("------------------ document end -------------");
}

const res = quickstart();
