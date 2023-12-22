CREATE DATABASE myforum;
USE myforum;

CREATE USER 'myforumappuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myforum.* TO 'myforumappuser'@'localhost';

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
)

DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`topic_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
)

DROP TABLE IF EXISTS `membership`;
CREATE TABLE `membership` (
  `user_id` int NOT NULL,
  `topic_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`topic_id`),
  KEY `topic_id_idx` (`topic_id`),
  CONSTRAINT `FK_memb_topic` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`),
  CONSTRAINT `FK_memb_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`))


DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `text` varchar(500) DEFAULT 'empty',
  `user_id` int NOT NULL,
  `topic_id` int NOT NULL,
  PRIMARY KEY (`post_id`),
  UNIQUE KEY `post_id_UNIQUE` (`post_id`),
  KEY `FK_post_user_idx` (`user_id`),
  KEY `FK_post_topic_idx` (`topic_id`),
  CONSTRAINT `FK_post_topic` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`),
  CONSTRAINT `FK_post_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
)

DROP TABLE IF EXISTS `vw_post`;
SET @saved_cs_client     = @@character_set_client;
 1 AS `post_id`,
 1 AS `date`,
 1 AS `text`,
 1 AS `user_id`,
 1 AS `topic_id`,
 1 AS `topic_name`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `vw_existingpost`;
SET @saved_cs_client     = @@character_set_client;
 1 AS `post_id`,
 1 AS `text`,
 1 AS `user_id`,
 1 AS `topic_id`,
 1 AS `user_name`,
 1 AS `topic_name`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `vw_searchpost`;
SET @saved_cs_client     = @@character_set_client;
 1 AS `post_id`,
 1 AS `text`,
 1 AS `user_id`,
 1 AS `topic_id`,
 1 AS `topic_name`*/;
SET character_set_client = @saved_cs_client;