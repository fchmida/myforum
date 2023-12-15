# Create the database
CREATE DATABASE myforum;
USE myforum;

CREATE USER 'myforumappuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myforum.* TO 'myforumappuser'@'localhost';

SELECT * FROM myforum.membership;

INSERT INTO myforum.membership (user_id, topic_id)
VALUES (1,1), (1,2);

INSERT INTO myforum.membership (user_id, topic_id)
VALUES (2,1);

SELECT user.username, topic.name
FROM membership
JOIN user ON membership.user_id = user.user_id
JOIN topic ON membership.topic_id = topic.topic_id
WHERE membership.user_id = 1 AND membership.topic_id = 1;