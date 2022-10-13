const { log } = require("../logger");

function testTabs(matches, SME, count) {
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

module.exports = {
  testTabs,
};
