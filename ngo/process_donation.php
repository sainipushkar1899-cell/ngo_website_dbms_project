<?php
/* ============================================================
   process_donation.php - Add / Edit / Delete a donation
   Accepts POST only.  Fields: action, donation_id, donor_id,
   project_id, donation_date, amount.
   Redirects to donations.php with a message.
   ============================================================ */
require_once 'includes/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: donations.php');
    exit;
}

$action       = $_POST['action']       ?? '';
$donation_id  = $_POST['donation_id']  ?? 0;
$donation_id  = (int)$donation_id;

/* ---------- DELETE ---------- */
if ($action === 'delete') {
    try {
        $stmt = $conn->prepare('DELETE FROM donations WHERE donation_id = ?');
        $stmt->bind_param('i', $donation_id);
        $stmt->execute();
        header('Location: donations.php?msg=deleted');
        exit;
    } catch (mysqli_sql_exception $e) {
        header('Location: donations.php?msg=' . urlencode('Cannot delete this donation.'));
        exit;
    }
}

/* ---------- ADD / EDIT – validate ---------- */
$donor_id      = $_POST['donor_id']      ?? 0;
$project_id    = $_POST['project_id']    ?? 0;
$donation_date = trim($_POST['donation_date'] ?? '');
$amount        = $_POST['amount'] ?? '';

$donor_id   = (int)$donor_id;
$project_id = (int)$project_id;

$errors = [];

if ($donor_id <= 0) {
    $errors[] = 'Donor is required.';
}
if ($project_id <= 0) {
    $errors[] = 'Project is required.';
}
// Validate date format YYYY-MM-DD
if ($donation_date === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $donation_date)) {
    $errors[] = 'A valid donation date is required.';
} else {
    // Check the date actually exists
    $parts = explode('-', $donation_date);
    if (!checkdate((int)$parts[1], (int)$parts[2], (int)$parts[0])) {
        $errors[] = 'The donation date is not a real calendar date.';
    }
}
if (!is_numeric($amount) || (float)$amount <= 0) {
    $errors[] = 'Amount must be a number greater than 0.';
}

if ($errors) {
    header('Location: donations.php?msg=' . urlencode(implode(' ', $errors)));
    exit;
}

$amount = (float)$amount;

/* ---------- ADD ---------- */
if ($action === 'add') {
    try {
        $stmt = $conn->prepare('INSERT INTO donations (donor_id, project_id, donation_date, amount) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('iisd', $donor_id, $project_id, $donation_date, $amount);
        $stmt->execute();
        header('Location: donations.php?msg=added');
        exit;
    } catch (mysqli_sql_exception $e) {
        header('Location: donations.php?msg=' . urlencode('Error: ' . $e->getMessage()));
        exit;
    }
}

/* ---------- EDIT ---------- */
if ($action === 'edit') {
    try {
        $stmt = $conn->prepare('UPDATE donations SET donor_id = ?, project_id = ?, donation_date = ?, amount = ? WHERE donation_id = ?');
        $stmt->bind_param('iisdi', $donor_id, $project_id, $donation_date, $amount, $donation_id);
        $stmt->execute();
        header('Location: donations.php?msg=updated');
        exit;
    } catch (mysqli_sql_exception $e) {
        header('Location: donations.php?msg=' . urlencode('Error: ' . $e->getMessage()));
        exit;
    }
}

header('Location: donations.php?msg=error');
exit;
