# Club Lit(erature) - Connect, Discover, and Share Your Love for Books

Welcome to Club Lit(erature), a community-driven platform designed to unite book lovers. The goal is to create a space where readers can discover new books, join book clubs that match their interests, participate in discussions, and share their insights and reviews.

## Technical Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **APIs**: Open Library API, Google Books API

## Setup Instructions

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Database Setup

1. Start your PostgreSQL service and log in to the PostgreSQL command line tool.
2. Create a new database for the project:
   ```sql
   CREATE DATABASE clublit;
   ```
3. Connect to the newly created database:
   \c clublit
4. Run the schema setup script to establish the database structure
   \i backend/clublit_schema.sql
5. Seed the database with initial data:
   \i backend/clublit_seed.sql

Backend Setup

1. Navigate to the backend directory:
   cd backend
2. Install required Node.js package
   npm install
3. Configure environment variables as per the .env.example file at the root of the backend directory. Copy the .env.example to a new file named .env and fill in your details.

Frontend Setup

1. In a new terminal window, navigate to the frontend directory from the root of the project:
   cd frontend

2. Install required Node.js packages:
   npm install

3. Start the frontend development server:
   npm start

After completing these steps, the application should be running locally with the frontend accessible on http://localhost:3000 and the backend on http://localhost:5000 or as specified in your environment settings.

## Features

### Sign Up

New users can create an account to join the Club Lit(erature) community.

### Login

Registered members can log in to access their personalized dashboard and book clubs.

### Account Settings

Users can update their account details, including password changes for enhanced security.

### User Dashboard

A personalized space where users can:

- Track updates from their joined book clubs.
- Manage their current reading list, with a limit of three books to maintain focus.
- Mark books as finished or remove them from the list.

### User Bookshelf

A display of completed reads, showcasing book covers and reading achievements. It also features user preferences such as favorite genres and book quotes.

### Profile Preferences

Users can update their favorite genres and book quotes, reflecting their literary tastes on their bookshelf.

### Book Search

A feature that leverages the Open Library API and Google Books API to enable users to search for books by title, author, or ISBN. Search results provide essential details about the books, including thumbnails, which users can add to their reading list or book clubs.

### Book Clubs

- **Discovery and Membership**: Search for and join book clubs based on location and interest, with a limit of three memberships per user.
- **Management**: Users can manage their memberships and club admins can edit club details.
- **Creation**: Users can create new book clubs, setting up the name, description, location, and more.

### Forums

Each book club hosts forums for discussions on various topics, including:

- Member Introductions
- Events and Meetups
- Book Discussions
- Book Club Operations
- Book Recommendations
- Author Discussions
- General Chat

### Book Club Blurbs

Admins can post updates to Meeting Info and Announcements, which are reflected in user dashboards.

## Database Schema Overview

The database schema is designed to store and manage user data, book club information, forum discussions, and more.

### Users

Stores user profile information with privacy settings.

### Book Clubs

Manages book club details and user memberships.

### Forums

Hosts forum topics and discussions within book clubs.

### Memberships

Tracks which users belong to which book clubs.

### Posts

Allows users to contribute to forum discussions.

### States

Maintains location data for user profiles and book clubs.

### User Books

Catalogs user reading lists and preferences.

## Acknowledgments

Gratitude to APIs that make this platform possible

- Open Library API
- Google Books API
