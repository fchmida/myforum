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

};