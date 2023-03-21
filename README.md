# SUMMARY OF PROJECT 
This is a backend API service about boardgames
The project features several endpoints, link is provided below for the hosted version.

The project allows users to: 
1. View boardgames categories and their descriptions
2. View reviews for specified boardgames. Users can filter the reviews via category and can sort the reviews based on votes, time created, and comment count. 
3. View comments for boardgames reviews
4. Post comments on boardgames reviews
5. Upvote or downvote reviews
6. View a list of all users currently signed up 
7. Delete comments on reviews

# LINK TO THE HOSTED VERSION 
`https://fame-boardgame-review-website.onrender.com/api`

# SETTING UP PROJECT LOCALLY
1. Fork the repository from  `https://github.com/FameTii/BE-boardgames.git` 
2. Clone the repository 
2. cd to `BE-boardgames` directory
3. Resolve dependencies using `npm i`
4. Set environment variables as shown below
Create 2 files:
.env.development --> into the file add `PGDATABASE=nc_games`
.env.test --> into the file add `PGDATABASE=nc_games_test`
5. Seed database using `npm seed`
6. To run test, use `npm test`

# MINIMUM VERSION
1. Minimum is `v19.3.0` for node.
2. Minimum is `14.6` for psql. 