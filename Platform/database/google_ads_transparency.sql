-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2026 at 10:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `google_ads_transparency`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','admin') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `last_login`) VALUES
(1, 'admin', 'admin@googleadstransparency.com', '$2b$10$rKvVLZ8Z8Z8Z8Z8Z8Z8Z8uX1234567890abcdefghijklmnopqrs', 'super_admin', 1, '2025-12-05 16:41:58', '2026-01-08 18:04:18');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `target_table` varchar(50) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `admin_id`, `action`, `target_table`, `target_id`, `old_values`, `new_values`, `ip_address`, `created_at`) VALUES
(1, 1, 'suspend_user', 'users', 5, '{\"is_active\":1}', '{\"is_active\":0,\"suspension_reason\":\"Credential Issue\"}', NULL, '2026-01-08 19:20:57'),
(2, 1, 'activate_user', 'users', 5, '{\"is_active\":0}', '{\"is_active\":1}', NULL, '2026-01-08 19:24:30'),
(3, 1, 'suspend_user', 'users', 5, '{\"is_active\":1}', '{\"is_active\":0,\"suspension_reason\":\"Check\"}', NULL, '2026-01-08 19:26:01'),
(4, 1, 'activate_user', 'users', 5, '{\"is_active\":0}', '{\"is_active\":1}', NULL, '2026-01-08 19:41:13'),
(5, 1, 'suspend_user', 'users', 5, '{\"is_active\":1}', '{\"is_active\":0,\"suspension_reason\":\"Check\"}', NULL, '2026-01-08 19:45:12'),
(6, 1, 'activate_user', 'users', 5, '{\"is_active\":0}', '{\"is_active\":1}', NULL, '2026-01-08 19:46:49'),
(7, 1, 'suspend_user', 'users', 1, '{\"is_active\":1}', '{\"is_active\":0,\"suspension_reason\":\"check\"}', NULL, '2026-01-08 19:47:02'),
(8, 1, 'activate_user', 'users', 1, '{\"is_active\":0}', '{\"is_active\":1}', NULL, '2026-01-08 19:50:15'),
(9, 1, 'suspend_user', 'users', 1, '{\"is_active\":1}', '{\"is_active\":0,\"suspension_reason\":\"We have detected unusual working\"}', NULL, '2026-01-08 19:52:10'),
(10, 1, 'activate_user', 'users', 1, '{\"is_active\":0}', '{\"is_active\":1}', NULL, '2026-01-08 19:52:54'),
(11, 1, 'suspend_user', 'users', 5, '{\"is_active\":1}', '{\"is_active\":0,\"suspension_reason\":\"check\"}', NULL, '2026-01-08 19:57:36'),
(12, 1, 'activate_user', 'users', 5, '{\"is_active\":0}', '{\"is_active\":1}', NULL, '2026-01-08 20:00:55');

-- --------------------------------------------------------

--
-- Table structure for table `discount_codes`
--

CREATE TABLE `discount_codes` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `max_uses` int(11) NOT NULL,
  `current_uses` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `discount_codes`
--

INSERT INTO `discount_codes` (`id`, `code`, `discount_percentage`, `max_uses`, `current_uses`, `is_active`, `created_at`, `expires_at`) VALUES
(1, 'TEST', 10.00, 100, 22, 1, '2025-12-05 17:11:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kyc_verifications`
--

CREATE TABLE `kyc_verifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_type` enum('nic','passport','driving_license') NOT NULL,
  `document_front_image` varchar(255) NOT NULL,
  `document_back_image` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','declined') DEFAULT 'pending',
  `decline_reason` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kyc_verifications`
--

INSERT INTO `kyc_verifications` (`id`, `user_id`, `document_type`, `document_front_image`, `document_back_image`, `status`, `decline_reason`, `submitted_at`, `reviewed_at`, `reviewed_by`) VALUES
(1, 1, 'nic', 'kyc-862973-1764959452686-417524071.jpg', 'kyc-862973-1764959452689-854587311.jpg', 'declined', 'Not clear', '2025-12-05 18:30:52', '2025-12-05 18:31:25', 1),
(2, 1, 'nic', 'kyc-862973-1764959791837-986464536.jpg', 'kyc-862973-1764959791844-654101074.jpg', 'approved', NULL, '2025-12-05 18:36:31', '2025-12-05 18:57:09', 1),
(3, 2, 'nic', 'kyc-603164-1765377738081-841739105.jpg', 'kyc-603164-1765377738087-191378881.jpg', 'declined', 'Have difference name', '2025-12-10 14:42:18', '2025-12-10 14:43:34', 1),
(4, 2, 'nic', 'kyc-603164-1765377859811-552715828.jpg', 'kyc-603164-1765377859815-800306254.jpg', 'approved', NULL, '2025-12-10 14:44:19', '2025-12-10 14:44:29', 1),
(5, 3, 'nic', 'kyc-939333-1765531688335-524269304.jpg', 'kyc-939333-1765531688341-274073503.jpg', 'declined', 'Not clear image', '2025-12-12 09:28:08', '2025-12-12 09:29:20', 1),
(6, 3, 'nic', 'kyc-939333-1765531803714-612961932.jpg', 'kyc-939333-1765531803717-359527055.jpg', 'approved', NULL, '2025-12-12 09:30:03', '2025-12-12 09:30:11', 1),
(7, 4, 'nic', 'kyc-894782-1766687598677-100469492.jpg', 'kyc-894782-1766687599155-746525439.jpg', 'declined', 'Check', '2025-12-25 18:33:19', '2025-12-25 18:33:55', 1),
(8, 4, 'nic', 'kyc-894782-1766687680749-4734117.jpg', 'kyc-894782-1766687680756-347881425.jpg', 'approved', NULL, '2025-12-25 18:34:40', '2025-12-25 18:34:51', 1),
(9, 5, 'nic', 'kyc-495224-1767896389425-42318846.jpg', 'kyc-495224-1767896389430-260623720.jpg', 'declined', 'Adress invalid', '2026-01-08 18:19:49', '2026-01-08 18:52:38', 1);

-- --------------------------------------------------------

--
-- Table structure for table `licenses`
--

CREATE TABLE `licenses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `license_key` varchar(50) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `status` enum('active','expired','revoked') DEFAULT 'active',
  `activated_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `reminder_sent` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `licenses`
--

INSERT INTO `licenses` (`id`, `user_id`, `payment_id`, `license_key`, `plan_id`, `status`, `activated_at`, `expires_at`, `reminder_sent`, `created_at`) VALUES
(1, 1, 2, 'LEZV-7W2C-A7MQ-J', 4, 'expired', '2025-12-05 19:08:21', '2026-01-05 19:06:00', 0, '2025-12-05 19:06:00'),
(2, 2, 3, '1P78-O9AN-ZKW5-W', 5, 'active', '2025-12-10 14:49:15', '2026-03-10 14:46:46', 0, '2025-12-10 14:46:46'),
(3, 3, 4, 'GGIH-Y8KL-3L8H-X', 6, 'active', '2025-12-12 09:37:10', '2026-12-12 09:34:06', 0, '2025-12-12 09:34:06'),
(4, 1, 18, 'LIX5-7WJV-9AJK-D', 4, 'active', '2025-12-25 17:26:18', '2026-01-25 17:25:35', 0, '2025-12-25 17:25:35'),
(5, 1, 17, '0SK1-V0UI-1R95-H', 4, 'active', NULL, '2026-01-25 17:35:56', 0, '2025-12-25 17:35:56'),
(6, 1, 19, 'VNSP-GNUC-YIWE-Y', 5, 'active', NULL, '2026-03-25 18:03:08', 0, '2025-12-25 18:03:08'),
(7, 1, 20, '1TBP-0LU0-P9J2-J', 6, 'active', '2025-12-25 18:14:13', '2026-12-25 18:11:33', 0, '2025-12-25 18:11:33'),
(8, 1, 21, 'RLEQ-ERK0-44RY-HUTR', 4, 'active', '2025-12-25 18:23:44', '2026-01-25 18:23:21', 0, '2025-12-25 18:23:21'),
(9, 4, 23, 'UX98-7SP0-AJ2L-LERS', 4, 'active', NULL, '2026-01-25 18:36:37', 0, '2025-12-25 18:36:37'),
(10, 4, 25, 'XQQL-RBN7-6Z91-MDPL', 5, 'active', '2025-12-25 18:40:50', '2026-03-25 18:40:03', 0, '2025-12-25 18:40:03'),
(11, 1, 26, '6K7I-Z8MQ-G2TP-7TZ1', 4, 'active', '2026-01-08 21:29:12', '2026-02-08 21:28:24', 0, '2026-01-08 21:28:24');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `type` enum('kyc_submitted','payment_received','license_expiring') NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `payment_method` enum('online','bank_transfer') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `discount_code_id` int(11) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `final_amount` decimal(10,2) NOT NULL,
  `payment_proof` varchar(255) DEFAULT NULL,
  `status` enum('pending','success','failed','declined') DEFAULT 'pending',
  `decline_reason` text DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `plan_id`, `payment_method`, `amount`, `discount_code_id`, `discount_amount`, `final_amount`, `payment_proof`, `status`, `decline_reason`, `transaction_id`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'success', NULL, 'TXN-1764961137276-6ZP5K3GL5', '2025-12-05 18:58:57', '2025-12-05 18:58:57'),
(2, 1, 4, 'bank_transfer', 29.99, 1, 3.00, 26.99, 'payment-862973-1764961545824-783223896.pdf', 'success', NULL, NULL, '2025-12-05 19:05:45', '2025-12-05 19:06:00'),
(3, 2, 5, 'bank_transfer', 79.99, 1, 8.00, 71.99, 'payment-603164-1765377945220-175771407.pdf', 'success', NULL, NULL, '2025-12-10 14:45:45', '2025-12-10 14:46:46'),
(4, 3, 6, 'bank_transfer', 299.99, 1, 30.00, 269.99, 'payment-939333-1765531976418-603129787.pdf', 'success', NULL, NULL, '2025-12-12 09:32:56', '2025-12-12 09:34:06'),
(5, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 16:58:41', '2025-12-25 17:09:37'),
(6, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 17:03:02', '2025-12-25 17:09:31'),
(7, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 17:03:04', '2025-12-25 17:09:24'),
(8, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 17:03:05', '2025-12-25 17:09:19'),
(9, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 17:03:49', '2025-12-25 17:09:15'),
(10, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 17:03:50', '2025-12-25 17:09:01'),
(11, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 17:03:50', '2025-12-25 17:09:07'),
(12, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 17:03:51', '2025-12-25 17:08:56'),
(13, 1, 5, 'online', 79.99, 1, 8.00, 71.99, NULL, 'declined', 'c', NULL, '2025-12-25 17:03:52', '2025-12-25 17:08:49'),
(14, 1, 5, 'online', 79.99, NULL, 0.00, 79.99, NULL, 'declined', 'check', NULL, '2025-12-25 17:04:02', '2025-12-25 17:08:40'),
(15, 1, 5, 'online', 79.99, NULL, 0.00, 79.99, NULL, 'success', NULL, 'pi_3SiI122M1whdTnpP1Lk1plVb', '2025-12-25 17:06:54', '2025-12-25 17:07:52'),
(16, 1, 4, 'online', 29.99, 1, 3.00, 26.99, NULL, 'success', NULL, 'pi_3SiI3w2M1whdTnpP1MkuyeXm', '2025-12-25 17:10:21', '2025-12-25 17:10:52'),
(17, 1, 4, 'bank_transfer', 29.99, 1, 3.00, 26.99, 'payment-862973-1766682965014-568846891.pdf', 'success', NULL, NULL, '2025-12-25 17:16:04', '2025-12-25 17:35:56'),
(18, 1, 4, 'online', 29.99, 1, 3.00, 26.99, NULL, 'success', NULL, 'pi_3SiIIB2M1whdTnpP1JzUf2X9', '2025-12-25 17:25:24', '2025-12-25 17:25:35'),
(19, 1, 5, 'online', 79.99, NULL, 0.00, 79.99, NULL, 'success', NULL, 'pi_3SiIsW2M1whdTnpP0tbumCEU', '2025-12-25 18:02:55', '2025-12-25 18:03:08'),
(20, 1, 6, 'bank_transfer', 299.99, 1, 30.00, 269.99, 'payment-862973-1766686253781-807513837.pdf', 'success', NULL, NULL, '2025-12-25 18:10:53', '2025-12-25 18:11:33'),
(21, 1, 4, 'online', 29.99, NULL, 0.00, 29.99, NULL, 'success', NULL, 'pi_3SiJC62M1whdTnpP1oiQ8Jbe', '2025-12-25 18:23:11', '2025-12-25 18:23:21'),
(22, 4, 4, 'online', 29.99, 1, 3.00, 26.99, NULL, 'pending', NULL, NULL, '2025-12-25 18:35:50', '2025-12-25 18:35:50'),
(23, 4, 4, 'online', 29.99, 1, 3.00, 26.99, NULL, 'success', NULL, 'pi_3SiJOv2M1whdTnpP0ewMX30j', '2025-12-25 18:36:06', '2025-12-25 18:36:37'),
(24, 4, 5, 'bank_transfer', 79.99, 1, 8.00, 71.99, 'payment-894782-1766687897718-746601017.pdf', 'declined', 'Not Receive paymnet', NULL, '2025-12-25 18:38:17', '2025-12-25 18:39:08'),
(25, 4, 5, 'bank_transfer', 79.99, 1, 8.00, 71.99, 'payment-894782-1766687986533-15962627.pdf', 'success', NULL, NULL, '2025-12-25 18:39:46', '2025-12-25 18:40:03'),
(26, 1, 4, 'online', 29.99, 1, 3.00, 26.99, NULL, 'success', NULL, 'pi_3SnQkj2M1whdTnpP1OJ4J2ct', '2026-01-08 21:28:00', '2026-01-08 21:28:24');

-- --------------------------------------------------------

--
-- Table structure for table `pricing_plans`
--

CREATE TABLE `pricing_plans` (
  `id` int(11) NOT NULL,
  `duration_months` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pricing_plans`
--

INSERT INTO `pricing_plans` (`id`, `duration_months`, `price`, `description`, `features`, `is_active`, `created_at`, `updated_at`) VALUES
(4, 1, 29.99, 'Monthly Plan', '[\"Access to all features\", \"Email support\", \"Regular updates\"]', 1, '2025-12-05 17:10:11', '2025-12-05 17:10:11'),
(5, 3, 79.99, 'Quarterly Plan', '[\"Access to all features\", \"Priority email support\", \"Regular updates\", \"10% savings\"]', 1, '2025-12-05 17:10:11', '2026-01-08 21:26:47'),
(6, 12, 299.99, 'Annual Plan', '[\"Access to all features\", \"24/7 priority support\", \"Regular updates\", \"Early access to new features\", \"16% savings\"]', 1, '2025-12-05 17:10:11', '2025-12-05 17:10:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uid` varchar(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firebase_uid` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `profile_completed` tinyint(1) DEFAULT 0,
  `kyc_status` enum('pending','submitted','verified','declined') DEFAULT 'pending',
  `is_active` tinyint(1) DEFAULT 1,
  `suspension_reason` text DEFAULT NULL,
  `kyc_decline_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uid`, `email`, `firebase_uid`, `email_verified`, `first_name`, `middle_name`, `last_name`, `address`, `phone`, `date_of_birth`, `gender`, `profile_completed`, `kyc_status`, `is_active`, `suspension_reason`, `kyc_decline_reason`, `created_at`, `updated_at`) VALUES
(1, '862973', '135hasitha.thennakoon@gmail.com', 'EDZSiEm8BJXidbFcE1iSzU70dX32', 1, 'A.Subhash', 'Sampath', 'Thilakarathna', 'A/Rajanganaya, Tract 08, Paddy Stroke Road, Angamuwa', '0768014470', '2001-05-17', 'male', 1, 'verified', 1, NULL, NULL, '2025-12-05 17:36:58', '2026-01-08 19:52:54'),
(2, '603164', 'saumyapriyadharshani928@gmail.com', 'BUZIb8WRI2ZeFY6HvwNS5YmeRZ03', 1, 'Udara', 'harshani ', 'Thilakarathna', 'Rajanganaya, tract 08, Angamuwa', '0768014470', '2001-05-17', 'male', 1, 'verified', 1, NULL, NULL, '2025-12-10 14:33:46', '2025-12-10 14:44:29'),
(3, '939333', 'form.vividramedia@gmail.com', 'zAFQOkarr8dFmb6E1ir1WGfawHT2', 1, 'Durage', 'Praneeth', 'Sadaruwan', 'Deniyaya, Srilanka', '0768014570', '1997-05-03', 'male', 1, 'verified', 1, NULL, NULL, '2025-12-12 09:10:18', '2025-12-12 09:30:11'),
(4, '894782', 'subhashsampathass@gmail.com', 'GgRZxlqeiIfayR3FYTkgytcTSwq2', 1, 'Mahesha', 'Hasini', 'Thilakarathna', 'Rajanganaya, Anuradhapura', '768014470', '2001-05-17', 'female', 1, 'verified', 1, NULL, NULL, '2025-12-25 18:31:35', '2025-12-25 18:34:51'),
(5, '495224', 'assthilakarathna@gmail.com', 'ArpTPbOJiUO9An3OHfdY7h2u23E2', 1, 'Subhash', 'Sampath', 'Thilakarathna', 'Paddy Stroke Road\nAngamuwa', '0768014470', '2001-05-17', 'male', 1, 'declined', 1, NULL, 'Adress invalid', '2026-01-08 18:16:49', '2026-01-08 20:00:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_id` (`admin_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `discount_codes`
--
ALTER TABLE `discount_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`);

--
-- Indexes for table `kyc_verifications`
--
ALTER TABLE `kyc_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `licenses`
--
ALTER TABLE `licenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_key` (`license_key`),
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `plan_id` (`plan_id`),
  ADD KEY `idx_license_key` (`license_key`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_read` (`is_read`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plan_id` (`plan_id`),
  ADD KEY `discount_code_id` (`discount_code_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `pricing_plans`
--
ALTER TABLE `pricing_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_duration` (`duration_months`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `firebase_uid` (`firebase_uid`),
  ADD KEY `idx_uid` (`uid`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_firebase_uid` (`firebase_uid`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `discount_codes`
--
ALTER TABLE `discount_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kyc_verifications`
--
ALTER TABLE `kyc_verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `licenses`
--
ALTER TABLE `licenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `pricing_plans`
--
ALTER TABLE `pricing_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`id`);

--
-- Constraints for table `kyc_verifications`
--
ALTER TABLE `kyc_verifications`
  ADD CONSTRAINT `kyc_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `licenses`
--
ALTER TABLE `licenses`
  ADD CONSTRAINT `licenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `licenses_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`),
  ADD CONSTRAINT `licenses_ibfk_3` FOREIGN KEY (`plan_id`) REFERENCES `pricing_plans` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `pricing_plans` (`id`),
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`discount_code_id`) REFERENCES `discount_codes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
