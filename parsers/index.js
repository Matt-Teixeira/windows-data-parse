("use strict");
require("dotenv").config();
const { log } = require("./logger");
//const parse_win_7 = require("./jobs/windows_7");
const parse_win_10 = require("./jobs/windows_10");

const path = "/opt/hhm-files/C0137/SHIP009/SME00811/EvtApplication_Today.txt";

const runJob = async (filePath) => {
  await log("info", "NA", "NA", "runJob", "FN CALL", {
    // sme: SME,
    file: filePath,
  });

  try {
    //await parse_win_7(filePath);
    await parse_win_10(path);
  } catch (error) {
    await log("error", "NA", "NA", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async (filePath) => {
  await log("info", "NA", "NA", "onBoot", `FN CALL`);
  runJob(filePath);
};

onBoot(path);
