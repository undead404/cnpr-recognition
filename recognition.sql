CREATE TABLE plates (
	id INTEGER NOT NULL,
	"number" VARCHAR(12) NOT NULL,
	owner_name VARCHAR(100),
	CONSTRAINT plates_PK PRIMARY KEY (id)
) ;
ALTER TABLE plates ADD last_seen TEXT NOT NULL DEFAULT '';

CREATE INDEX plates_number_IDX ON plates ("number") ;

CREATE TABLE config (
	"key" TEXT(20) NOT NULL,
	value TEXT(100) NOT NULL,
	CONSTRAINT config_PK PRIMARY KEY ("key")
);
INSERT INTO config ("key",value) VALUES (
'recognition_delay','5000');
INSERT INTO config ("key",value) VALUES (
'confidence','87');
INSERT INTO config ("key",value) VALUES (
'min_number_length','7');
INSERT INTO config ("key",value) VALUES (
'config_version','2018-09-10 12:47:39');
CREATE
	TRIGGER IF NOT EXISTS actualize_config_version AFTER UPDATE
		OF value ON
		config FOR EACH ROW
		WHEN 1
	BEGIN
		UPDATE
			config SET
				value = DATETIME('NOW')
			WHERE
				key = 'configVersion';
			END;
