<?php
/* ============================================================
   includes/header.php - Shared site header + navigation
   Each page sets $current_page before including this file
   so the active nav link gets the "active" CSS class.
   ============================================================
*/
if (!isset($current_page)) {
    $current_page = '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hope Foundation - NGO Donation Management System</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<!-- ============ HEADER & NAV ============ -->
<header class="site-header">
    <div class="wrapper">
        <div class="site-logo">Hope<span> Foundation</span></div>
        <nav class="nav">
            <a href="index.php"        class="<?php echo ($current_page === 'home')         ? 'active' : ''; ?>">Home</a>
            <a href="donors.php"       class="<?php echo ($current_page === 'donors')       ? 'active' : ''; ?>">Donors</a>
            <a href="projects.php"     class="<?php echo ($current_page === 'projects')     ? 'active' : ''; ?>">Projects</a>
            <a href="donate.php"      class="<?php echo ($current_page === 'donate')        ? 'active' : ''; ?>">Donate</a>
            <a href="donations.php"   class="<?php echo ($current_page === 'donations')    ? 'active' : ''; ?>">Donations</a>
            <a href="beneficiaries.php" class="<?php echo ($current_page === 'beneficiaries') ? 'active' : ''; ?>">Beneficiaries</a>
            <a href="reports.php"     class="<?php echo ($current_page === 'reports')      ? 'active' : ''; ?>">Reports</a>
        </nav>
    </div>
</header>
