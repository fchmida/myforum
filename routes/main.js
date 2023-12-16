module.exports = function (app) {
    
    // Default route
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // About route
    app.get('/about', function (req, res) {
        res.render('about.ejs');
    });

    // Addtopic route - to display the form
    app.get('/addtopic', function (req, res) {
        res.render('addtopic.ejs');
    });

    // Addtopic route - to handle form submission
    app.post('/addtopic', function (req, res) {
        // Saving data in the database
        let sqlquerySelectUser = `SELECT user_id FROM user WHERE username = ?`;

        db.query(sqlquerySelectUser, [req.body.username], (err, userResult) => {
            if (err) {
                return console.error(err.message);
            }

            if (userResult.length === 0) {
                return res.render('addtopic.ejs', { body: req.body, errorMessage: "Can't find that user" });
            }

            const user_id = userResult[0].user_id;
            console.log("user is " + user_id);

            let sqlqueryInsertTopic = `INSERT INTO topic (name) VALUES (?)`;

            db.query(sqlqueryInsertTopic, [req.body.text], (err, topicResult) => {
                if (err) {
                    return console.error(err.message);
                } else {
                    res.send("New topic has been added to the forum");
                }
            });
        });
    });

        // Membership route
    app.get('/membership', function (req, res) {
        res.render('membership.ejs');
    });

        // Membership check and become member route
        app.post('/membership-check', function (req, res) {
        const username = req.body.username;
        const topicname = req.body.topicname;

        // Fetch the topic_id for the specified topicname
        let getTopicIdQuery = 'SELECT topic_id FROM topic WHERE name = ? LIMIT 1';

        db.query(getTopicIdQuery, [topicname], (topicErr, topicResult) => {
        if (topicErr) {
        return console.error(topicErr.message);
        }

        if (topicResult.length === 0) {
        // Topic not found, handle accordingly (e.g., show an error message)
        res.send('Topic not found.');
        return;
        }

        const topic_id = topicResult[0].topic_id;

        // Check if the user is a member of the topic
        let sqlqueryMemberTopic = `SELECT user.username, topic.name
                            FROM membership
                            JOIN user ON membership.user_id = user.user_id
                            JOIN topic ON membership.topic_id = topic.topic_id
                            WHERE user.username = ? AND topic.name = ?;`;

        db.query(sqlqueryMemberTopic, [username, topicname], (err, result) => {
        if (err) {
        return console.error(err.message);
        }

        if (result.length > 0) {
        // User is already a member, render the 'membership.ejs' view
        res.render('membership.ejs', { username, topicname });
        } else {
        // User is not a member, add them as a member
        let addMembershipQuery = `INSERT INTO membership (user_id, topic_id) 
                                    VALUES (
                                        (SELECT user_id FROM user WHERE username = ? LIMIT 1),
                                        ?
                                    )`;

        db.query(addMembershipQuery, [username, topic_id], (addErr, addResult) => {
            if (addErr) {
                return console.error(addErr.message);
            }

            // Render the 'membership.ejs' view for the newly added member
            res.render('membership.ejs', { username, topicname });
        });
        }
        });
        });
        });


        
    // User route
    app.get('/user', function (req, res) {
        // Query database to get all users
        let sqlquerySelectAllUsers = `SELECT * FROM myforum.user;`;

        // Execute SQL query
        db.query(sqlquerySelectAllUsers, (err, userResult) => {
            if (err) {
                res.redirect('./');
            }
            res.render('user.ejs', { user: userResult });
        });
    });
// User route
app.get('/user/:userId', function (req, res) {
    const userId = req.params.userId;

    // Query database to get user details
    let sqlQuerySelectUser = `SELECT * FROM myforum.user WHERE id = ?;`;

    // Execute SQL query to get user details
    db.query(sqlQuerySelectUser, [userId], (err, userResult) => {
        if (err || userResult.length === 0) {
            // Handle errors or redirect to an error page
            res.redirect('./');
            return;
        }

        // Query database to get posts for the user
        let sqlQuerySelectPost = `SELECT * FROM myforum.post WHERE user_id = ?;`;

        // Execute SQL query to get posts
        db.query(sqlQuerySelectPost, [userId], (err, postResult) => {
            if (err) {
                // Handle errors or redirect to an error page
                res.redirect('./');
                return;
            }

            // Render the user.ejs file with user details and posts
            res.render('user.ejs', { user: userResult, post: postResult });
        });
    });
});


     // Topic route
     app.get('/topic', function (req, res) {
        // Query database to get all topics
        let sqlquerySelectAllTopics = `SELECT * FROM myforum.topic`;

        // Execute SQL query
        db.query(sqlquerySelectAllTopics, (err, topicResult) => {
            if (err) {
                res.redirect('./');
            }
            res.render('topic.ejs', { topic: topicResult });
        });
    });

    // Posts route
    app.get('/post', function (req, res) {
        // Query database to get all posts
        let sqlquerySelectAllPosts = `SELECT * FROM vw_post`;

        // Execute SQL query
        db.query(sqlquerySelectAllPosts, (err, postResult) => {
            if (err) {
                res.redirect('./');
            }
            res.render('post.ejs', { post: postResult });
        });
    });

    // Search posts route
    app.get('/searchpost', function (req, res) {
        let sqlquerySelectAllExistingPosts = `SELECT * FROM vw_existingpost;`;
        res.render('searchpost.ejs');
    });

    // Register route
    app.get('/register', function (req, res) {
    res.render('register.ejs');
    });

    // Registered route
    app.post('/registered', function (req, res) {
    // saving data in the database
    let sqlquery = "INSERT INTO user (username, name, email) VALUES (?,?,?)"; //inserts new data into user table
    // execute sql query
    let newuser = [req.body.username, req.body.name, req.body.email];
    db.query(sqlquery, newuser, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else {
            res.send("Welcome to my forum " + req.body.username);
        }
    });
    });

    // Add post route
app.get('/newpost', function (req, res) {
    // Query database to get all topics
    let sqlquerySelectAllTopics = `SELECT * FROM myforum.topic`;

    // Execute SQL query
    db.query(sqlquerySelectAllTopics, (err, topicResult) => {
        if (err) {
            res.redirect('./'); // Redirect to the home page or handle the error
            return;
        }

        res.render('newpost.ejs', { topics: topicResult });
    });
});

app.post('/newpost', function (req, res) {
    // Saving data in the database
    let sqlquerySelectUser = `SELECT user_id FROM user WHERE username = ?`;

    db.query(sqlquerySelectUser, [req.body.username], (err, userResult) => {
        if (err) {
            return console.error(err.message);
        }

        if (userResult.length === 0) {
            return res.render('newpost.ejs', { body: req.body, errorMessage: "Can't find that user" });
        }

        const user_id = userResult[0].user_id;
        console.log("user is " + user_id);

        // Get topic_id from the topic table
        let sqlquerySelectTopic = `SELECT topic_id FROM topic WHERE name = ?;`;

        db.query(sqlquerySelectTopic, [req.body.topic], (err, topicResult) => {
            if (err) {
                return console.error(err.message);
            }

            if (topicResult.length === 0) {
                return res.render('newpost.ejs', { body: req.body, errorMessage: "Can't find that topic" });
            }

            const topic_id = topicResult[0].topic_id;
            console.log("topic is " + topic_id);

            let sqlqueryInsertPost = `INSERT INTO post (text, user_id, topic_id) VALUES (?,?,?)`;

            db.query(sqlqueryInsertPost, [req.body.content, user_id, topic_id], (err, postResult) => {
                if (err) {
                    return console.error(err.message);
                } else {
                    res.send("New post has been added to the forum");
                }
            });
        });
    });
});

}