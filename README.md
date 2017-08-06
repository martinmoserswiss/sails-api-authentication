# sails-api-authentication

a [Sails](http://sailsjs.org) application

To install inside the project folder:
npm update
npm install -g sails
npm install


sails new sails-api-authentication
cd sails-api-authentication
sails generate api user
sails generate api token

set migrate: 'safe' in config/models.js
Create AuthenticationController
Create apiAuth policy
Add policies to the config/policies.js file
Add route to the config/routes.js file
Add node-uuid to the dependencies in package.json file.

run: npm imstall and then sails lift

send in postman a new post request to http://localhost:1337/user with json-body:
{
	"name":"User1",
	"email":"user1@gmail.com",
	"password":"123456"
}

send in postman a new get request to http://localhost:1337/getToken with
basicAuth authorization header (username and password)

implement isTokenValid function and add attributes to token model
implement apiAuth policy
create unauthorized.js response file
Update policy config file with the rule for TokenController
