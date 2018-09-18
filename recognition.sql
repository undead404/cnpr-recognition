CREATE TABLE plates (
    id INTEGER NOT NULL,
    "number" VARCHAR(12) NOT NULL,
    owner_name VARCHAR(100),
    CONSTRAINT plates_PK PRIMARY KEY (id)
);
ALTER TABLE
    plates
ADD
    last_seen TEXT NOT NULL DEFAULT '';
ALTER TABLE
    plates
ADD
    allowed INTEGER DEFAULT 0 NOT NULL;
CREATE INDEX plates_number_IDX
    ON plates ("number");
CREATE TABLE config (
    "key" TEXT(20) NOT NULL,
    value TEXT(100) NOT NULL,
    CONSTRAINT config_PK PRIMARY KEY ("key")
);
INSERT INTO config ("key", value)
    VALUES ('recognition_delay', '5000');
INSERT INTO ("key", value)
    VALUES ('confidence', '87');
INSERT INTO config ("key", value)
    VALUES ('min_number_length', '7');
INSERT INTO config ("key", value)
    VALUES (
        'config_version',
        '2018-09-10 12:47:39'
    );
CREATE TRIGGER IF NOT EXISTS actualize_config_version
    AFTER UPDATE
        OF value
        ON config
        FOR EACH ROW
        WHEN 1
    BEGIN
        UPDATE config
            SET value = DATETIME('NOW')
            WHERE key = 'configVersion';END;
CREATE TABLE logs (
    id INTEGER NOT NULL,
    plateNumber VARCHAR(12) NOT NULL,
    datetime TEXT(100) NOT NULL,
    CONSTRAINT logs_PK PRIMARY KEY (id),
    CONSTRAINT logs_plates_FK FOREIGN KEY (plateNumber) REFERENCES plates(number)
);
ALTER TABLE logs
    ADD allowed INTEGER(1) DEFAULT 0 NOT NULL;
