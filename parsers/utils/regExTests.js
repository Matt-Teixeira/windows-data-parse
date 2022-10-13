const { log } = require("../logger");

async function testTabs(matches, SME, count) {
  const tabRe = /\t/g;
  if (
    tabRe.test(matches.groups.host_col_1) ||
    tabRe.test(matches.groups.host_col_2) ||
    tabRe.test(matches.groups.host_info)
  ) {
    console.log("Tab issue at line # " + count);
    log("info", "55", `${SME}`, "runJob", "Failed Regex", {
      group: matches[0],
    });
  }
}

function getSME(filePath) {
  const smeRe = /SME\d{5}/;
  return filePath.match(smeRe);
}

async function testModality(line) {
  let re = /.*\t.*\t.*\t(?<modality>(.*))_/;
  //console.log(line.match(re).groups.modality)
  return line.match(re).groups.modality;
}

module.exports = {
  testTabs,
  getSME,
  testModality,
};
