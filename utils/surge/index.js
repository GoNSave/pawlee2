const { GoogleSpreadsheet } = require("google-spreadsheet");

function findNextTwoHourIndex(times) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Calculate the number of minutes since midnight
  const currentMinutes = currentHour * 60 + currentMinute;

  // Find the index of the next time that is within the next 2 hours
  let index = 0;
  for (let i = 1; i < times.length; i++) {
    const [start, end] = times[i].split(" - ");
    const [startHour, startMinute] = start.split(":");
    const [endHour, endMinute] = end.split(":");

    const startMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    const endMinutes = parseInt(endHour) * 60 + parseInt(endMinute);

    if (startMinutes > currentMinutes + 120) {
      // Next time is more than 2 hours away, so stop searching
      break;
    }

    if (endMinutes > currentMinutes) {
      // Found the next time within the next 2 hours
      index = i;
      break;
    }
  }

  return index;
}

export async function getSurgeData(zone, time) {
  // console.log("getSurgeData ", weekday, zone, time);

  try {
    const private_key = process.env.GOOGLE_PRIVATE_KEY;
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: private_key.replace(/\\n/gm, "\n"),
    });
    await doc.getInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const header = rows[0]._sheet.headerValues;
    // console.log(header);
    //5 is staturday
    //6 is friday
    // const weekday = 7; //currentTime.getDay();

    const currentDate = new Date();
    const currentWeekday = currentDate.toLocaleString("en-US", {
      weekday: "short",
    });
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < rows.length; i += 4) {
      if (rows[i]._rawData[0] === zone) {
        console.log(
          "zone found",
          rows[i]._rawData[0],
          "weekday",
          currentWeekday
        );
        // weekday price
        if (weekdays.slice(0, 4).includes(currentWeekday)) {
          console.log("weekdays", rows[i]._rawData[1]);
        }
        // weekend price
        console.log("check if it's weekend", currentWeekday);
        if (weekdays.slice(-3).includes(currentWeekday)) {
          const weekendIndex = i + (7 - ((currentDate.getDay() + 6) % 7));
          console.log("weekend", rows[weekendIndex]._rawData[1]);
        }
      }
    }

    const col = findNextTwoHourIndex(header);
    console.log("column for next 2 hours", col);
  } catch (e) {}
  // console.log(`Surge data`, zone, day, "current day", currentTime.getDay());
}
