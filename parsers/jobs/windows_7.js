("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../logger");

const parse_win_7 = async (filePath) => {
  const smeRe = /SME\d{5}/;
  const SME = filePath.match(smeRe);

  await log("info", "NA", "NA", "parse_win_7", "FN CALL", {
    sme: SME,
    file: filePath,
  });

  const bigGroupRe =
    /(?<big_group>Source.*[\r\n]Domain:.*[\r\n]Type:.*[\r\n]ID:.*[\r\n]Date:.*[\r\n]Text:.*)\n?/g;

  const smallGroupRe =
    /Source:(?<source_group>.*)[\r\n]Domain:(?<domain_group>.*)[\r\n]Type:(?<type_group>.*)[\r\n]ID:(?<id_group>.*)[\r\n](Date:.*\s(?<month>\w+)\s(?<day>\d+),\s(?<year>\d+),\s(?<time>.*))[\r\n]Text:(?<text_group>.*)\n?/;

  try {
    const data = (await fs.readFile(filePath)).toString();

    let matches = data.matchAll(bigGroupRe);
    let matchesArray = [...matches];

    for await (let match of matchesArray) {
      let matchGroups = match.groups.big_group.match(smallGroupRe);

      await log("info", "NA", `${SME}`, "readFile", "FN CALL", {
        source_group: matchGroups.groups.source_group,
        domain_group: matchGroups.groups.domain_group,
        type_group: matchGroups.groups.type_group,
        id_group: matchGroups.groups.id_group,
        month: matchGroups.groups.month,
        day: matchGroups.groups.day,
        year: matchGroups.groups.year,
        text_group: matchGroups.groups.text_group,
      });
    }
  } catch (error) {
    await log("error", "NA", `${SME}`, "parse_win_7", "FN CATCH", {
      error: error,
    });
  }
};


module.exports = parse_win_7;
