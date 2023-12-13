module.exports = function(app){

    // Handle our routes

    //Default route
    app.get('/',function(req,res){
    res.render('index.ejs')
    });

}