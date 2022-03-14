-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.4.18-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Exportiere Datenbank Struktur für liga_db
DROP DATABASE IF EXISTS `liga_db`;
CREATE DATABASE IF NOT EXISTS `liga_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `liga_db`;

-- Exportiere Struktur von Tabelle liga_db.land
DROP TABLE IF EXISTS `land`;
CREATE TABLE IF NOT EXISTS `land` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportiere Daten aus Tabelle liga_db.land: ~0 rows (ungefähr)
DELETE FROM `land`;
/*!40000 ALTER TABLE `land` DISABLE KEYS */;
/*!40000 ALTER TABLE `land` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle liga_db.liga
DROP TABLE IF EXISTS `liga`;
CREATE TABLE IF NOT EXISTS `liga` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `land_id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_land_id` (`land_id`),
  CONSTRAINT `FK_land_id` FOREIGN KEY (`land_id`) REFERENCES `land` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportiere Daten aus Tabelle liga_db.liga: ~0 rows (ungefähr)
DELETE FROM `liga`;
/*!40000 ALTER TABLE `liga` DISABLE KEYS */;
/*!40000 ALTER TABLE `liga` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle liga_db.saison
DROP TABLE IF EXISTS `saison`;
CREATE TABLE IF NOT EXISTS `saison` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `liga_id` int(11) NOT NULL DEFAULT 0,
  `jahr` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_liga_id` (`liga_id`),
  CONSTRAINT `FK_liga_id` FOREIGN KEY (`liga_id`) REFERENCES `liga` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportiere Daten aus Tabelle liga_db.saison: ~0 rows (ungefähr)
DELETE FROM `saison`;
/*!40000 ALTER TABLE `saison` DISABLE KEYS */;
/*!40000 ALTER TABLE `saison` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle liga_db.spiel
DROP TABLE IF EXISTS `spiel`;
CREATE TABLE IF NOT EXISTS `spiel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `spieltag_id` int(11) NOT NULL DEFAULT 0,
  `heimverein_id` int(11) DEFAULT NULL,
  `gastverein_id` int(11) DEFAULT NULL,
  `ergebnis` varchar(50) DEFAULT NULL,
  `startzeitpunkt` time DEFAULT NULL,
  `zustand` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_spieltag_id` (`spieltag_id`),
  KEY `FK_heimverein_id` (`heimverein_id`),
  KEY `FK_gastverein_id` (`gastverein_id`),
  CONSTRAINT `FK_gastverein_id` FOREIGN KEY (`gastverein_id`) REFERENCES `verein` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_heimverein_id` FOREIGN KEY (`heimverein_id`) REFERENCES `verein` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_spieltag_id` FOREIGN KEY (`spieltag_id`) REFERENCES `spieltag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportiere Daten aus Tabelle liga_db.spiel: ~0 rows (ungefähr)
DELETE FROM `spiel`;
/*!40000 ALTER TABLE `spiel` DISABLE KEYS */;
/*!40000 ALTER TABLE `spiel` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle liga_db.spieler
DROP TABLE IF EXISTS `spieler`;
CREATE TABLE IF NOT EXISTS `spieler` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groeße` int(11) NOT NULL DEFAULT 0,
  `herkunft` varchar(50) NOT NULL DEFAULT '0',
  `verein_id` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_verein_id` (`verein_id`),
  CONSTRAINT `FK_verein_id` FOREIGN KEY (`verein_id`) REFERENCES `verein` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportiere Daten aus Tabelle liga_db.spieler: ~0 rows (ungefähr)
DELETE FROM `spieler`;
/*!40000 ALTER TABLE `spieler` DISABLE KEYS */;
/*!40000 ALTER TABLE `spieler` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle liga_db.spieltag
DROP TABLE IF EXISTS `spieltag`;
CREATE TABLE IF NOT EXISTS `spieltag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `liga_id` int(11) DEFAULT 0,
  `saison_id` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_ligaid` (`liga_id`),
  KEY `FK_saison_id` (`saison_id`),
  CONSTRAINT `FK_ligaid` FOREIGN KEY (`liga_id`) REFERENCES `liga` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_saison_id` FOREIGN KEY (`saison_id`) REFERENCES `saison` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportiere Daten aus Tabelle liga_db.spieltag: ~0 rows (ungefähr)
DELETE FROM `spieltag`;
/*!40000 ALTER TABLE `spieltag` DISABLE KEYS */;
/*!40000 ALTER TABLE `spieltag` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle liga_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `passwort` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `vorname` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `nachname` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Exportiere Daten aus Tabelle liga_db.users: ~0 rows (ungefähr)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle liga_db.verein
DROP TABLE IF EXISTS `verein`;
CREATE TABLE IF NOT EXISTS `verein` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `liga_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_liga_id-` (`liga_id`),
  CONSTRAINT `FK_liga_id-` FOREIGN KEY (`liga_id`) REFERENCES `liga` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportiere Daten aus Tabelle liga_db.verein: ~0 rows (ungefähr)
DELETE FROM `verein`;
/*!40000 ALTER TABLE `verein` DISABLE KEYS */;
/*!40000 ALTER TABLE `verein` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
