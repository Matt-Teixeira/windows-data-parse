("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../logger");
const { getSME, testModality } = require("../utils/regExTests");
const bulkInsert = require("../utils/queryBuilder");
const convertDates = require("../utils/dates");

const parse_win_7 = async (filePath) => {
  const data = [];
  const SME = getSME(filePath);
  try {
  await log("info", "NA", "NA", "parse_win_7", "FN CALL", {
    sme: SME,
    file: filePath,
  });

  const bigGroupRe =
    /(?<big_group>Source.*[\r\n]Domain:.*[\r\n]Type:.*[\r\n]ID:.*[\r\n]Date:.*[\r\n]Text:.*)\n?/g;

  const smallGroupRe =
    /Source:(?<source_group>.*)[\r\n]Domain:(?<domain_group>.*)[\r\n]Type:(?<type_group>.*)[\r\n]ID:(?<id_group>.*)[\r\n](Date:.*\s(?<month>\w+)\s(?<day>\d+),\s(?<year>\d+),\s(?<time>.*))[\r\n]Text:(?<text_group>.*)\n?/;

  let count = 1;

  
    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.matchAll(bigGroupRe);
    let matchesArray = [...matches];

    let modality;
    for await (let match of matchesArray) {
      let row = [];

      let matchGroups = match.groups.big_group.match(smallGroupRe);

      convertDates(matchGroups.groups);

      // Get modality from first line
      if (count === 1) {
        modality = (
          await testModality(matchGroups.groups.source_group)
        ).toLowerCase();
      }

      row.push(
        SME[0],
        matchGroups.groups.source_group,
        matchGroups.groups.host_date,
        matchGroups.groups.time,
        matchGroups.groups.domain_group,
        matchGroups.groups.type_group,
        matchGroups.groups.id_group,
        matchGroups.groups.text_group
      );
      data.push(row);

      /*  await log("info", "NA", `${SME}`, "readFile", "FN CALL", {
        source_group: matchGroups.groups.source_group,
        domain_group: matchGroups.groups.domain_group,
        type_group: matchGroups.groups.type_group,
        id_group: matchGroups.groups.id_group,
        month: matchGroups.groups.month,
        day: matchGroups.groups.day,
        year: matchGroups.groups.year,
        text_group: matchGroups.groups.text_group,
      }); */

      count++;
    }
    await bulkInsert(
      data,
      modality,
      [
        "equipment_id",
        "source_group",
        "host_date",
        "host_time",
        "domain_group",
        "type_group",
        "id_group",
        "text_group",
      ],
      filePath
    );
  } catch (error) {
    await log("error", "NA", `${SME}`, "parse_win_7", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = parse_win_7;
