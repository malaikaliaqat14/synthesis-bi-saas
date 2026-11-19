-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: saas
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `saas`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `saas` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `saas`;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Blacklisted Token',6,'add_blacklistedtoken'),(22,'Can change Blacklisted Token',6,'change_blacklistedtoken'),(23,'Can delete Blacklisted Token',6,'delete_blacklistedtoken'),(24,'Can view Blacklisted Token',6,'view_blacklistedtoken'),(25,'Can add Outstanding Token',7,'add_outstandingtoken'),(26,'Can change Outstanding Token',7,'change_outstandingtoken'),(27,'Can delete Outstanding Token',7,'delete_outstandingtoken'),(28,'Can view Outstanding Token',7,'view_outstandingtoken'),(29,'Can add User',8,'add_user'),(30,'Can change User',8,'change_user'),(31,'Can delete User',8,'delete_user'),(32,'Can view User',8,'view_user'),(33,'Can add Company',9,'add_company'),(34,'Can change Company',9,'change_company'),(35,'Can delete Company',9,'delete_company'),(36,'Can view Company',9,'view_company'),(37,'Can add Company Membership',10,'add_companymembership'),(38,'Can change Company Membership',10,'change_companymembership'),(39,'Can delete Company Membership',10,'delete_companymembership'),(40,'Can view Company Membership',10,'view_companymembership'),(41,'Can add Category',11,'add_category'),(42,'Can change Category',11,'change_category'),(43,'Can delete Category',11,'delete_category'),(44,'Can view Category',11,'view_category'),(45,'Can add Customer',12,'add_customer'),(46,'Can change Customer',12,'change_customer'),(47,'Can delete Customer',12,'delete_customer'),(48,'Can view Customer',12,'view_customer'),(49,'Can add Dataset',13,'add_dataset'),(50,'Can change Dataset',13,'change_dataset'),(51,'Can delete Dataset',13,'delete_dataset'),(52,'Can view Dataset',13,'view_dataset'),(53,'Can add Expense',14,'add_expense'),(54,'Can change Expense',14,'change_expense'),(55,'Can delete Expense',14,'delete_expense'),(56,'Can view Expense',14,'view_expense'),(57,'Can add ML Prediction',15,'add_mlprediction'),(58,'Can change ML Prediction',15,'change_mlprediction'),(59,'Can delete ML Prediction',15,'delete_mlprediction'),(60,'Can view ML Prediction',15,'view_mlprediction'),(61,'Can add Order',16,'add_order'),(62,'Can change Order',16,'change_order'),(63,'Can delete Order',16,'delete_order'),(64,'Can view Order',16,'view_order'),(65,'Can add Product',17,'add_product'),(66,'Can change Product',17,'change_product'),(67,'Can delete Product',17,'delete_product'),(68,'Can view Product',17,'view_product'),(69,'Can add Order Item',18,'add_orderitem'),(70,'Can change Order Item',18,'change_orderitem'),(71,'Can delete Order Item',18,'delete_orderitem'),(72,'Can view Order Item',18,'view_orderitem'),(73,'Can add Report',19,'add_report'),(74,'Can change Report',19,'change_report'),(75,'Can delete Report',19,'delete_report'),(76,'Can view Report',19,'view_report'),(77,'Can add Sale',20,'add_sale'),(78,'Can change Sale',20,'change_sale'),(79,'Can delete Sale',20,'delete_sale'),(80,'Can view Sale',20,'view_sale'),(81,'Can add analytics snapshot',21,'add_analyticssnapshot'),(82,'Can change analytics snapshot',21,'change_analyticssnapshot'),(83,'Can delete analytics snapshot',21,'delete_analyticssnapshot'),(84,'Can view analytics snapshot',21,'view_analyticssnapshot');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_users`
--

DROP TABLE IF EXISTS `auth_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token_expires` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_users`
--

LOCK TABLES `auth_users` WRITE;
/*!40000 ALTER TABLE `auth_users` DISABLE KEYS */;
INSERT INTO `auth_users` VALUES (1,'pbkdf2_sha256$720000$U2m44nuxpFxPE2hR0gJXBS$5l83934ohQs7k4g2H1SKL+pRQ06rDlMe6P4X2sg3AQc=',NULL,1,'admin','Admin','User',1,1,'2026-11-16 10:01:53.029582','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,'2026-11-16 10:01:53.775110','2026-11-18 06:29:18.380145'),(2,'pbkdf2_sha256$720000$MsXzc0GFOqjr0By4ULo1Xg$R6s4Bp7mL8K74KBGGqMq5niVRebLRW7jVA1iiUdrelw=','2026-11-16 10:45:39.327568',1,'superadmin','Super','Admin',1,1,'2026-11-16 10:36:48.588139','superadmin@saas.com',NULL,NULL,NULL,NULL,NULL,'2026-11-16 10:36:49.266982','2026-11-16 10:36:49.266982'),(3,'pbkdf2_sha256$720000$GezubvuAHXlcZQrWVgKAlW$HZGgKpfpCvftmySzj3wR5X2Z9pOLSdUWxteLQmveL0Y=',NULL,0,'mikamalaika14','Malaika','Mika',0,1,'2026-11-18 05:53:00.878854','mikamalaika14@gmail.com',NULL,NULL,NULL,NULL,NULL,'2026-11-18 05:53:00.878854','2026-11-18 10:26:08.995039'),(4,'!W2mT4bFg1N3qsHFXGDTCAM7PgaZq9tUZHfVmE4ug',NULL,0,'testadmin','Sarah','Khan',0,1,'2026-11-18 06:01:30.130491','testadmin@fashion.com',NULL,NULL,NULL,'2adf604b70ac431192f2f1ac1f70069c','2026-11-25 06:01:30.279269','2026-11-18 06:01:30.130491','2026-11-18 06:01:30.279269'),(5,'!XS4n5Kq3K8DFmZdrnmeTVu1hswdIOiyKz5o7K6z2',NULL,0,'malaika.shahzadi','malaika','riphah',0,1,'2026-11-18 06:19:13.524581','malaika.shahzadi@riphahsahiwal.edu.pk',NULL,NULL,NULL,'8c7fcd3209d44ad0a59311b729747074','2026-11-25 06:19:13.605697','2026-11-18 06:19:13.524581','2026-11-18 06:19:13.605697'),(7,'!mjdxS96OTEG9c3X52iwJuXKIm1DemPDnRyjRV0bj',NULL,0,'haroon','Haroon','Nawaz',0,1,'2026-11-18 09:09:28.352777','haroon@gmail.com',NULL,NULL,NULL,'aae57d79b5d7432b8599540755e68298','2026-11-25 09:09:28.477779','2026-11-18 09:09:28.352777','2026-11-18 09:09:28.477779'),(8,'!qyzaxHtSBdtvUdYvejgc9ZhKyyMRh0cOrCJuhjt8',NULL,0,'haroonnawaz133','Haroon','Nawaz',0,1,'2026-11-18 09:11:44.150740','haroonnawaz133@gmail.com',NULL,NULL,NULL,'a29bacd1a62c42bb9c9fc02358cd4951','2026-11-25 09:11:44.244366','2026-11-18 09:11:44.150740','2026-11-18 09:11:44.244366');
/*!40000 ALTER TABLE `auth_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_users_groups`
--

DROP TABLE IF EXISTS `auth_users_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_users_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_users_groups_user_id_group_id_64a20d79_uniq` (`user_id`,`group_id`),
  KEY `auth_users_groups_group_id_0f75702f_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_users_groups_group_id_0f75702f_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_users_groups_user_id_70322499_fk_auth_users_id` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_users_groups`
--

LOCK TABLES `auth_users_groups` WRITE;
/*!40000 ALTER TABLE `auth_users_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_users_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_users_user_permissions`
--

DROP TABLE IF EXISTS `auth_users_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_users_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_users_user_permissions_user_id_permission_id_6cc07159_uniq` (`user_id`,`permission_id`),
  KEY `auth_users_user_perm_permission_id_ed9ffa4c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_users_user_perm_permission_id_ed9ffa4c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_users_user_permissions_user_id_9a4c5204_fk_auth_users_id` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_users_user_permissions`
--

LOCK TABLES `auth_users_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_users_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_users_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_analytics_snapshots`
--

DROP TABLE IF EXISTS `business_analytics_snapshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_analytics_snapshots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `snapshot_date` date NOT NULL,
  `total_revenue` decimal(16,2) NOT NULL,
  `total_orders` int NOT NULL,
  `total_customers` int NOT NULL,
  `total_expenses` decimal(16,2) NOT NULL,
  `net_profit` decimal(16,2) NOT NULL,
  `aov` decimal(12,2) NOT NULL,
  `metrics_json` json NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_analytics_snaps_company_id_snapshot_date_daca8c77_uniq` (`company_id`,`snapshot_date`),
  CONSTRAINT `business_analytics_snapshots_company_id_1e7f788f_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_analytics_snapshots`
--

LOCK TABLES `business_analytics_snapshots` WRITE;
/*!40000 ALTER TABLE `business_analytics_snapshots` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_analytics_snapshots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_categories`
--

DROP TABLE IF EXISTS `business_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_categories_company_id_name_b353eac7_uniq` (`company_id`,`name`),
  CONSTRAINT `business_categories_company_id_5bb8683b_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_categories`
--

LOCK TABLES `business_categories` WRITE;
/*!40000 ALTER TABLE `business_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_customers`
--

DROP TABLE IF EXISTS `business_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `business_cu_company_c6ea1b_idx` (`company_id`,`email`),
  KEY `business_cu_company_e66124_idx` (`company_id`,`region`),
  KEY `business_cu_company_0423cf_idx` (`company_id`,`is_active`),
  KEY `business_cu_company_ef1e87_idx` (`company_id`,`created_at`),
  CONSTRAINT `business_customers_company_id_a637a208_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_customers`
--

LOCK TABLES `business_customers` WRITE;
/*!40000 ALTER TABLE `business_customers` DISABLE KEYS */;
INSERT INTO `business_customers` VALUES (86,'Ayesha Khan','ayesha.khan@gmail.com','','','Lahore','','Pakistan','','Punjab',1,'2026-11-19 06:23:22.392863','2026-11-19 06:23:22.392863','80a925c12c624a58aad46e0b4d30af2a'),(87,'Zainab Fatima','zainab.f@yahoo.com','','','Karachi','','Pakistan','','Sindh',1,'2026-11-19 06:23:22.447317','2026-11-19 06:23:22.447408','80a925c12c624a58aad46e0b4d30af2a'),(88,'Maryam Nawaz','maryam.nawaz88@outlook.com','','','Islamabad','','Pakistan','','Islamabad Capital',1,'2026-11-19 06:23:22.452523','2026-11-19 06:23:22.452523','80a925c12c624a58aad46e0b4d30af2a'),(89,'Hira Mani','hira.mani@gmail.com','','','Faisalabad','','Pakistan','','Punjab',1,'2026-11-19 06:23:22.485953','2026-11-19 06:23:22.485953','80a925c12c624a58aad46e0b4d30af2a'),(90,'Sana Mir','sana.mir@hotmail.com','','','Rawalpindi','','Pakistan','','Punjab',1,'2026-11-19 06:23:22.491504','2026-11-19 06:23:22.491573','80a925c12c624a58aad46e0b4d30af2a'),(91,'Mahnoor Baloch','mahnoor.b@gmail.com','','','Peshawar','','Pakistan','','Khyber Pakhtunkhwa',1,'2026-11-19 06:23:22.496355','2026-11-19 06:23:22.496397','80a925c12c624a58aad46e0b4d30af2a'),(92,'Alizeh Shah','alizeh.shah@gmail.com','','','Multan','','Pakistan','','Punjab',1,'2026-11-19 06:23:22.500372','2026-11-19 06:23:22.500372','80a925c12c624a58aad46e0b4d30af2a'),(93,'Kinza Hashmi','kinza.h@yahoo.com','','','Sialkot','','Pakistan','','Punjab',1,'2026-11-19 06:23:22.504341','2026-11-19 06:23:22.504341','80a925c12c624a58aad46e0b4d30af2a'),(94,'Sadia Imam','sadia.imam@gmail.com','','','Gujranwala','','Pakistan','','Punjab',1,'2026-11-19 06:23:22.508345','2026-11-19 06:23:22.508345','80a925c12c624a58aad46e0b4d30af2a'),(95,'Momina Mustehsan','momina.m@gmail.com','','','Quetta','','Pakistan','','Balochistan',1,'2026-11-19 06:23:22.884619','2026-11-19 06:23:22.884619','80a925c12c624a58aad46e0b4d30af2a'),(96,'Neelam Muneer','neelam.m@outlook.com','','','Hyderabad','','Pakistan','','Sindh',1,'2026-11-19 06:23:23.447552','2026-11-19 06:23:23.447552','80a925c12c624a58aad46e0b4d30af2a'),(97,'Mawra Hocane','mawra.h@gmail.com','','','Bahawalpur','','Pakistan','','Punjab',1,'2026-11-19 06:23:23.454033','2026-11-19 06:23:23.454592','80a925c12c624a58aad46e0b4d30af2a'),(98,'Urwa Hocane','urwa.h@hotmail.com','','','Sargodha','','Pakistan','','Punjab',1,'2026-11-19 06:23:23.461747','2026-11-19 06:23:23.461747','80a925c12c624a58aad46e0b4d30af2a'),(99,'Sajal Aly','sajal.aly@gmail.com','','','Abbottabad','','Pakistan','','Khyber Pakhtunkhwa',1,'2026-11-19 06:23:23.468592','2026-11-19 06:23:23.468592','80a925c12c624a58aad46e0b4d30af2a'),(100,'Yumna Zaidi','yumna.z@gmail.com','','','Sukkur','','Pakistan','','Sindh',1,'2026-11-19 06:23:23.472300','2026-11-19 06:23:23.472300','80a925c12c624a58aad46e0b4d30af2a'),(101,'Sarah Khan','sarah.khan@yahoo.com','','','Gujrat','','Pakistan','','Punjab',1,'2026-11-19 06:23:23.476928','2026-11-19 06:23:23.476928','80a925c12c624a58aad46e0b4d30af2a'),(102,'Iqra Aziz','iqra.aziz@gmail.com','','','Mardan','','Pakistan','','Khyber Pakhtunkhwa',1,'2026-11-19 06:23:23.516382','2026-11-19 06:23:23.516382','80a925c12c624a58aad46e0b4d30af2a'),(103,'Ayeza Khan','ayeza.khan@gmail.com','','','Sahiwal','','Pakistan','','Punjab',1,'2026-11-19 06:23:23.521554','2026-11-19 06:23:23.521554','80a925c12c624a58aad46e0b4d30af2a'),(104,'Maya Ali','maya.ali@outlook.com','','','Jhelum','','Pakistan','','Punjab',1,'2026-11-19 06:23:23.525790','2026-11-19 06:23:23.525790','80a925c12c624a58aad46e0b4d30af2a'),(105,'Hania Aamir','hania.aamir@gmail.com','','','Rahim Yar Khan','','Pakistan','','Punjab',1,'2026-11-19 06:23:23.530049','2026-11-19 06:23:23.530049','80a925c12c624a58aad46e0b4d30af2a');
/*!40000 ALTER TABLE `business_customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_datasets`
--

DROP TABLE IF EXISTS `business_datasets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_datasets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `row_count` int NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `error_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary_json` json NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_datasets_company_id_96761c4a_fk_companies_id` (`company_id`),
  KEY `business_datasets_created_by_id_5a058c11_fk_auth_users_id` (`created_by_id`),
  CONSTRAINT `business_datasets_company_id_96761c4a_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `business_datasets_created_by_id_5a058c11_fk_auth_users_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_datasets`
--

LOCK TABLES `business_datasets` WRITE;
/*!40000 ALTER TABLE `business_datasets` DISABLE KEYS */;
INSERT INTO `business_datasets` VALUES (7,'pakistani_female_formal_dresses_orders.csv','datasets/2026/11/pakistani_female_formal_dresses_orders_x19ds7Q.csv','CSV',20,'COMPLETED','','{\"initial_rows\": 20, \"imported_rows\": 20, \"total_revenue\": 802000.0, \"created_orders\": 20, \"created_products\": 20, \"created_customers\": 20}','2026-11-19 06:23:22.262234','80a925c12c624a58aad46e0b4d30af2a',3);
/*!40000 ALTER TABLE `business_datasets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_expenses`
--

DROP TABLE IF EXISTS `business_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_expenses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `expense_date` date NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_ex_company_c3d652_idx` (`company_id`,`expense_date`),
  KEY `business_ex_company_bbe3c5_idx` (`company_id`,`category`),
  KEY `business_expenses_created_by_id_5ab8aa84_fk_auth_users_id` (`created_by_id`),
  CONSTRAINT `business_expenses_company_id_119e29ac_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `business_expenses_created_by_id_5ab8aa84_fk_auth_users_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_expenses`
--

LOCK TABLES `business_expenses` WRITE;
/*!40000 ALTER TABLE `business_expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_ml_predictions`
--

DROP TABLE IF EXISTS `business_ml_predictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_ml_predictions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `model_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_label` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prediction_value` double DEFAULT NULL,
  `probability` double DEFAULT NULL,
  `risk_category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` json NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `business_ml_company_7fba71_idx` (`company_id`,`model_type`),
  KEY `business_ml_company_7803b6_idx` (`company_id`,`created_at`),
  CONSTRAINT `business_ml_predictions_company_id_6f698de3_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_ml_predictions`
--

LOCK TABLES `business_ml_predictions` WRITE;
/*!40000 ALTER TABLE `business_ml_predictions` DISABLE KEYS */;
INSERT INTO `business_ml_predictions` VALUES (43,'SALES_FORECAST','forecast-7d','7-Day Revenue Forecast',21688.2,NULL,NULL,'{\"metrics\": {\"R2\": 0.2019, \"MAE\": 1959.74, \"RMSE\": 2633.49}, \"forecast\": [{\"date\": \"2026-11-22\", \"predicted_revenue\": 6254.49}, {\"date\": \"2026-11-23\", \"predicted_revenue\": 5324.27}, {\"date\": \"2026-11-24\", \"predicted_revenue\": 338.15}, {\"date\": \"2026-11-25\", \"predicted_revenue\": 5952.47}, {\"date\": \"2026-11-26\", \"predicted_revenue\": 201.96}, {\"date\": \"2026-11-27\", \"predicted_revenue\": 0.0}, {\"date\": \"2026-11-28\", \"predicted_revenue\": 3616.86}], \"model_name\": \"Ridge Regression\", \"historical_series\": [{\"date\": \"2026-11-01\", \"revenue\": 45000.0}, {\"date\": \"2026-11-02\", \"revenue\": 32000.0}, {\"date\": \"2026-11-03\", \"revenue\": 57000.0}, {\"date\": \"2026-11-04\", \"revenue\": 22000.0}, {\"date\": \"2026-11-05\", \"revenue\": 38500.0}, {\"date\": \"2026-11-06\", \"revenue\": 48000.0}, {\"date\": \"2026-11-07\", \"revenue\": 26000.0}, {\"date\": \"2026-11-08\", \"revenue\": 39000.0}, {\"date\": \"2026-11-09\", \"revenue\": 24500.0}, {\"date\": \"2026-11-10\", \"revenue\": 55000.0}, {\"date\": \"2026-11-11\", \"revenue\": 21000.0}, {\"date\": \"2026-11-12\", \"revenue\": 55000.0}, {\"date\": \"2026-11-13\", \"revenue\": 62000.0}, {\"date\": \"2026-11-14\", \"revenue\": 36000.0}, {\"date\": \"2026-11-15\", \"revenue\": 29000.0}, {\"date\": \"2026-11-16\", \"revenue\": 37000.0}, {\"date\": \"2026-11-17\", \"revenue\": 58000.0}, {\"date\": \"2026-11-18\", \"revenue\": 31000.0}, {\"date\": \"2026-11-19\", \"revenue\": 34000.0}, {\"date\": \"2026-11-20\", \"revenue\": 52000.0}, {\"date\": \"2026-11-21\", \"revenue\": 194500.0}], \"projected_revenue\": 21688.2}','2026-11-19 05:34:57.105276','80a925c12c624a58aad46e0b4d30af2a'),(44,'CHURN_RISK','65','Hania Aamir',NULL,100,'High Risk','{\"email\": \"hania.aamir@gmail.com\", \"region\": \"Punjab\", \"customer_id\": 65, \"total_orders\": 1, \"customer_name\": \"Hania Aamir\", \"risk_category\": \"High Risk\", \"total_spending\": 52000.0, \"churn_probability\": 100.0, \"days_since_last_order\": -1}','2026-11-19 05:57:06.410503','80a925c12c624a58aad46e0b4d30af2a'),(45,'CHURN_RISK','64','Maya Ali',NULL,100,'High Risk','{\"email\": \"maya.ali@outlook.com\", \"region\": \"Punjab\", \"customer_id\": 64, \"total_orders\": 1, \"customer_name\": \"Maya Ali\", \"risk_category\": \"High Risk\", \"total_spending\": 34000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 0}','2026-11-19 05:57:06.726947','80a925c12c624a58aad46e0b4d30af2a'),(46,'CHURN_RISK','63','Ayeza Khan',NULL,100,'High Risk','{\"email\": \"ayeza.khan@gmail.com\", \"region\": \"Punjab\", \"customer_id\": 63, \"total_orders\": 1, \"customer_name\": \"Ayeza Khan\", \"risk_category\": \"High Risk\", \"total_spending\": 31000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 1}','2026-11-19 05:57:06.964604','80a925c12c624a58aad46e0b4d30af2a'),(47,'CHURN_RISK','62','Iqra Aziz',NULL,100,'High Risk','{\"email\": \"iqra.aziz@gmail.com\", \"region\": \"Khyber Pakhtunkhwa\", \"customer_id\": 62, \"total_orders\": 1, \"customer_name\": \"Iqra Aziz\", \"risk_category\": \"High Risk\", \"total_spending\": 58000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 2}','2026-11-19 05:57:07.708948','80a925c12c624a58aad46e0b4d30af2a'),(48,'CHURN_RISK','61','Sarah Khan',NULL,100,'High Risk','{\"email\": \"sarah.khan@yahoo.com\", \"region\": \"Punjab\", \"customer_id\": 61, \"total_orders\": 1, \"customer_name\": \"Sarah Khan\", \"risk_category\": \"High Risk\", \"total_spending\": 37000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 3}','2026-11-19 05:57:07.966436','80a925c12c624a58aad46e0b4d30af2a'),(49,'CHURN_RISK','60','Yumna Zaidi',NULL,100,'High Risk','{\"email\": \"yumna.z@gmail.com\", \"region\": \"Sindh\", \"customer_id\": 60, \"total_orders\": 1, \"customer_name\": \"Yumna Zaidi\", \"risk_category\": \"High Risk\", \"total_spending\": 29000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 4}','2026-11-19 05:57:08.086919','80a925c12c624a58aad46e0b4d30af2a'),(50,'CHURN_RISK','59','Sajal Aly',NULL,100,'High Risk','{\"email\": \"sajal.aly@gmail.com\", \"region\": \"Khyber Pakhtunkhwa\", \"customer_id\": 59, \"total_orders\": 1, \"customer_name\": \"Sajal Aly\", \"risk_category\": \"High Risk\", \"total_spending\": 36000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 5}','2026-11-19 05:57:08.364601','80a925c12c624a58aad46e0b4d30af2a'),(51,'CHURN_RISK','58','Urwa Hocane',NULL,100,'High Risk','{\"email\": \"urwa.h@hotmail.com\", \"region\": \"Punjab\", \"customer_id\": 58, \"total_orders\": 1, \"customer_name\": \"Urwa Hocane\", \"risk_category\": \"High Risk\", \"total_spending\": 62000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 6}','2026-11-19 05:57:08.562990','80a925c12c624a58aad46e0b4d30af2a'),(52,'CHURN_RISK','57','Mawra Hocane',NULL,100,'High Risk','{\"email\": \"mawra.h@gmail.com\", \"region\": \"Punjab\", \"customer_id\": 57, \"total_orders\": 1, \"customer_name\": \"Mawra Hocane\", \"risk_category\": \"High Risk\", \"total_spending\": 55000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 7}','2026-11-19 05:57:08.781196','80a925c12c624a58aad46e0b4d30af2a'),(53,'SALES_FORECAST','forecast-14d','14-Day Revenue Forecast',28344.11,NULL,NULL,'{\"metrics\": {\"R2\": 0.2019, \"MAE\": 1959.74, \"RMSE\": 2633.49}, \"forecast\": [{\"date\": \"2026-11-22\", \"predicted_revenue\": 6254.49}, {\"date\": \"2026-11-23\", \"predicted_revenue\": 5324.27}, {\"date\": \"2026-11-24\", \"predicted_revenue\": 338.15}, {\"date\": \"2026-11-25\", \"predicted_revenue\": 5952.47}, {\"date\": \"2026-11-26\", \"predicted_revenue\": 201.96}, {\"date\": \"2026-11-27\", \"predicted_revenue\": 0.0}, {\"date\": \"2026-11-28\", \"predicted_revenue\": 3616.86}, {\"date\": \"2026-11-29\", \"predicted_revenue\": 331.19}, {\"date\": \"2026-11-30\", \"predicted_revenue\": 1958.72}, {\"date\": \"2026-12-01\", \"predicted_revenue\": 0.0}, {\"date\": \"2026-12-02\", \"predicted_revenue\": 2817.11}, {\"date\": \"2026-12-03\", \"predicted_revenue\": 532.39}, {\"date\": \"2026-12-04\", \"predicted_revenue\": 1016.5}, {\"date\": \"2026-12-05\", \"predicted_revenue\": 0.0}], \"model_name\": \"Ridge Regression\", \"historical_series\": [{\"date\": \"2026-11-01\", \"revenue\": 45000.0}, {\"date\": \"2026-11-02\", \"revenue\": 32000.0}, {\"date\": \"2026-11-03\", \"revenue\": 57000.0}, {\"date\": \"2026-11-04\", \"revenue\": 22000.0}, {\"date\": \"2026-11-05\", \"revenue\": 38500.0}, {\"date\": \"2026-11-06\", \"revenue\": 48000.0}, {\"date\": \"2026-11-07\", \"revenue\": 26000.0}, {\"date\": \"2026-11-08\", \"revenue\": 39000.0}, {\"date\": \"2026-11-09\", \"revenue\": 24500.0}, {\"date\": \"2026-11-10\", \"revenue\": 55000.0}, {\"date\": \"2026-11-11\", \"revenue\": 21000.0}, {\"date\": \"2026-11-12\", \"revenue\": 55000.0}, {\"date\": \"2026-11-13\", \"revenue\": 62000.0}, {\"date\": \"2026-11-14\", \"revenue\": 36000.0}, {\"date\": \"2026-11-15\", \"revenue\": 29000.0}, {\"date\": \"2026-11-16\", \"revenue\": 37000.0}, {\"date\": \"2026-11-17\", \"revenue\": 58000.0}, {\"date\": \"2026-11-18\", \"revenue\": 31000.0}, {\"date\": \"2026-11-19\", \"revenue\": 34000.0}, {\"date\": \"2026-11-20\", \"revenue\": 52000.0}, {\"date\": \"2026-11-21\", \"revenue\": 194500.0}], \"projected_revenue\": 28344.11}','2026-11-19 05:57:08.987042','80a925c12c624a58aad46e0b4d30af2a'),(54,'CHURN_RISK','56','Neelam Muneer',NULL,100,'High Risk','{\"email\": \"neelam.m@outlook.com\", \"region\": \"Sindh\", \"customer_id\": 56, \"total_orders\": 1, \"customer_name\": \"Neelam Muneer\", \"risk_category\": \"High Risk\", \"total_spending\": 21000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 8}','2026-11-19 05:57:08.988041','80a925c12c624a58aad46e0b4d30af2a'),(55,'SALES_FORECAST','forecast-30d','30-Day Revenue Forecast',80931.57,NULL,NULL,'{\"metrics\": {\"R2\": 0.2019, \"MAE\": 1959.74, \"RMSE\": 2633.49}, \"forecast\": [{\"date\": \"2026-11-22\", \"predicted_revenue\": 6254.49}, {\"date\": \"2026-11-23\", \"predicted_revenue\": 5324.27}, {\"date\": \"2026-11-24\", \"predicted_revenue\": 338.15}, {\"date\": \"2026-11-25\", \"predicted_revenue\": 5952.47}, {\"date\": \"2026-11-26\", \"predicted_revenue\": 201.96}, {\"date\": \"2026-11-27\", \"predicted_revenue\": 0.0}, {\"date\": \"2026-11-28\", \"predicted_revenue\": 3616.86}, {\"date\": \"2026-11-29\", \"predicted_revenue\": 331.19}, {\"date\": \"2026-11-30\", \"predicted_revenue\": 1958.72}, {\"date\": \"2026-12-01\", \"predicted_revenue\": 0.0}, {\"date\": \"2026-12-02\", \"predicted_revenue\": 2817.11}, {\"date\": \"2026-12-03\", \"predicted_revenue\": 532.39}, {\"date\": \"2026-12-04\", \"predicted_revenue\": 1016.5}, {\"date\": \"2026-12-05\", \"predicted_revenue\": 0.0}, {\"date\": \"2026-12-06\", \"predicted_revenue\": 712.17}, {\"date\": \"2026-12-07\", \"predicted_revenue\": 5646.07}, {\"date\": \"2026-12-08\", \"predicted_revenue\": 5263.92}, {\"date\": \"2026-12-09\", \"predicted_revenue\": 5660.05}, {\"date\": \"2026-12-10\", \"predicted_revenue\": 3869.39}, {\"date\": \"2026-12-11\", \"predicted_revenue\": 6189.35}, {\"date\": \"2026-12-12\", \"predicted_revenue\": 358.79}, {\"date\": \"2026-12-13\", \"predicted_revenue\": 0.0}, {\"date\": \"2026-12-14\", \"predicted_revenue\": 4790.01}, {\"date\": \"2026-12-15\", \"predicted_revenue\": 5573.47}, {\"date\": \"2026-12-16\", \"predicted_revenue\": 4623.39}, {\"date\": \"2026-12-17\", \"predicted_revenue\": 3120.76}, {\"date\": \"2026-12-18\", \"predicted_revenue\": 4912.43}, {\"date\": \"2026-12-19\", \"predicted_revenue\": 1765.61}, {\"date\": \"2026-12-20\", \"predicted_revenue\": 102.05}, {\"date\": \"2026-12-21\", \"predicted_revenue\": 0.0}], \"model_name\": \"Ridge Regression\", \"historical_series\": [{\"date\": \"2026-11-01\", \"revenue\": 45000.0}, {\"date\": \"2026-11-02\", \"revenue\": 32000.0}, {\"date\": \"2026-11-03\", \"revenue\": 57000.0}, {\"date\": \"2026-11-04\", \"revenue\": 22000.0}, {\"date\": \"2026-11-05\", \"revenue\": 38500.0}, {\"date\": \"2026-11-06\", \"revenue\": 48000.0}, {\"date\": \"2026-11-07\", \"revenue\": 26000.0}, {\"date\": \"2026-11-08\", \"revenue\": 39000.0}, {\"date\": \"2026-11-09\", \"revenue\": 24500.0}, {\"date\": \"2026-11-10\", \"revenue\": 55000.0}, {\"date\": \"2026-11-11\", \"revenue\": 21000.0}, {\"date\": \"2026-11-12\", \"revenue\": 55000.0}, {\"date\": \"2026-11-13\", \"revenue\": 62000.0}, {\"date\": \"2026-11-14\", \"revenue\": 36000.0}, {\"date\": \"2026-11-15\", \"revenue\": 29000.0}, {\"date\": \"2026-11-16\", \"revenue\": 37000.0}, {\"date\": \"2026-11-17\", \"revenue\": 58000.0}, {\"date\": \"2026-11-18\", \"revenue\": 31000.0}, {\"date\": \"2026-11-19\", \"revenue\": 34000.0}, {\"date\": \"2026-11-20\", \"revenue\": 52000.0}, {\"date\": \"2026-11-21\", \"revenue\": 194500.0}], \"projected_revenue\": 80931.57}','2026-11-19 06:07:09.789813','80a925c12c624a58aad46e0b4d30af2a'),(56,'CHURN_RISK','85','Hania Aamir',NULL,100,'High Risk','{\"email\": \"hania.aamir@gmail.com\", \"region\": \"Punjab\", \"customer_id\": 85, \"total_orders\": 1, \"customer_name\": \"Hania Aamir\", \"risk_category\": \"High Risk\", \"total_spending\": 52000.0, \"churn_probability\": 100.0, \"days_since_last_order\": -1}','2026-11-19 06:15:28.697116','80a925c12c624a58aad46e0b4d30af2a'),(57,'CHURN_RISK','84','Maya Ali',NULL,100,'High Risk','{\"email\": \"maya.ali@outlook.com\", \"region\": \"Punjab\", \"customer_id\": 84, \"total_orders\": 1, \"customer_name\": \"Maya Ali\", \"risk_category\": \"High Risk\", \"total_spending\": 34000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 0}','2026-11-19 06:15:28.847536','80a925c12c624a58aad46e0b4d30af2a'),(58,'CHURN_RISK','83','Ayeza Khan',NULL,100,'High Risk','{\"email\": \"ayeza.khan@gmail.com\", \"region\": \"Punjab\", \"customer_id\": 83, \"total_orders\": 1, \"customer_name\": \"Ayeza Khan\", \"risk_category\": \"High Risk\", \"total_spending\": 31000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 1}','2026-11-19 06:15:28.965348','80a925c12c624a58aad46e0b4d30af2a'),(59,'CHURN_RISK','82','Iqra Aziz',NULL,100,'High Risk','{\"email\": \"iqra.aziz@gmail.com\", \"region\": \"Khyber Pakhtunkhwa\", \"customer_id\": 82, \"total_orders\": 1, \"customer_name\": \"Iqra Aziz\", \"risk_category\": \"High Risk\", \"total_spending\": 58000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 2}','2026-11-19 06:15:29.193071','80a925c12c624a58aad46e0b4d30af2a'),(60,'CHURN_RISK','81','Sarah Khan',NULL,100,'High Risk','{\"email\": \"sarah.khan@yahoo.com\", \"region\": \"Punjab\", \"customer_id\": 81, \"total_orders\": 1, \"customer_name\": \"Sarah Khan\", \"risk_category\": \"High Risk\", \"total_spending\": 37000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 3}','2026-11-19 06:15:29.249438','80a925c12c624a58aad46e0b4d30af2a'),(61,'CHURN_RISK','80','Yumna Zaidi',NULL,100,'High Risk','{\"email\": \"yumna.z@gmail.com\", \"region\": \"Sindh\", \"customer_id\": 80, \"total_orders\": 1, \"customer_name\": \"Yumna Zaidi\", \"risk_category\": \"High Risk\", \"total_spending\": 29000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 4}','2026-11-19 06:15:29.522290','80a925c12c624a58aad46e0b4d30af2a'),(62,'CHURN_RISK','79','Sajal Aly',NULL,100,'High Risk','{\"email\": \"sajal.aly@gmail.com\", \"region\": \"Khyber Pakhtunkhwa\", \"customer_id\": 79, \"total_orders\": 1, \"customer_name\": \"Sajal Aly\", \"risk_category\": \"High Risk\", \"total_spending\": 36000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 5}','2026-11-19 06:15:29.782863','80a925c12c624a58aad46e0b4d30af2a'),(63,'CHURN_RISK','78','Urwa Hocane',NULL,100,'High Risk','{\"email\": \"urwa.h@hotmail.com\", \"region\": \"Punjab\", \"customer_id\": 78, \"total_orders\": 1, \"customer_name\": \"Urwa Hocane\", \"risk_category\": \"High Risk\", \"total_spending\": 62000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 6}','2026-11-19 06:15:30.121919','80a925c12c624a58aad46e0b4d30af2a'),(64,'CHURN_RISK','77','Mawra Hocane',NULL,100,'High Risk','{\"email\": \"mawra.h@gmail.com\", \"region\": \"Punjab\", \"customer_id\": 77, \"total_orders\": 1, \"customer_name\": \"Mawra Hocane\", \"risk_category\": \"High Risk\", \"total_spending\": 55000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 7}','2026-11-19 06:15:30.278137','80a925c12c624a58aad46e0b4d30af2a'),(65,'CHURN_RISK','76','Neelam Muneer',NULL,100,'High Risk','{\"email\": \"neelam.m@outlook.com\", \"region\": \"Sindh\", \"customer_id\": 76, \"total_orders\": 1, \"customer_name\": \"Neelam Muneer\", \"risk_category\": \"High Risk\", \"total_spending\": 21000.0, \"churn_probability\": 100.0, \"days_since_last_order\": 8}','2026-11-19 06:15:30.335481','80a925c12c624a58aad46e0b4d30af2a');
/*!40000 ALTER TABLE `business_ml_predictions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_order_items`
--

DROP TABLE IF EXISTS `business_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `subtotal` decimal(14,2) NOT NULL,
  `order_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `business_order_items_order_id_8f07bf62_fk_business_orders_id` (`order_id`),
  KEY `business_order_items_product_id_e71bda6d_fk_business_products_id` (`product_id`),
  CONSTRAINT `business_order_items_order_id_8f07bf62_fk_business_orders_id` FOREIGN KEY (`order_id`) REFERENCES `business_orders` (`id`),
  CONSTRAINT `business_order_items_product_id_e71bda6d_fk_business_products_id` FOREIGN KEY (`product_id`) REFERENCES `business_products` (`id`),
  CONSTRAINT `business_order_items_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2458 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_order_items`
--

LOCK TABLES `business_order_items` WRITE;
/*!40000 ALTER TABLE `business_order_items` DISABLE KEYS */;
INSERT INTO `business_order_items` VALUES (2428,1,45000.00,45000.00,'7d453c65e0454fb7b22103e3978c64f4',94),(2429,1,32000.00,32000.00,'27447203edde4784be373fc0290c7a95',95),(2430,2,28500.00,57000.00,'6b52678e14b648a586dee0c602a2fe89',96),(2431,1,22000.00,22000.00,'8e04850c5f4745898b5b1c7b04721471',97),(2432,1,38500.00,38500.00,'bbb9cf036a5a4f81b75e8bbb742540fe',98),(2433,1,48000.00,48000.00,'c19aff46281b49b8ac1dff120c480624',99),(2434,1,26000.00,26000.00,'6d1795cea99a4fc390ef4d979201a1d9',100),(2435,2,19500.00,39000.00,'e979a724317947978486fe93c6c7532a',101),(2436,1,24500.00,24500.00,'7cbc3b4230974b14babd299473e8c1aa',102),(2437,1,55000.00,55000.00,'10097e7cbd9d413899c234a237870595',103),(2438,1,21000.00,21000.00,'61c8beecb9f94b8ea9f55e613056d0a7',104),(2439,2,27500.00,55000.00,'dd4f55ef95534188b6f266d303ffb886',105),(2440,1,62000.00,62000.00,'e90dccef295649e3b8f0ca5671163652',106),(2441,1,36000.00,36000.00,'53a44336bb194be2aba6d7229db11fa4',107),(2442,1,29000.00,29000.00,'48372efa4b2541daad503f3e401b1cda',108),(2443,2,18500.00,37000.00,'72999ae23c384152b3d4baeaea789564',109),(2444,1,58000.00,58000.00,'8008df03d73649ed82e279a1fe9fda5a',110),(2445,1,31000.00,31000.00,'1c86411dccda4e539ff6af8b826c8fe2',111),(2446,1,34000.00,34000.00,'01e409be790a489e855513615de8a427',112),(2447,1,52000.00,52000.00,'63cd5335ee694f84b23ddac9e78b3ecc',113);
/*!40000 ALTER TABLE `business_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_orders`
--

DROP TABLE IF EXISTS `business_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_orders` (
  `id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_date` datetime(6) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(14,2) NOT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  `dataset_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_orders_company_id_order_number_9e5f8c95_uniq` (`company_id`,`order_number`),
  KEY `business_or_company_bf982b_idx` (`company_id`,`order_date`),
  KEY `business_or_company_d0ce51_idx` (`company_id`,`status`),
  KEY `business_or_company_ad39a4_idx` (`company_id`,`customer_id`),
  KEY `business_orders_created_by_id_d3cc2ceb_fk_auth_users_id` (`created_by_id`),
  KEY `business_orders_customer_id_95b18d1d_fk_business_customers_id` (`customer_id`),
  KEY `business_orders_dataset_id_84eff055_fk_business_datasets_id` (`dataset_id`),
  CONSTRAINT `business_orders_company_id_f76c8ec8_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `business_orders_created_by_id_d3cc2ceb_fk_auth_users_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_users` (`id`),
  CONSTRAINT `business_orders_customer_id_95b18d1d_fk_business_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `business_customers` (`id`),
  CONSTRAINT `business_orders_dataset_id_84eff055_fk_business_datasets_id` FOREIGN KEY (`dataset_id`) REFERENCES `business_datasets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_orders`
--

LOCK TABLES `business_orders` WRITE;
/*!40000 ALTER TABLE `business_orders` DISABLE KEYS */;
INSERT INTO `business_orders` VALUES ('01e409be790a489e855513615de8a427','ORD-1795046400-19','2026-11-19 00:00:00.000000','COMPLETED',34000.00,'','2026-11-19 06:23:23.527981','2026-11-19 06:23:23.527981','80a925c12c624a58aad46e0b4d30af2a',3,104,7),('10097e7cbd9d413899c234a237870595','ORD-1794268800-10','2026-11-10 00:00:00.000000','COMPLETED',55000.00,'','2026-11-19 06:23:23.141666','2026-11-19 06:23:23.141666','80a925c12c624a58aad46e0b4d30af2a',3,95,7),('1c86411dccda4e539ff6af8b826c8fe2','ORD-1794960000-18','2026-11-18 00:00:00.000000','COMPLETED',31000.00,'','2026-11-19 06:23:23.523585','2026-11-19 06:23:23.523585','80a925c12c624a58aad46e0b4d30af2a',3,103,7),('27447203edde4784be373fc0290c7a95','ORD-1793577600-2','2026-11-02 00:00:00.000000','COMPLETED',32000.00,'','2026-11-19 06:23:22.449769','2026-11-19 06:23:22.449769','80a925c12c624a58aad46e0b4d30af2a',3,87,7),('48372efa4b2541daad503f3e401b1cda','ORD-1794700800-15','2026-11-15 00:00:00.000000','COMPLETED',29000.00,'','2026-11-19 06:23:23.476928','2026-11-19 06:23:23.476928','80a925c12c624a58aad46e0b4d30af2a',3,100,7),('53a44336bb194be2aba6d7229db11fa4','ORD-1794614400-14','2026-11-14 00:00:00.000000','COMPLETED',36000.00,'','2026-11-19 06:23:23.472300','2026-11-19 06:23:23.472300','80a925c12c624a58aad46e0b4d30af2a',3,99,7),('61c8beecb9f94b8ea9f55e613056d0a7','ORD-1794355200-11','2026-11-11 00:00:00.000000','COMPLETED',21000.00,'','2026-11-19 06:23:23.451064','2026-11-19 06:23:23.451064','80a925c12c624a58aad46e0b4d30af2a',3,96,7),('63cd5335ee694f84b23ddac9e78b3ecc','ORD-1795132800-20','2026-11-20 00:00:00.000000','COMPLETED',52000.00,'','2026-11-19 06:23:23.532322','2026-11-19 06:23:23.532322','80a925c12c624a58aad46e0b4d30af2a',3,105,7),('6b52678e14b648a586dee0c602a2fe89','ORD-1793664000-3','2026-11-03 00:00:00.000000','COMPLETED',57000.00,'','2026-11-19 06:23:22.455409','2026-11-19 06:23:22.455409','80a925c12c624a58aad46e0b4d30af2a',3,88,7),('6d1795cea99a4fc390ef4d979201a1d9','ORD-1794009600-7','2026-11-07 00:00:00.000000','COMPLETED',26000.00,'','2026-11-19 06:23:22.502667','2026-11-19 06:23:22.502667','80a925c12c624a58aad46e0b4d30af2a',3,92,7),('72999ae23c384152b3d4baeaea789564','ORD-1794787200-16','2026-11-16 00:00:00.000000','COMPLETED',37000.00,'','2026-11-19 06:23:23.476928','2026-11-19 06:23:23.476928','80a925c12c624a58aad46e0b4d30af2a',3,101,7),('7cbc3b4230974b14babd299473e8c1aa','ORD-1794182400-9','2026-11-09 00:00:00.000000','COMPLETED',24500.00,'','2026-11-19 06:23:22.878543','2026-11-19 06:23:22.878662','80a925c12c624a58aad46e0b4d30af2a',3,94,7),('7d453c65e0454fb7b22103e3978c64f4','ORD-1793491200-1','2026-11-01 00:00:00.000000','COMPLETED',45000.00,'','2026-11-19 06:23:22.442545','2026-11-19 06:23:22.443064','80a925c12c624a58aad46e0b4d30af2a',3,86,7),('8008df03d73649ed82e279a1fe9fda5a','ORD-1794873600-17','2026-11-17 00:00:00.000000','COMPLETED',58000.00,'','2026-11-19 06:23:23.519015','2026-11-19 06:23:23.519015','80a925c12c624a58aad46e0b4d30af2a',3,102,7),('8e04850c5f4745898b5b1c7b04721471','ORD-1793750400-4','2026-11-04 00:00:00.000000','COMPLETED',22000.00,'','2026-11-19 06:23:22.488871','2026-11-19 06:23:22.488871','80a925c12c624a58aad46e0b4d30af2a',3,89,7),('bbb9cf036a5a4f81b75e8bbb742540fe','ORD-1793836800-5','2026-11-05 00:00:00.000000','COMPLETED',38500.00,'','2026-11-19 06:23:22.493588','2026-11-19 06:23:22.493588','80a925c12c624a58aad46e0b4d30af2a',3,90,7),('c19aff46281b49b8ac1dff120c480624','ORD-1793923200-6','2026-11-06 00:00:00.000000','COMPLETED',48000.00,'','2026-11-19 06:23:22.498476','2026-11-19 06:23:22.498476','80a925c12c624a58aad46e0b4d30af2a',3,91,7),('dd4f55ef95534188b6f266d303ffb886','ORD-1794441600-12','2026-11-12 00:00:00.000000','COMPLETED',55000.00,'','2026-11-19 06:23:23.457955','2026-11-19 06:23:23.457955','80a925c12c624a58aad46e0b4d30af2a',3,97,7),('e90dccef295649e3b8f0ca5671163652','ORD-1794528000-13','2026-11-13 00:00:00.000000','COMPLETED',62000.00,'','2026-11-19 06:23:23.465417','2026-11-19 06:23:23.465417','80a925c12c624a58aad46e0b4d30af2a',3,98,7),('e979a724317947978486fe93c6c7532a','ORD-1794096000-8','2026-11-08 00:00:00.000000','COMPLETED',39000.00,'','2026-11-19 06:23:22.506308','2026-11-19 06:23:22.506308','80a925c12c624a58aad46e0b4d30af2a',3,93,7);
/*!40000 ALTER TABLE `business_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_products`
--

DROP TABLE IF EXISTS `business_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `unit_cost` decimal(12,2) NOT NULL,
  `stock_quantity` int NOT NULL,
  `reorder_level` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_products_company_id_sku_9a1676c4_uniq` (`company_id`,`sku`),
  KEY `business_pr_company_5a793f_idx` (`company_id`,`sku`),
  KEY `business_pr_company_74ece6_idx` (`company_id`,`category_id`),
  KEY `business_pr_company_494a0d_idx` (`company_id`,`is_active`),
  KEY `business_products_category_id_fa64fd0d_fk_business_categories_id` (`category_id`),
  CONSTRAINT `business_products_category_id_fa64fd0d_fk_business_categories_id` FOREIGN KEY (`category_id`) REFERENCES `business_categories` (`id`),
  CONSTRAINT `business_products_company_id_a899bf95_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_products`
--

LOCK TABLES `business_products` WRITE;
/*!40000 ALTER TABLE `business_products` DISABLE KEYS */;
INSERT INTO `business_products` VALUES (94,'Embroidered Organza Maxi','SKU-EMB-0001','',45000.00,27000.00,100,10,1,'2026-11-19 06:23:22.430775','2026-11-19 06:23:22.430775',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(95,'Hand-Embellished Raw Silk Pishwas','SKU-HAN-0002','',32000.00,19200.00,100,10,1,'2026-11-19 06:23:22.448560','2026-11-19 06:23:22.448617',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(96,'Zari Work Pure Chiffon Anarkali','SKU-ZAR-0003','',28500.00,17100.00,100,10,1,'2026-11-19 06:23:22.453692','2026-11-19 06:23:22.453692',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(97,'Embossed Velvet Long Kurti Set','SKU-EMB-0004','',22000.00,13200.00,100,10,1,'2026-11-19 06:23:22.486953','2026-11-19 06:23:22.486953',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(98,'Heavily Embroidered Net Gown','SKU-HEA-0005','',38500.00,23100.00,100,10,1,'2026-11-19 06:23:22.492472','2026-11-19 06:23:22.492472',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(99,'Tissue Silk Angrakha Dress','SKU-TIS-0006','',48000.00,28800.00,100,10,1,'2026-11-19 06:23:22.496949','2026-11-19 06:23:22.496949',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(100,'Sequin Embroidered Chiffon Saree','SKU-SEQ-0007','',26000.00,15600.00,100,10,1,'2026-11-19 06:23:22.501545','2026-11-19 06:23:22.501545',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(101,'Mirror Work Pure Georgette Suit','SKU-MIR-0008','',19500.00,11700.00,100,10,1,'2026-11-19 06:23:22.505307','2026-11-19 06:23:22.505307',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(102,'Micro Velvet Embroidered Kaftan','SKU-MIC-0009','',24500.00,14700.00,100,10,1,'2026-11-19 06:23:22.875011','2026-11-19 06:23:22.875011',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(103,'Dabka Handwork Pure Silk Gharara','SKU-DAB-0010','',55000.00,33000.00,100,10,1,'2026-11-19 06:23:23.124272','2026-11-19 06:23:23.124272',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(104,'Tilla & Resham Embroidered Peplum','SKU-TIL-0011','',21000.00,12600.00,100,10,1,'2026-11-19 06:23:23.448552','2026-11-19 06:23:23.448552',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(105,'Cutwork Embroidered Organza Dupatta Set','SKU-CUT-0012','',27500.00,16500.00,100,10,1,'2026-11-19 06:23:23.456318','2026-11-19 06:23:23.456318',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(106,'Banarsi Jamawar Lehenga Choli','SKU-BAN-0013','',62000.00,37200.00,100,10,1,'2026-11-19 06:23:23.462876','2026-11-19 06:23:23.462876',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(107,'Embroidered Shawl & Velvet Peshwas','SKU-EMB-0014','',36000.00,21600.00,100,10,1,'2026-11-19 06:23:23.469514','2026-11-19 06:23:23.469514',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(108,'Hand-Worked Chanderi Silk Frock','SKU-HAN-0015','',29000.00,17400.00,100,10,1,'2026-11-19 06:23:23.476928','2026-11-19 06:23:23.476928',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(109,'Pearl & Gotta Work Kalidar Kurti','SKU-PEA-0016','',18500.00,11100.00,100,10,1,'2026-11-19 06:23:23.476928','2026-11-19 06:23:23.476928',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(110,'Zardozi Embroidered Bridal Maxi','SKU-ZAR-0017','',58000.00,34800.00,100,10,1,'2026-11-19 06:23:23.517382','2026-11-19 06:23:23.517382',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(111,'Digital Printed Silk Gown with Kora Work','SKU-DIG-0018','',31000.00,18600.00,100,10,1,'2026-11-19 06:23:23.522490','2026-11-19 06:23:23.522490',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(112,'Royal Kashmiri Tilla Velvet Suit','SKU-ROY-0019','',34000.00,20400.00,100,10,1,'2026-11-19 06:23:23.526884','2026-11-19 06:23:23.526884',NULL,'80a925c12c624a58aad46e0b4d30af2a'),(113,'Net Mukesh Hand-Embellished Farshi Gharara','SKU-NET-0020','',52000.00,31200.00,100,10,1,'2026-11-19 06:23:23.531144','2026-11-19 06:23:23.531144',NULL,'80a925c12c624a58aad46e0b4d30af2a');
/*!40000 ALTER TABLE `business_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_reports`
--

DROP TABLE IF EXISTS `business_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `report_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameters` json NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_format` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_reports_company_id_5cc1538c_fk_companies_id` (`company_id`),
  KEY `business_reports_created_by_id_d037aa4a_fk_auth_users_id` (`created_by_id`),
  CONSTRAINT `business_reports_company_id_5cc1538c_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `business_reports_created_by_id_d037aa4a_fk_auth_users_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_reports`
--

LOCK TABLES `business_reports` WRITE;
/*!40000 ALTER TABLE `business_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_sales`
--

DROP TABLE IF EXISTS `business_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_sales` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sale_date` datetime(6) NOT NULL,
  `quantity` int unsigned NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `total_amount` decimal(14,2) NOT NULL,
  `region` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint NOT NULL,
  `order_id` char(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` bigint NOT NULL,
  `dataset_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_sa_company_569127_idx` (`company_id`,`sale_date`),
  KEY `business_sa_company_190313_idx` (`company_id`,`product_id`),
  KEY `business_sa_company_30e4eb_idx` (`company_id`,`region`),
  KEY `business_sa_company_afd01d_idx` (`company_id`,`customer_id`),
  KEY `business_sales_customer_id_e5f1b959_fk_business_customers_id` (`customer_id`),
  KEY `business_sales_order_id_015c3991_fk_business_orders_id` (`order_id`),
  KEY `business_sales_product_id_b54c6f5b_fk_business_products_id` (`product_id`),
  KEY `business_sales_dataset_id_e2fc8adb_fk_business_datasets_id` (`dataset_id`),
  CONSTRAINT `business_sales_company_id_312cc3c0_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `business_sales_customer_id_e5f1b959_fk_business_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `business_customers` (`id`),
  CONSTRAINT `business_sales_dataset_id_e2fc8adb_fk_business_datasets_id` FOREIGN KEY (`dataset_id`) REFERENCES `business_datasets` (`id`),
  CONSTRAINT `business_sales_order_id_015c3991_fk_business_orders_id` FOREIGN KEY (`order_id`) REFERENCES `business_orders` (`id`),
  CONSTRAINT `business_sales_product_id_b54c6f5b_fk_business_products_id` FOREIGN KEY (`product_id`) REFERENCES `business_products` (`id`),
  CONSTRAINT `business_sales_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2458 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_sales`
--

LOCK TABLES `business_sales` WRITE;
/*!40000 ALTER TABLE `business_sales` DISABLE KEYS */;
INSERT INTO `business_sales` VALUES (2428,'2026-11-01 00:00:00.000000',1,45000.00,45000.00,'Punjab','2026-11-19 06:23:23.535062','80a925c12c624a58aad46e0b4d30af2a',86,'7d453c65e0454fb7b22103e3978c64f4',94,7),(2429,'2026-11-02 00:00:00.000000',1,32000.00,32000.00,'Sindh','2026-11-19 06:23:23.535062','80a925c12c624a58aad46e0b4d30af2a',87,'27447203edde4784be373fc0290c7a95',95,7),(2430,'2026-11-03 00:00:00.000000',2,28500.00,57000.00,'Islamabad Capital','2026-11-19 06:23:23.535620','80a925c12c624a58aad46e0b4d30af2a',88,'6b52678e14b648a586dee0c602a2fe89',96,7),(2431,'2026-11-04 00:00:00.000000',1,22000.00,22000.00,'Punjab','2026-11-19 06:23:23.535620','80a925c12c624a58aad46e0b4d30af2a',89,'8e04850c5f4745898b5b1c7b04721471',97,7),(2432,'2026-11-05 00:00:00.000000',1,38500.00,38500.00,'Punjab','2026-11-19 06:23:23.535620','80a925c12c624a58aad46e0b4d30af2a',90,'bbb9cf036a5a4f81b75e8bbb742540fe',98,7),(2433,'2026-11-06 00:00:00.000000',1,48000.00,48000.00,'Khyber Pakhtunkhwa','2026-11-19 06:23:23.536178','80a925c12c624a58aad46e0b4d30af2a',91,'c19aff46281b49b8ac1dff120c480624',99,7),(2434,'2026-11-07 00:00:00.000000',1,26000.00,26000.00,'Punjab','2026-11-19 06:23:23.536178','80a925c12c624a58aad46e0b4d30af2a',92,'6d1795cea99a4fc390ef4d979201a1d9',100,7),(2435,'2026-11-08 00:00:00.000000',2,19500.00,39000.00,'Punjab','2026-11-19 06:23:23.536178','80a925c12c624a58aad46e0b4d30af2a',93,'e979a724317947978486fe93c6c7532a',101,7),(2436,'2026-11-09 00:00:00.000000',1,24500.00,24500.00,'Punjab','2026-11-19 06:23:23.536742','80a925c12c624a58aad46e0b4d30af2a',94,'7cbc3b4230974b14babd299473e8c1aa',102,7),(2437,'2026-11-10 00:00:00.000000',1,55000.00,55000.00,'Balochistan','2026-11-19 06:23:23.536742','80a925c12c624a58aad46e0b4d30af2a',95,'10097e7cbd9d413899c234a237870595',103,7),(2438,'2026-11-11 00:00:00.000000',1,21000.00,21000.00,'Sindh','2026-11-19 06:23:23.536742','80a925c12c624a58aad46e0b4d30af2a',96,'61c8beecb9f94b8ea9f55e613056d0a7',104,7),(2439,'2026-11-12 00:00:00.000000',2,27500.00,55000.00,'Punjab','2026-11-19 06:23:23.537303','80a925c12c624a58aad46e0b4d30af2a',97,'dd4f55ef95534188b6f266d303ffb886',105,7),(2440,'2026-11-13 00:00:00.000000',1,62000.00,62000.00,'Punjab','2026-11-19 06:23:23.537303','80a925c12c624a58aad46e0b4d30af2a',98,'e90dccef295649e3b8f0ca5671163652',106,7),(2441,'2026-11-14 00:00:00.000000',1,36000.00,36000.00,'Khyber Pakhtunkhwa','2026-11-19 06:23:23.537303','80a925c12c624a58aad46e0b4d30af2a',99,'53a44336bb194be2aba6d7229db11fa4',107,7),(2442,'2026-11-15 00:00:00.000000',1,29000.00,29000.00,'Sindh','2026-11-19 06:23:23.537812','80a925c12c624a58aad46e0b4d30af2a',100,'48372efa4b2541daad503f3e401b1cda',108,7),(2443,'2026-11-16 00:00:00.000000',2,18500.00,37000.00,'Punjab','2026-11-19 06:23:23.537839','80a925c12c624a58aad46e0b4d30af2a',101,'72999ae23c384152b3d4baeaea789564',109,7),(2444,'2026-11-17 00:00:00.000000',1,58000.00,58000.00,'Khyber Pakhtunkhwa','2026-11-19 06:23:23.537839','80a925c12c624a58aad46e0b4d30af2a',102,'8008df03d73649ed82e279a1fe9fda5a',110,7),(2445,'2026-11-18 00:00:00.000000',1,31000.00,31000.00,'Punjab','2026-11-19 06:23:23.537839','80a925c12c624a58aad46e0b4d30af2a',103,'1c86411dccda4e539ff6af8b826c8fe2',111,7),(2446,'2026-11-19 00:00:00.000000',1,34000.00,34000.00,'Punjab','2026-11-19 06:23:23.538374','80a925c12c624a58aad46e0b4d30af2a',104,'01e409be790a489e855513615de8a427',112,7),(2447,'2026-11-20 00:00:00.000000',1,52000.00,52000.00,'Punjab','2026-11-19 06:23:23.538374','80a925c12c624a58aad46e0b4d30af2a',105,'63cd5335ee694f84b23ddac9e78b3ecc',113,7);
/*!40000 ALTER TABLE `business_sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domain` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscription_plan` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES ('80a925c12c624a58aad46e0b4d30af2a','malaika','malaika',NULL,'clothes','USD','GROWTH',1,'2026-11-18 10:09:18.594607','2026-11-18 10:09:18.594607');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_memberships`
--

DROP TABLE IF EXISTS `company_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_memberships` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `joined_at` datetime(6) NOT NULL,
  `company_id` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_memberships_user_id_company_id_7464b8c0_uniq` (`user_id`,`company_id`),
  KEY `company_mem_user_id_6db7c9_idx` (`user_id`,`company_id`),
  KEY `company_mem_company_1e7287_idx` (`company_id`,`role`),
  CONSTRAINT `company_memberships_company_id_6c4a6720_fk_companies_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `company_memberships_user_id_5eb8d1f7_fk_auth_users_id` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_memberships`
--

LOCK TABLES `company_memberships` WRITE;
/*!40000 ALTER TABLE `company_memberships` DISABLE KEYS */;
INSERT INTO `company_memberships` VALUES (12,'ADMIN',1,'2026-11-18 10:09:18.811025','80a925c12c624a58aad46e0b4d30af2a',3);
/*!40000 ALTER TABLE `company_memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_users_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_users_id` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(8,'authentication','user'),(21,'business','analyticssnapshot'),(11,'business','category'),(12,'business','customer'),(13,'business','dataset'),(14,'business','expense'),(15,'business','mlprediction'),(16,'business','order'),(18,'business','orderitem'),(17,'business','product'),(19,'business','report'),(20,'business','sale'),(9,'companies','company'),(10,'companies','companymembership'),(4,'contenttypes','contenttype'),(5,'sessions','session'),(6,'token_blacklist','blacklistedtoken'),(7,'token_blacklist','outstandingtoken');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-11-16 09:48:28.034866'),(2,'contenttypes','0002_remove_content_type_name','2026-11-16 09:48:30.398702'),(3,'auth','0001_initial','2026-11-16 09:48:38.120453'),(4,'auth','0002_alter_permission_name_max_length','2026-11-16 09:48:40.082707'),(5,'auth','0003_alter_user_email_max_length','2026-11-16 09:48:40.213432'),(6,'auth','0004_alter_user_username_opts','2026-11-16 09:48:40.289723'),(7,'auth','0005_alter_user_last_login_null','2026-11-16 09:48:40.428485'),(8,'auth','0006_require_contenttypes_0002','2026-11-16 09:48:40.502731'),(9,'auth','0007_alter_validators_add_error_messages','2026-11-16 09:48:40.623577'),(10,'auth','0008_alter_user_username_max_length','2026-11-16 09:48:40.774851'),(11,'auth','0009_alter_user_last_name_max_length','2026-11-16 09:48:40.922503'),(12,'auth','0010_alter_group_name_max_length','2026-11-16 09:48:41.232031'),(13,'auth','0011_update_proxy_permissions','2026-11-16 09:48:41.395174'),(14,'auth','0012_alter_user_first_name_max_length','2026-11-16 09:48:41.588817'),(15,'authentication','0001_initial','2026-11-16 09:48:49.605962'),(16,'admin','0001_initial','2026-11-16 09:48:52.486806'),(17,'admin','0002_logentry_remove_auto_add','2026-11-16 09:48:52.733367'),(18,'admin','0003_logentry_add_action_flag_choices','2026-11-16 09:48:52.815444'),(19,'companies','0001_initial','2026-11-16 09:48:58.221021'),(20,'business','0001_initial','2026-11-16 09:50:00.668813'),(21,'sessions','0001_initial','2026-11-16 09:50:02.442367'),(22,'token_blacklist','0001_initial','2026-11-16 09:50:10.723514'),(23,'token_blacklist','0002_outstandingtoken_jti_hex','2026-11-16 09:50:12.605948'),(24,'token_blacklist','0003_auto_20171017_2007','2026-11-16 09:50:12.935853'),(25,'token_blacklist','0004_auto_20171017_2013','2026-11-16 09:50:14.800598'),(26,'token_blacklist','0005_remove_outstandingtoken_jti','2026-11-16 09:50:16.681098'),(27,'token_blacklist','0006_auto_20171017_2113','2026-11-16 09:50:17.332977'),(28,'token_blacklist','0007_auto_20171017_2214','2026-11-16 09:50:22.841412'),(29,'token_blacklist','0008_migrate_to_bigautofield','2026-11-16 09:50:30.224664'),(30,'token_blacklist','0010_fix_migrate_to_bigautofield','2026-11-16 09:50:30.344777'),(31,'token_blacklist','0011_linearizes_history','2026-11-16 09:50:30.418603'),(32,'token_blacklist','0012_alter_outstandingtoken_user','2026-11-16 09:50:30.559189'),(33,'token_blacklist','0013_alter_blacklistedtoken_options_and_more','2026-11-16 09:50:30.724162'),(34,'business','0002_order_dataset_sale_dataset_alter_customer_country_and_more','2026-11-19 07:04:56.631339');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('jgy03tihaxh34rdc6q7vauljgba7wv8s','.eJxVjEsOwjAMBe-SNYriNA02S_Y9Q-U4LimgVOpnhbg7VOoCtm9m3sv0vK2l3xad-zGbi_Hm9LsllofWHeQ719tkZarrPCa7K_agi-2mrM_r4f4dFF7Kt-bskHSIDhUSgURF54ICU4CAjE0iHKJ68dCIbyUQEDhKKBF8as_m_QHXYDcX:1xSuDT:PPdFOn060vVFbinwtdnuBTog2sW30-y_QPggNG4Hyng','2026-11-30 10:45:39.377553'),('pgvusmjaes7rfcgg6xse1qk6bipwk7f5','.eJxVjEsOwjAMBe-SNYriNA02S_Y9Q-U4LimgVOpnhbg7VOoCtm9m3sv0vK2l3xad-zGbi_Hm9LsllofWHeQ719tkZarrPCa7K_agi-2mrM_r4f4dFF7Kt-bskHSIDhUSgURF54ICU4CAjE0iHKJ68dCIbyUQEDhKKBF8as_m_QHXYDcX:1xSuD7:ryfMfHtOZEWvJUJK_zLF6_K-3z0M0wWBR5UqdnqmCwY','2026-11-30 10:45:17.259790'),('qagg7nwjrnnfi0h92scdsioezwh12tsx','.eJxVjEsOwjAMBe-SNYriNA02S_Y9Q-U4LimgVOpnhbg7VOoCtm9m3sv0vK2l3xad-zGbi_Hm9LsllofWHeQ719tkZarrPCa7K_agi-2mrM_r4f4dFF7Kt-bskHSIDhUSgURF54ICU4CAjE0iHKJ68dCIbyUQEDhKKBF8as_m_QHXYDcX:1xSu68:EoFcdEBHs4C64uGPbYkBQdFZXpmb8CDZNgisMTwsrQQ','2026-11-30 10:38:04.780096');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_blacklistedtoken` VALUES (1,'2026-11-17 05:43:18.076827',2),(2,'2026-11-18 04:48:39.745110',3),(3,'2026-11-18 04:48:47.428285',4),(4,'2026-11-18 05:39:49.259895',5),(5,'2026-11-18 05:58:54.676426',7),(6,'2026-11-18 06:01:47.739034',9),(7,'2026-11-18 06:23:17.603076',14),(8,'2026-11-18 07:34:22.577790',15),(9,'2026-11-18 07:48:17.819194',17),(10,'2026-11-18 07:54:15.140168',18),(11,'2026-11-18 09:06:37.064384',19),(12,'2026-11-18 10:06:26.861845',16),(13,'2026-11-18 10:08:31.981050',21),(14,'2026-11-18 10:25:53.869491',22),(15,'2026-11-19 05:19:31.749964',23),(16,'2026-11-19 06:19:54.674487',24);
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `jti` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_auth_user` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_outstandingtoken` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTQyODEyMywiaWF0IjoxNzk0ODIzMzIzLCJqdGkiOiI4YTVmZjM2YjJiNmY0OTgxODNjMWY3M2E5YzM0MzdjNyIsInVzZXJfaWQiOiIxIn0.gHfu_WyA5fRDV8IpnNNxH7ouig4SQ-R3WJLlCNnlCRM','2026-11-16 10:02:03.636305','2026-11-23 10:02:03.000000',1,'8a5ff36b2b6f498183c1f73a9c3437c7'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTQyODIwMiwiaWF0IjoxNzk0ODIzNDAyLCJqdGkiOiIyYjlhNzMzMjBmNWY0YmE2OWFjOTAyZjQ5OGYwOTM0MSIsInVzZXJfaWQiOiIxIn0.WIGbygO6aMSz-WUy4BQ0VyRNkRDmZbbKMzbzDiWZuxo','2026-11-16 10:03:22.401186','2026-11-23 10:03:22.000000',1,'2b9a73320f5f4ba69ac902f498f09341'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTQ5ODk5NiwiaWF0IjoxNzk0ODk0MTk2LCJqdGkiOiJlMmZhZTM4M2Q5MGY0YzRjYmFiMDg3MjhhMzA2NWQ4OCIsInVzZXJfaWQiOiIxIn0.L7RL89hkNnfrnC5rHDAaXcfUsIKknbVMnszc2uwcBSc','2026-11-17 05:43:16.754427','2026-11-24 05:43:16.000000',1,'e2fae383d90f4c4cbab08728a3065d88'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4MjExOCwiaWF0IjoxNzk0OTc3MzE4LCJqdGkiOiJlMmJiYjBhZDJhY2M0MTk0YmQ5ODllZTY0MWE2MDczZSIsInVzZXJfaWQiOiIxIn0.goNOzaP-bwNi0l9w49iRXMBEh12BCmxOpbcjmF-YyXY','2026-11-18 04:48:38.637071','2026-11-25 04:48:38.000000',1,'e2bbb0ad2acc4194bd989ee641a6073e'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4MjEzMCwiaWF0IjoxNzk0OTc3MzMwLCJqdGkiOiI3YzU5YjgxMjRkNDA0ODgyODY4NzYwZTBiOGY3NzU1ZCIsInVzZXJfaWQiOiIxIn0.KvNhmYj_6doncko4gBwEQ2I9rv2bZL8v-HobsOdSKUA','2026-11-18 04:48:50.848458','2026-11-25 04:48:50.000000',1,'7c59b8124d404882868760e0b8f7755d'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4NTYxOSwiaWF0IjoxNzk0OTgwODE5LCJqdGkiOiI0N2MwNmFjNDFmNzk0YTQxYThmZjJmNGVjMzBmNGIzZCIsInVzZXJfaWQiOiIyIn0.Ssyjp-7gzqKIxxsY_8PWhYBm47J423GZwwbQ98xeU3o','2026-11-18 05:46:59.664771','2026-11-25 05:46:59.000000',2,'47c06ac41f794a41a8ff2f4ec30f4b3d'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4NTcyNywiaWF0IjoxNzk0OTgwOTI3LCJqdGkiOiJjZjlkMTg4YmNjZmY0NjIwYmM2ZWE1NWYwNTBjZTI5NCIsInVzZXJfaWQiOiIyIn0.1_75H7VZcTKCFOiCfPuU3btUfymMPE-B9mnR0IUDK80','2026-11-18 05:48:47.706912','2026-11-25 05:48:47.000000',2,'cf9d188bccff4620bc6ea55f050ce294'),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4NjQ4OSwiaWF0IjoxNzk0OTgxNjg5LCJqdGkiOiJmZWZhMzNiMDk3MWI0NmJmODhhYjM3ZTIyZjc4ZjAzNiIsInVzZXJfaWQiOiIyIn0.YG2u5Ow0fkYmm5JwZ9sTBR-DlOhMxtpXzwj7o4Ia_QY','2026-11-18 06:01:29.820361','2026-11-25 06:01:29.000000',2,'fefa33b0971b46bf88ab37e22f78f036'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4NjUwMywiaWF0IjoxNzk0OTgxNzAzLCJqdGkiOiI4ZTVhYTdhY2I1MDI0YTAwYmJkMzdlYjQ3ZjlmYTEwOCIsInVzZXJfaWQiOiIxIn0.rD-LYc6SIvaOtRjQeHYKXlZNGcF5sSzdyJXB-AQiQU0','2026-11-18 06:01:43.778000','2026-11-25 06:01:43.000000',1,'8e5aa7acb5024a00bbd37eb47f9fa108'),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4NjUxMywiaWF0IjoxNzk0OTgxNzEzLCJqdGkiOiJhMzcxYzY0N2UyZTY0M2NiOWU3OWI2OGIxN2FhZTU4MCIsInVzZXJfaWQiOiIyIn0.4P_ryZDYp37F_tNMDyC-pRdf_k0_2-Y5PZ7EKytNjnE','2026-11-18 06:01:53.106922','2026-11-25 06:01:53.000000',2,'a371c647e2e643cb9e79b68b17aae580'),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4NjUzNywiaWF0IjoxNzk0OTgxNzM3LCJqdGkiOiJiZjlhODc3OGVjN2Q0MDI5YTdjMTg3NDY0MzkwMmRhOCIsInVzZXJfaWQiOiIyIn0.QWvALOwHCrsOPy5EmJzagrEqlCpHBBKswGEitn8nxpY','2026-11-18 06:02:17.162284','2026-11-25 06:02:17.000000',2,'bf9a8778ec7d4029a7c1874643902da8'),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4Njg5MSwiaWF0IjoxNzk0OTgyMDkxLCJqdGkiOiIzNWNmMjVhYWQ4MTk0ZGU2OGFhZGE1ZjY0NTBiOWI2YiIsInVzZXJfaWQiOiIzIn0.9vHzkVZRTtMgIBMG1IN7NE46bAGBNM-005lOgvQxQYE','2026-11-18 06:08:11.004971','2026-11-25 06:08:11.000000',3,'35cf25aad8194de68aada5f6450b9b6b'),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4Njk4NiwiaWF0IjoxNzk0OTgyMTg2LCJqdGkiOiJmMDYxMzgzOTIyMjQ0MDg4YWU4N2Q3MzA0OGVkNmM4YiIsInVzZXJfaWQiOiIyIn0.wlSQOEnl97ZszySoFMOHC4kV-NdaEtS4V0Wuzf5T1Fo','2026-11-18 06:09:46.138237','2026-11-25 06:09:46.000000',2,'f061383922244088ae87d73048ed6c8b'),(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4Nzc4NCwiaWF0IjoxNzk0OTgyOTg0LCJqdGkiOiI4YTUwZjY3NDcwYTI0MzJhYTc2ZTUwNmE3N2UwOWE2YiIsInVzZXJfaWQiOiIzIn0.CHRdhAtDd7R4fmLumGHVq8RjaX0so1Rsn5Im1US1j8c','2026-11-18 06:23:04.574839','2026-11-25 06:23:04.000000',3,'8a50f67470a2432aa76e506a77e09a6b'),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU4ODM4NSwiaWF0IjoxNzk0OTgzNTg1LCJqdGkiOiJiM2VkZjlkZjBjYzE0NDI1OGQ4ZTdhMzY4NzJhNmIwNCIsInVzZXJfaWQiOiIzIn0.EyMWrErOP758_I8HDEpLBcs0oe-3YehPFSx_z9M3VaQ','2026-11-18 06:33:05.803915','2026-11-25 06:33:05.000000',3,'b3edf9df0cc144258d8e7a36872a6b04'),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU5MjA2MiwiaWF0IjoxNzk0OTg3MjYyLCJqdGkiOiJjODdiODUzNDM2OGE0NzdmODdiMDNjYjNhODZhYzI4MCIsInVzZXJfaWQiOiIzIn0.gbbgxag23L6NkS7u8zSWNhpzCRJqPAaNvhep7zF_UF4','2026-11-18 07:34:22.527619','2026-11-25 07:34:22.000000',3,'c87b8534368a477f87b03cb3a86ac280'),(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU5MjQ0MCwiaWF0IjoxNzk0OTg3NjQwLCJqdGkiOiIyMzNlMDYzNDhmNDA0NDA1YTNjNDdmZjZjYTM0NTNmYiIsInVzZXJfaWQiOiIxIn0.joB0XSvDVfRQWCyiUaUx7HQFI6aSYq7BAwBzJ0-9GIo','2026-11-18 07:40:40.943381','2026-11-25 07:40:40.000000',1,'233e06348f404405a3c47ff6ca3453fb'),(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU5MjkyMSwiaWF0IjoxNzk0OTg4MTIxLCJqdGkiOiI0ZWRkNWNlYmJlNzA0NjAxYWU2YjVjMWUwNzk4NzlhMiIsInVzZXJfaWQiOiIzIn0.tOhBP7yySmC6BeQIibJgo5ltZCzD-kFF07sJbwKihDA','2026-11-18 07:48:41.237451','2026-11-25 07:48:41.000000',3,'4edd5cebbe704601ae6b5c1e079879a2'),(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU5NzE1MywiaWF0IjoxNzk0OTkyMzUzLCJqdGkiOiIwZDZmOGQ4YjAxZTE0ZjE2OWE4OWZjMzM4ZjVjYWVkYSIsInVzZXJfaWQiOiIzIn0.tt4wF6n7Mm0kcc7HKA6ypkVziLWs48TgmSbOzMVTe2Y','2026-11-18 08:59:13.383577','2026-11-25 08:59:13.000000',3,'0d6f8d8b01e14f169a89fc338f5caeda'),(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTU5NzY5OCwiaWF0IjoxNzk0OTkyODk4LCJqdGkiOiI5YWY5YjZiZjdiNzk0NzNjYTdhYzkxZWE3NDc2MDE2YSIsInVzZXJfaWQiOiIxIn0.PCUNUHE8UoZGVdFXuRUYguAWM5S1QcDp13lw5O508CY','2026-11-18 09:08:18.324338','2026-11-25 09:08:18.000000',1,'9af9b6bf7b79473ca7ac91ea7476016a'),(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTYwMTE4NiwiaWF0IjoxNzk0OTk2Mzg2LCJqdGkiOiIxYzllNDY1ODlhN2Q0OWRkYWY4NGU1MGVkN2ZkYzA0OSIsInVzZXJfaWQiOiIzIn0.rDJFpHHA2EfseLc8lvr7CBxFkpUXboVm3Luv7EEWm7k','2026-11-18 10:06:26.031658','2026-11-25 10:06:26.000000',3,'1c9e46589a7d49ddaf84e50ed7fdc049'),(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTYwMTMzMywiaWF0IjoxNzk0OTk2NTMzLCJqdGkiOiI0OGVkNmRlODU1OTc0ZjE4YTIzMDQ2NjFkNWE5MDkxNyIsInVzZXJfaWQiOiIxIn0.uYgwJIl62gA3BPMnq2m28ZFlCzyE81AWqbeIT7MPKeM','2026-11-18 10:08:53.512698','2026-11-25 10:08:53.000000',1,'48ed6de855974f18a2304661d5a90917'),(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTYwMjM4NiwiaWF0IjoxNzk0OTk3NTg2LCJqdGkiOiJkMzNmZjljNmMxMjU0NWI0OTg3NTNmZWM4ZWIzYWZkMyIsInVzZXJfaWQiOiIzIn0.pOofrYG2qwGSU5kQJl2SHFh6oPi6T4e0L-DeY2yC6Cw','2026-11-18 10:26:26.847965','2026-11-25 10:26:26.000000',3,'d33ff9c6c12545b498753fec8eb3afd3'),(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTY3MDM3MSwiaWF0IjoxNzk1MDY1NTcxLCJqdGkiOiJjZTUzZjJkMDBiOTA0YTYyYTE2ZDg4NjZlOTRhN2QwZiIsInVzZXJfaWQiOiIzIn0.UxQAb8QmS-yXRaUxdRL1S_k-pvLwK8pYVGj01i8PbVo','2026-11-19 05:19:31.700781','2026-11-26 05:19:31.000000',3,'ce53f2d00b904a62a16d8866e94a7d0f'),(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5NTY3Mzk5NCwiaWF0IjoxNzk1MDY5MTk0LCJqdGkiOiIyNDYxYjNkYzk0MDI0NjIwYjRjZTMwMTkxZDdlZjc0MiIsInVzZXJfaWQiOiIzIn0.CTsmXvb5ey7H7PG6oG6AkPc5d85jAnJsM-zbqNtxn90','2026-11-19 06:19:54.536257','2026-11-26 06:19:54.000000',3,'2461b3dc94024620b4ce30191d7ef742');
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-18 23:17:59
