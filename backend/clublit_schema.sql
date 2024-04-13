-- Create Users Table
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    joindate DATE NOT NULL DEFAULT CURRENT_DATE,
    profileprivacy BOOLEAN NOT NULL,
    favorite_genre INTEGER,
    favorite_book_quote VARCHAR(400)
);

-- Create States Table
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Book Clubs Table
CREATE TABLE book_clubs (
    clubid SERIAL PRIMARY KEY,
    clubname VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    clubprivacy BOOLEAN NOT NULL,
    adminuserid INTEGER REFERENCES users(userid),
    createddate DATE NOT NULL,
    club_type VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    meetinginfo TEXT,
    announcements TEXT
);

-- Create Forums Table
CREATE TABLE forums (
    forumid SERIAL PRIMARY KEY,
    clubid INTEGER NOT NULL REFERENCES book_clubs(clubid),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    isadminonly BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Posts Table
CREATE TABLE posts (
    postid SERIAL PRIMARY KEY,
    clubid INTEGER NOT NULL REFERENCES book_clubs(clubid),
    authoruserid INTEGER NOT NULL REFERENCES users(userid),
    content TEXT NOT NULL,
    postdate TIMESTAMP WITH TIME ZONE NOT NULL,
    forumid INTEGER REFERENCES forums(forumid)
);

-- Create Genres Table
CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Memberships Table
CREATE TABLE memberships (
    membershipid SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL REFERENCES users(userid),
    clubid INTEGER NOT NULL REFERENCES book_clubs(clubid),
    joindate DATE NOT NULL
);

-- Create User Books Table
CREATE TABLE user_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(userid),
    open_library_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    finished BOOLEAN NOT NULL DEFAULT FALSE,
    added_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
