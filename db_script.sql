-- DROP SCHEMA fitplanner;

CREATE SCHEMA fitplanner AUTHORIZATION postgres;

-- DROP SEQUENCE exercise_id_seq;

CREATE SEQUENCE exercise_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE exercise_session_id_seq;

CREATE SEQUENCE exercise_session_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE exercise_workout_id_seq;

CREATE SEQUENCE exercise_workout_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE muscle_group_id_seq;

CREATE SEQUENCE muscle_group_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE training_id_seq;

CREATE SEQUENCE training_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE training_session_id_seq;

CREATE SEQUENCE training_session_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE user_id_seq;

CREATE SEQUENCE user_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- fitplanner.muscle_group definição

-- Drop table

-- DROP TABLE muscle_group;

CREATE TABLE muscle_group ( id serial4 NOT NULL, "name" varchar(50) NOT NULL, CONSTRAINT muscle_group_pkey PRIMARY KEY (id));


-- fitplanner."user" definição

-- Drop table

-- DROP TABLE "user";

CREATE TABLE "user" ( id serial4 NOT NULL, "name" varchar(50) NOT NULL, email varchar(100) NOT NULL, "password" varchar(70) NOT NULL, CONSTRAINT user_email_key UNIQUE (email), CONSTRAINT user_pkey PRIMARY KEY (id));


-- fitplanner.exercise definição

-- Drop table

-- DROP TABLE exercise;

CREATE TABLE exercise ( id serial4 NOT NULL, id_muscle_group int4 NOT NULL, "name" varchar(100) NOT NULL, description text NULL, id_user int4 NULL, CONSTRAINT exercise_pkey PRIMARY KEY (id), CONSTRAINT exercise_id_muscle_group_fkey FOREIGN KEY (id_muscle_group) REFERENCES muscle_group(id) ON DELETE CASCADE, CONSTRAINT fk_exercise_user FOREIGN KEY (id_user) REFERENCES "user"(id) ON DELETE CASCADE);


-- fitplanner.training definição

-- Drop table

-- DROP TABLE training;

CREATE TABLE training ( id serial4 NOT NULL, id_user int4 NOT NULL, title varchar(50) NOT NULL, CONSTRAINT training_pkey PRIMARY KEY (id), CONSTRAINT training_id_user_fkey FOREIGN KEY (id_user) REFERENCES "user"(id) ON DELETE CASCADE);


-- fitplanner.training_session definição

-- Drop table

-- DROP TABLE training_session;

CREATE TABLE training_session ( id serial4 NOT NULL, id_user int4 NOT NULL, id_training int4 NOT NULL, started_at timestamptz NOT NULL, finished_at timestamptz NULL, CONSTRAINT training_session_pkey PRIMARY KEY (id), CONSTRAINT fk_training_session_training FOREIGN KEY (id_training) REFERENCES training(id) ON DELETE CASCADE, CONSTRAINT fk_training_session_user FOREIGN KEY (id_user) REFERENCES "user"(id));


-- fitplanner.exercise_session definição

-- Drop table

-- DROP TABLE exercise_session;

CREATE TABLE exercise_session ( id serial4 NOT NULL, id_training_session int4 NOT NULL, id_exercise int4 NOT NULL, series int4 NOT NULL, repetitions int4 NOT NULL, weight numeric NULL, notes text NULL, CONSTRAINT exercise_session_pkey PRIMARY KEY (id), CONSTRAINT fk_exercise_session_exercise FOREIGN KEY (id_exercise) REFERENCES exercise(id), CONSTRAINT fk_exercise_session_training_session FOREIGN KEY (id_training_session) REFERENCES training_session(id) ON DELETE CASCADE);


-- fitplanner.exercise_workout definição

-- Drop table

-- DROP TABLE exercise_workout;

CREATE TABLE exercise_workout ( id serial4 NOT NULL, id_training int4 NOT NULL, id_exercise int4 NOT NULL, series int4 NOT NULL, repetitions int4 NOT NULL, CONSTRAINT exercise_workout_pkey PRIMARY KEY (id), CONSTRAINT exercise_workout_id_exercise_fkey FOREIGN KEY (id_exercise) REFERENCES exercise(id) ON DELETE CASCADE, CONSTRAINT exercise_workout_id_training_fkey FOREIGN KEY (id_training) REFERENCES training(id) ON DELETE CASCADE);