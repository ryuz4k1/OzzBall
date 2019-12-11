"use strict";

const express                   = require("express");
const bodyParser                = require("body-parser");
const ejs                       = require("ejs");

// db Connection
const Connection                = require('../src/helpers/connection');

//Controllers
const GameController           = require("../src/controllers/game-controller");
const HomeController           = require("../src/controllers/home-controller");

// Middleware

//Config
const config                    = require('../config.json');



class App {
  constructor() {
      this.app = express();

      this.config();
      this.controllers();

      this.Connection = new Connection().mongoDB();
  }

  config() {
    //db connection
    this.Connection;

    // ... Set app port
    this.app.set("PORT", config.app.port);
    
    // ... Body parser
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json()); //json tipinde gelicek post datalarını karşılar

    // view engine setup
    this.app.engine(".ejs", ejs.__express);
    this.app.set("views", __dirname + "/view");    

    //config
    this.app.set('apiKey', config.apiKey.key);

  }

  controllers(){
    this.app.use("/public", express.static("public"));
    this.app.use("/bower_components", express.static("bower_components"));

    // ... Index Controller
    let router = express.Router();
    this.app.use("/game", router);
    new GameController(router);

    router = express.Router();
    this.app.use("/", router);
    new HomeController(router);
  };

  getApp() {
    return this.app;
  }

}

module.exports = App;
