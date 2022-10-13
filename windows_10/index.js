("use strict");
require("dotenv").config();
const fs = require("fs");
const readline = require("readline");
const { log } = require("./logger");
const {testTabs} = require("./utils/regExTests");

// "/opt/hhm-files/C0137/SHIP009/SME01107/EvtApplication_Today.txt"
const path = "/opt/hhm-files/C0137/SHIP009/SME01109/EvtApplication_Today.txt";

const runJob = async (filePath) => {
  const smeRe = /SME\d{5}/;
  const SME = filePath.match(smeRe);
  await log("info", "NA", `${SME}`, "runJob", "FN CALL", {
    sme: SME,
    file: filePath,
  });

  const re =
    /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?(\d)?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;

  try {
    let count = 1;
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      let matches = line.match(re);
      // Test for tabs
      testTabs(matches, SME, count);

      log("info", "NA", `${SME}`, "runJob", "readline", {
        host_state: matches.groups.host_state,
        host_date: matches.groups.host_date,
        host_time: matches.groups.host_time,
        host_col_1: matches.groups.host_col_1,
        host_col_2: matches.groups.host_col_2,
        host_info: matches.groups.host_info,
      });
      count++;
    });
  } catch (error) {
    console.log(count);
    await log("error", "NA", `${SME}`, "runJob", "FN CATCH", {
      error: error,
    });
  }
};
const onBoot = async () => {
  await log("info", "NA", "NA", "onBoot", `FN CALL`);
  runJob(path);
};

onBoot();
// /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;
