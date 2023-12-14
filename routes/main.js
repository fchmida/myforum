module.exports = function (app) {

    // Default route
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // About route
    app.get('/about', function (req, res) {
        res.render('about.ejs');
    });

    // User route
    app.get('/user', function (req, res) {
        // Query database to get all users
        let sqlquery = `SELECT * FROM myforum.user;`;

        // Execute SQL query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            res.render('user.ejs', { user: result });
        });
    });

    // Topic route
    app.get('/topic', function (req, res) {
        // Query database to get all topics
        let sqlquery = `SELECT * FROM myforum.topic`;

        // Execute SQL query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            res.render('topic.ejs', { topic: result });
        });
    });

    // Posts route
    app.get('/post', function (req, res) {
        // Query database to get all the posts
        let sqlquery = `SELECT * FROM vw_post`;

        // Execute SQL query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            res.render('post.ejs', { post: result });
        });
    });

    // Search posts route
    app.get('/searchpost', function (req, res) {
        let sqlquery = `SELECT * FROM vw_existingpost;`; 
        res.render('searchpost.ejs');
    });

    // Search result route
    app.get('/search-result', function (req, res) {
        const keyword = req.query.keyword;
        if (!keyword) {
            res.send("Please provide a search keyword.");
        }

        let sqlquery = `SELECT * FROM vw_searchpost WHERE topic_name LIKE ?`;

        db.query(sqlquery, [`%${keyword}%`], (err, result) => {
            if (err) {
                return console.error(err.message);
            }

            if (result.length === 0) {
                res.send("Cannot find the post you are looking for.");
            }

            let response = 'You have searched for: ' + keyword + '. Currently Found:';
            result.forEach((post) => {
                response += ` ${post.text}.`;
            });

            res.send(response);
        });
    });

    // New post route
    app.get('/newpost', function (req, res) {
        res.render('newpost.ejs');
    });

    app.post('/newpost', function (req,res) {
        // saving data in database
        let sqlquery = `SELECT user_id FROM user WHERE username =?;`; //query database to get user id
        // execute sql query
        db.query(sqlquery, [req.body.username], (err, result) => {
          if (err) {
            return console.error(err.message);
          }
            if(result.length==0){
                return res.render('newpost.ejs', { body: req.body, errorMessage: "Can't find that user" });
            }
            user_id = result[0].user_id;
            console.log("user is " + user_id)


        //get topic_id from topic table
          let sqlquery = `SELECT topic_id FROM topic WHERE name = ?;`;
            db.query(sqlquery, [req.body.topic], (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                if(result.length==0){
                    return res.render('newpost.ejs', { body: req.body, errorMessage: "Can't find that topic" });
                }

            topic_id = result[0].topic_id;
            console.log("topic is " + topic_id)

        let sqlquery = `INSERT INTO post (text, user_id, topic_id) VALUES (?,?,?)`
            db.query(sqlquery, [req.body.content, user_id, topic_id], (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
            else
                res.send("New post has been added to the forum");
            });
        
        });
    });
});
};