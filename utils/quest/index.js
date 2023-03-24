const { GoogleSpreadsheet } = require("google-spreadsheet");

export async function getQuestData(zone, vehicle, period) {
  let message = `${zone} incentive for ${vehicle} ${period}:\n`;
  const sheetIndex = period === "Next Week" ? 1 : 0;
  try {
    const private_key = process.env.GOOGLE_PRIVATE_KEY;
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_QUEST_DATA_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: private_key.replace(/\\n/gm, "\n"),
    });
    await doc.getInfo();
    const sheet = doc.sheetsByIndex[sheetIndex];
    const rows = await sheet.getRows();

    const foundVehicleRows = [];

    const vehicleRows = [];

    rows.forEach((row, index) => {
      if (row._rawData[0]) {
        const vehicles = row._rawData[0].trim().split(",");
        if (vehicles.includes(vehicle)) {
          //   console.log(index, row._rawData);
          vehicleRows.push(index);
        }
      }
    });
    vehicleRows.forEach((row) => {
      //get the zone name
      //in zone 1?
      const zone1 = rows[row - 1]._rawData[3]
        .trim()
        .split(",")
        .map((v) => v.trim());
      //   console.log(zone1);
      if (zone1.includes(zone)) {
        // console.log("in zone one");
        message += `\n📅 ${rows[row]._rawData[1]} 📅\n`;
        for (let i = row; i < row + 5; i++) {
          message += `Make ${rows[i]._rawData[2]} orders 👉 receive ${rows[i]._rawData[4]}\n`;
        }
      }
      const zone2 = rows[row - 1]._rawData[4]
        .trim()
        .split(",")
        .map((v) => v.trim());
      //   console.log(zone2);
      if (zone2.includes(zone)) {
        // console.log("in zone two");
        message += `\n📅 ${rows[row]._rawData[1]} 📅\n`;
        for (let i = row; i < row + 5; i++) {
          message += `Make ${rows[i]._rawData[2]} orders 👉 receive ${rows[i]._rawData[4]}\n`;
        }
      }

      //   console.log(rows[row - 1]._rawData[4]);
    });

    // console.log(vehicleRows);
  } catch (e) {
    console.log(e);
  }
  console.log(message);
  return message;
}
