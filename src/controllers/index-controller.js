const config = require('../../config.json');

class IndexController{
    constructor(router){
        this.router = router;
        this.routes();
    }

    async index(req, res){
        try {
            return res.render("../views/index.ejs");
        } 
        catch (error) {
            console.log(error);
        }
    }

    async enviroment(req, res, next){
        try {
            const envData = await config[process.env.NODE_ENV || 'development'];
            res.json(envData);
        } 
        catch (error) {
            console.log(error);
        }
    }

    routes(){
        this.router.get("/", this.index.bind(this));
        this.router.get("/enviroment", this.enviroment.bind(this));
    };

};

module.exports = IndexController;