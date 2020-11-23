const express = require("express");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

const posts = [
  {
    name: "Keenan",
    description: "Description 1",
  },
  {
    name: "Keenan",
    description: "Description 2",
  },
  {
    name: "Keenan",
    description: "Description 3",
  },
  {
    name: "Paul",
    description: "Description 1",
  },
  {
    name: "Paul",
    description: "Description 2",
  },
];

app.get("/posts", validateToken, (request, response) => {
  response.status(200).json({
    posts: posts.filter((post) => post.name === request.user.name),
  });
});

app.post("/login", (request, response) => {
  //
  //authenticate here
  //
  const username = request.body.username;
  const user = {
    name: username,
  };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
  response.status(200).json({
    accessToken: accessToken,
  });
});

function validateToken(request, response, next) {
  const authorizationHeader = request.headers["authorization"];
  const token = authorizationHeader && authorizationHeader.split(" ")[1];

  if (token === null) {
    response.status(401).json({
      message: "Invalid token",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (error, data) => {
    if (error) {
      response.status(401).json({
        message: "Invalid token",
      });
    }
    request.user = data;
    next();
  });
}

app.listen(5000, console.log("Server running on PORT 5000"));
