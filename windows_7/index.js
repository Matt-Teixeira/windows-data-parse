("use strict");
require("dotenv").config();
const fs = require("fs");
const { log } = require("../windows_10/logger");
const path = "/swin7.txt"

const runJob = async (filePath) => {
  // const smeRe = /SME\d{5}/
  // const SME = filePath.match(smeRe);
  await log("info", "NA", "NA", "runJob", "FN CALL", {
   // sme: SME,
    file: filePath
  });

  const bigGroupRe =
    /(?<big_group>Source.*\r\nDomain:.*\r\nType:.*\r\nID:.*\r\nDate:.*\r\nText:.*)\n?/g;

  const smallGroupRe =
    /(?<source_group>Source.*)\r\n(?<domain_group>Domain:.*)\r\n(?<type_group>Type:.*)\r\n(?<id_group>ID:.*)\r\n(Date:.*\s(?<month>\w+)\s(?<day>\d+),\s(?<year>\d+),\s(?<time>.*))\r\n(?<text_group>Text:.*)\n?/;

  try {
   fs.readFile(filePath, "utf8", function (err, data) {
      let matches = data.matchAll(bigGroupRe);
      let matchesArray = [...matches];

      for (let match of matchesArray) {
        let matchGroups = match.groups.big_group.match(smallGroupRe);
        log("info", "NA", "NA", "readFile", "FN CALL", {
            source_group: matchGroups.groups.source_group,
            domain_group: matchGroups.groups.domain_group,
            type_group: matchGroups.groups.type_group,
            id_group: matchGroups.groups.id_group,
            month: matchGroups.groups.month,
            day: matchGroups.groups.day,
            year: matchGroups.groups.year,
            text_group: matchGroups.groups.text_group
          });
      }
    });
  } catch (error) {
    await log("error", "NA", "NA", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async () => {
  await log("info", "NA", "NA", "onBoot", `FN CALL`);
  runJob();
};

onBoot();
