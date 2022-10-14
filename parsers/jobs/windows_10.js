("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("fs");
const readline = require("readline");
const { log } = require("../logger");
const { testTabs, getSME, testModality } = require("../utils/regExTests");
const bulkInsert = require("../utils/queryBuilder");

const parse_win_10 = async (filePath) => {
 
  const data = [];
  const SME = getSME(filePath);

  await log("info", "NA", `${SME}`, "parse_win_10", "FN CALL", {
    sme: SME,
    file: filePath,
  });

  const re =
    /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?(\d+)?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;

  try {
    let count = 1;
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    let modality;
    for await (const line of rl) {
      let row = [];
      // Get modality from first line
      if (count === 1) {
        modality = (await testModality(line)).toLowerCase();
      }

      let matches = line.match(re);

      // Test for tabs
      await testTabs(matches, SME, count);

      row.push(
        SME[0],
        matches.groups.host_state,
        matches.groups.host_date,
        matches.groups.host_time,
        matches.groups.host_col_1,
        matches.groups.host_col_2,
        matches.groups.host_info
      );

      data.push(row);

      /* await pgPool.query(
        `INSERT INTO ${modality}(equipment_id, host_state, host_date, host_time, host_col_1, host_col_2, host_info) VALUES($1, $2, $3, $4, $5, $6, $7)`,
        [
          SME[0],
          matches.groups.host_state,
          matches.groups.host_date,
          matches.groups.host_time,
          matches.groups.host_col_1,
          matches.groups.host_col_2,
          matches.groups.host_info,
        ]
      ); */

      await log("info", "NA", `${SME}`, "parse_win_10", "readline", {
        host_state: matches.groups.host_state,
        host_date: matches.groups.host_date,
        host_time: matches.groups.host_time,
        host_col_1: matches.groups.host_col_1,
        host_col_2: matches.groups.host_col_2,
        host_info: matches.groups.host_info,
      });
      count++;
    }
    await bulkInsert(data, modality);
    
  } catch (error) {
    await log("error", "NA", `${SME}`, "parse_win_10", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = parse_win_10;
// /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;
