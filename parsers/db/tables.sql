DROP TABLE IF EXISTS sme;
CREATE TABLE sme(
    id TEXT PRIMARY KEY
);

CREATE TABLE mri(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state VARCHAR(4),
    host_date DATE,
    host_time TIME,
    host_col_1 TEXT,
    host_col_2 TEXT,
    host_info TEXT
);