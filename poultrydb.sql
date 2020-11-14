-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 14, 2020 at 09:39 PM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `poultrydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `chickens_orders`
--

DROP TABLE IF EXISTS `chickens_orders`;
CREATE TABLE IF NOT EXISTS `chickens_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `no` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `time_ordered` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `supplier_id` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `chicken_payments`
--

DROP TABLE IF EXISTS `chicken_payments`;
CREATE TABLE IF NOT EXISTS `chicken_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `payment_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `method` varchar(40) NOT NULL,
  `payment_ref` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `chicken_stock`
--

DROP TABLE IF EXISTS `chicken_stock`;
CREATE TABLE IF NOT EXISTS `chicken_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) NOT NULL,
  `no` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `time_recorded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `chicken_suppliers`
--

DROP TABLE IF EXISTS `chicken_suppliers`;
CREATE TABLE IF NOT EXISTS `chicken_suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `district` varchar(255) NOT NULL,
  `subcounty` varchar(255) NOT NULL,
  `parish` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `egg_orders`
--

DROP TABLE IF EXISTS `egg_orders`;
CREATE TABLE IF NOT EXISTS `egg_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `trays` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `order_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `egg_payments`
--

DROP TABLE IF EXISTS `egg_payments`;
CREATE TABLE IF NOT EXISTS `egg_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `method` varchar(40) NOT NULL,
  `payment_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_ref` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `egg_stock`
--

DROP TABLE IF EXISTS `egg_stock`;
CREATE TABLE IF NOT EXISTS `egg_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `trays` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `time_record` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `subcounty` varchar(255) NOT NULL,
  `parish` varchar(255) NOT NULL,
  `village` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
CREATE TABLE IF NOT EXISTS `group_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `username` varchar(40) DEFAULT NULL,
  `password` varchar(40) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `reg_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `reset_code` varchar(255) DEFAULT NULL,
  `reset_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gender` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `priv` varchar(20) NOT NULL DEFAULT 'regular',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `phone`, `reg_date`, `reset_code`, `reset_time`, `gender`, `status`, `priv`) VALUES
(1, 'Godzilla Mark X', NULL, '861f72c7fbdc5cdc60ef20d73e6d73c784cfb97e', '0785967798', '2020-11-15 00:14:58', '36b18ff9d5b5dc8a4f68ce0747fa2942d8f0737f', '2020-11-15 00:32:06', NULL, 1, 'regular');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chickens_orders`
--
ALTER TABLE `chickens_orders`
  ADD CONSTRAINT `chickens_orders_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `chickens_orders_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `chicken_suppliers` (`id`);

--
-- Constraints for table `chicken_payments`
--
ALTER TABLE `chicken_payments`
  ADD CONSTRAINT `chicken_payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `chickens_orders` (`id`);

--
-- Constraints for table `chicken_stock`
--
ALTER TABLE `chicken_stock`
  ADD CONSTRAINT `chicken_stock_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `chicken_suppliers` (`id`);

--
-- Constraints for table `egg_payments`
--
ALTER TABLE `egg_payments`
  ADD CONSTRAINT `egg_payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `egg_orders` (`id`);

--
-- Constraints for table `egg_stock`
--
ALTER TABLE `egg_stock`
  ADD CONSTRAINT `egg_stock_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`);

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
