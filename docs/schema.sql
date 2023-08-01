
---------------------- Schema creation ----------------------

-- Login as postgres
	-- psql -U postgres

-- Thief
	create table thief (
		thief_id     int   primary key,
		approved     bool
	);
	grant select, update, insert, delete on thief to "ec2-user";

-- Name
	create table name (
		thief_id     int,
		name         text,
		primary key (thief_id, name)
	);
	grant select, update, insert, delete on name to "ec2-user";

-- Email
	create table email (
		thief_id     int,
		email        text,
		primary key (thief_id, email)
	);
	grant select, update, insert, delete on email to "ec2-user";

-- Url
	create table url (
		thief_id     int,
		url          text,
		primary key (thief_id, url)
	);
	grant select, update, insert, delete on url to "ec2-user";

-- Addr
	create table addr (
		thief_id     int,
		addr         text,
		primary key (thief_id, addr)
	);
	grant select, update, insert, delete on addr to "ec2-user";

-- Phone
	create table phone (
		thief_id     int,
		phone        text,
		primary key (thief_id, phone)
	);
	grant select, update, insert, delete on phone to "ec2-user";

-- Bike_serial
	create table bike_serial (
		thief_id     int,
		bike_serial  text,
		primary key (thief_id, bike_serial)
	);
	grant select, update, insert, delete on bike_serial to "ec2-user";

-- Phrase
	create table phrase (
		thief_id     int,
		phrase       text,
		primary key (thief_id, phrase)
	);
	grant select, update, insert, delete on phrase to "ec2-user";

-- Note
	create table note (
		thief_id     int,
		note         text,
		primary key (thief_id, note)
	);
	grant select, update, insert, delete on note to "ec2-user";

-- File
	create table file (
		thief_id     int,
		file         text,  -- (url to file server)
		primary key (thief_id, file)
	);
	grant select, update, insert, delete on file to "ec2-user";

-- Bi_user
	create table bi_user (
		user_uid     text,
		email        text,
		first_name   text,
		last_name    text,
		title        text,
		org          text,
		phone        text,  -- only digits
		role         text,  -- ["admin", "readWrite", "readOnly"]
		approved     bool,
		banned       bool  -- acts as if biuser does not exist
	);
	grant select, update, insert, delete on bi_user to "ec2-user";

-- History
	create table history (
		-- Actions from post/get requests, store it as a json object
		history_id   int,
		datetime     timestamp,
		user_uid     int,
		source       text,  -- ip?
		message      text
	);
	grant select, update, insert, delete on history to "ec2-user";

-- Next thief id sequence
	create sequence next_thief_id;
	-- currval(), nextval(), setval() permissions
	grant select, update on next_thief_id to "ec2-user";
