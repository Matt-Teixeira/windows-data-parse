const pgPool = require("../db/pg-pool");

async function bulkInsert(data, modality) {
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
  INSERT INTO ${modality}(equipment_id, host_state, host_date, host_time, host_col_1, host_col_2, host_info)
  VALUES
  ${[...groupArray]}
  `;

    await pgPool.query(query);
  } catch (error) {
    console.log(error);
  }
}

module.exports = bulkInsert;
