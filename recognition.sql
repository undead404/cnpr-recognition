CREATE TABLE plates (
	id INTEGER NOT NULL,
	"number" VARCHAR(12) NOT NULL,
	owner_name VARCHAR(100),
	CONSTRAINT plates_PK PRIMARY KEY (id)
) ;
CREATE INDEX plates_number_IDX ON plates ("number") ;