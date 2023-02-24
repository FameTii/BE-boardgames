# SUMMARY OF PROJECT 
This is a backend API service.
The project is about reviews of boardgames.
The project features several endpoints, link is provided below for the hosted version.

# LINK TO THE HOSTED VERSION 
`https://fame-boardgame-review-website.onrender.com/api`

# SETTING UP PROJECT LOCALLY
1. Clone the repository using `git clone https://github.com/FameTii/BE-boardgames.git`
2. Change to `BE-boardgames` directory
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