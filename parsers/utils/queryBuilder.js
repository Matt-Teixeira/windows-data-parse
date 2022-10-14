const pgPool = require("../db/pg-pool");

async function bulkInsert(data, modality, columns) {
  try {
    let groupArray = [];

    for await (let group of data) {
      for (let string in group) {
        group[string] = group[string].replace(/['"]+/g, "");
        group[string] = "'" + group[string] + "'";
      }
      let string = `(${[...group]})`;
      groupArray.push(string);
    }

    const query = `
  INSERT INTO ${modality}(${[...columns]})
  VALUES
  ${[...groupArray]}
  `;

    await pgPool.query(query);
  } catch (error) {
    console.log(error);
  }
}

module.exports = bulkInsert;
