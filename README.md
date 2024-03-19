# Club Lit(erature) - Connect, Discover, and Share Your Love for Books

Welcome to Club Lit(erature), a community-driven platform designed to unite book lovers across the globe. The goal is to create a space where readers can discover new books, join book clubs that match their interests, participate in discussions, and share their insights and reviews. 

## Technical Stack

- **Frontend**: React for building a dynamic and responsive UI.
- **Backend**: Node.js with Express, handling robust backend logic and data management.
- **Database**: PostgreSQL, ensuring reliable data storage and complex query handling.


## Data Management

Platform will contain:

- **User Profiles**: Detailed accounts of our users, including their interests and club memberships.
- **Book Club Details**: Information on each book club, including their meetings and focus areas.
- **Forum Posts**: Vibrant discussions and announcements within each club.
- **Event Schedules**: Upcoming events and meetings for clubs.

To support our features, we'll integrate:

- [Open Library API](https://openlibrary.org/developers/api) for accessing an extensive database of books.
- [Google Calendar API](https://developers.google.com/calendar/api/guides/overview) for managing event schedules.


## Database Schema Overview

Below are the detailed schema descriptions and the relationships between them.

### User Schema

- **UserID**: `SERIAL` (Primary Key) - Uniquely identifies each user.
- **Username**: `VARCHAR` (Unique, Not Nullable) - User's chosen unique username.
- **Email**: `VARCHAR` (Unique, Not Nullable) - User's unique email address.
- **Password**: `VARCHAR` (Not Nullable) - User's password, stored in hashed format.
- **JoinDate**: `DATE` (Not Nullable) - The date when the user joined.
- **ProfilePrivacy**: `BOOLEAN` (Not Nullable) - Indicates if the user's profile is public (`true`) or private (`false`).

### Book Club Schema

- **ClubID**: `SERIAL` (Primary Key) - Unique identifier for each book club.
- **ClubName**: `VARCHAR` (Unique, Not Nullable) - Name of the book club, must be unique.
- **Description**: `VARCHAR` (Not Nullable) - Description of the book club.
- **Location**: `VARCHAR` (Nullable) - Physical or virtual location of the club.
- **ClubPrivacy**: `BOOLEAN` (Not Nullable) - Whether the club is public (`true`) or private (`false`).
- **AdminUserID**: `INTEGER` (Unique, Not Nullable, Foreign Key from User Schema) - The user managing the club.
- **CreatedDate**: `DATE` (Not Nullable) - When the club was created.

### Post Schema

- **PostID**: `SERIAL` (Primary Key) - Unique identifier for each post.
- **ClubID**: `INTEGER` (Not Nullable, Foreign Key from Book Club Schema) - Links the post to its respective book club.
- **AuthorUserID**: `INTEGER` (Not Nullable, Foreign Key from User Schema) - The user who authored the post.
- **Content**: `TEXT` (Not Nullable) - The textual content of the post.
- **PostDate**: `DATE` (Not Nullable) - When the post was published.

### Membership Schema

- **MembershipID**: `SERIAL` (Primary Key) - Unique identifier for each membership.
- **UserID**: `INTEGER` (Not Nullable, Foreign Key from User Schema) - Indicates the user's membership in a club.
- **ClubID**: `INTEGER` (Not Nullable, Foreign Key from Book Club Schema) - The club to which the user belongs.
- **JoinDate**: `DATE` (Not Nullable) - The date the user joined the club.

### Representation of Relationships:

- **User to Membership**: Reflects a zero-to-many relationship, where a user can belong to multiple book clubs or none.
- **Book Club to Membership**: Demonstrates a one-to-many relationship, with each club having one to many members, starting with the creator/admin.
- **Book Club to Post**: Indicates a zero-to-many relationship, as clubs can have many posts or none.
- **User to Post**: Shows a zero-to-many relationship, with users potentially creating many posts or none.
- **User to Book Club (via AdminUserID)**: Showcases a zero-or-one-to-one relationship, where users can administrate no more than one book club.


