<?php
/* ============================================================
   process_donor.php - Add / Edit / Delete a donor
   Accepts POST only.  Fields: action, donor_id, donor_name,
   email, phone.
   Redirects to donors.php with a message.
   ============================================================ */
require_once 'includes/db.php';

// Reject GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: donors.php');
    exit;
}

$action   = $_POST['action']   ?? '';
$donor_id = $_POST['donor_id'] ?? 0;
$donor_id = (int)$donor_id;

/* ---------- DELETE ---------- */
if ($action === 'delete') {
    try {
        $stmt = $conn->prepare('DELETE FROM donors WHERE donor_id = ?');
        $stmt->bind_param('i', $donor_id);
        $stmt->execute();
        header('Location: donors.php?msg=deleted');
        exit;
    } catch (mysqli_sql_exception $e) {
        // FK RESTRICT – donor still has donations
        header('Location: donors.php?msg=' . urlencode('Cannot delete this donor: they have donations recorded.'));
        exit;
    }
}

/* ---------- ADD / EDIT – validate first ---------- */
$donor_name = trim($_POST['donor_name'] ?? '');
$email      = trim($_POST['email'] ?? '');
$phone      = trim($_POST['phone'] ?? '');

$errors = [];

if ($donor_name === '') {
    $errors[] = 'Donor name is required.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email is required.';
}
if ($phone === '') {
    $errors[] = 'Phone is required.';
}

if ($errors) {
    header('Location: donors.php?msg=' . urlencode(implode(' ', $errors)));
    exit;
}

/* ---------- ADD ---------- */
if ($action === 'add') {
    try {
        $stmt = $conn->prepare('INSERT INTO donors (donor_name, email, phone) VALUES (?, ?, ?)');
        $stmt->bind_param('sss', $donor_name, $email, $phone);
        $stmt->execute();
        header('Location: donors.php?msg=added');
        exit;
    } catch (mysqli_sql_exception $e) {
        if (strpos($e->getMessage(), 'Duplicate') !== false) {
            header('Location: donors.php?msg=' . urlencode('A donor with this email already exists.'));
        } else {
            header('Location: donors.php?msg=' . urlencode('Error: ' . $e->getMessage()));
        }
        exit;
    }
}

/* ---------- EDIT ---------- */
if ($action === 'edit') {
    try {
        $stmt = $conn->prepare('UPDATE donors SET donor_name = ?, email = ?, phone = ? WHERE donor_id = ?');
        $stmt->bind_param('sssi', $donor_name, $email, $phone, $donor_id);
        $stmt->execute();
        header('Location: donors.php?msg=updated');
        exit;
    } catch (mysqli_sql_exception $e) {
        if (strpos($e->getMessage(), 'Duplicate') !== false) {
            header('Location: donors.php?msg=' . urlencode('A donor with this email already exists.'));
        } else {
            header('Location: donors.php?msg=' . urlencode('Error: ' . $e->getMessage()));
        }
        exit;
    }
}

// Unknown action
header('Location: donors.php?msg=error');
exit;
