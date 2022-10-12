("use strict");
require("dotenv").config();
const fs = require("fs");
const readline = require("readline");
const { log } = require("./logger");

const runJob = async () => {
  await log("info", "NA", "NA", "runJob", "FN CALL");

  const re =
  /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;

  const tabRe = /\t/g;
  try {
    let count = 1;
    const rl = readline.createInterface({
      input: fs.createReadStream("New_SWin10.txt"),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      let matches = line.match(re);
      log("info", "NA", "NA", "runJob", "readline", {
        host_state: matches.groups.host_state,
        host_date: matches.groups.host_date,
        host_time: matches.groups.host_time,
        host_col_1: matches.groups.host_col_1,
        host_col_2: matches.groups.host_col_2,
        host_info: matches.groups.host_info,
      });
    });
  } catch (error) {
    console.log(count);
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
// /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?))\t?\s?(?<host_col_2>(\d{1,5})(\.\d\.\d)?)\t(?<host_info>.*)/
