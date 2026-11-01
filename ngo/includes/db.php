<?php
/* ============================================================
   includes/db.php - Database connection (mysqli)
   Every page includes this with require_once.
   Error mode: throw exceptions on SQL errors.
   ============================================================ */

// Tell mysqli to throw exceptions instead of silent errors
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Connect to MariaDB
$conn = new mysqli('127.0.0.1', 'ngo_user', 'ngo_pass123', 'ngo_db');

// Use UTF-8 for all text
$conn->set_charset('utf8mb4');
