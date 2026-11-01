<?php
/* ============================================================
   process_beneficiary.php - Add / Edit / Delete a beneficiary
   Accepts POST only.  Fields: action, beneficiary_id,
   beneficiary_name, location, project_id.
   Redirects to beneficiaries.php with a message.
   ============================================================ */
require_once 'includes/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: beneficiaries.php');
    exit;
}

$action         = $_POST['action']         ?? '';
$beneficiary_id = $_POST['beneficiary_id'] ?? 0;
$beneficiary_id = (int)$beneficiary_id;

/* ---------- DELETE ---------- */
if ($action === 'delete') {
    try {
        $stmt = $conn->prepare('DELETE FROM beneficiaries WHERE beneficiary_id = ?');
        $stmt->bind_param('i', $beneficiary_id);
        $stmt->execute();
        header('Location: beneficiaries.php?msg=deleted');
        exit;
    } catch (mysqli_sql_exception $e) {
        header('Location: beneficiaries.php?msg=' . urlencode('Cannot delete this beneficiary.'));
        exit;
    }
}

/* ---------- ADD / EDIT – validate ---------- */
$beneficiary_name = trim($_POST['beneficiary_name'] ?? '');
$location         = trim($_POST['location'] ?? '');
$project_id       = $_POST['project_id'] ?? 0;
$project_id       = (int)$project_id;

$errors = [];

if ($beneficiary_name === '') {
    $errors[] = 'Beneficiary name is required.';
}
if ($location === '') {
    $errors[] = 'Location is required.';
}
if ($project_id <= 0) {
    $errors[] = 'Project is required.';
}

if ($errors) {
    header('Location: beneficiaries.php?msg=' . urlencode(implode(' ', $errors)));
    exit;
}

/* ---------- ADD ---------- */
if ($action === 'add') {
    try {
        $stmt = $conn->prepare('INSERT INTO beneficiaries (beneficiary_name, location, project_id) VALUES (?, ?, ?)');
        $stmt->bind_param('ssi', $beneficiary_name, $location, $project_id);
        $stmt->execute();
        header('Location: beneficiaries.php?msg=added');
        exit;
    } catch (mysqli_sql_exception $e) {
        header('Location: beneficiaries.php?msg=' . urlencode('Error: ' . $e->getMessage()));
        exit;
    }
}

/* ---------- EDIT ---------- */
if ($action === 'edit') {
    try {
        $stmt = $conn->prepare('UPDATE beneficiaries SET beneficiary_name = ?, location = ?, project_id = ? WHERE beneficiary_id = ?');
        $stmt->bind_param('ssii', $beneficiary_name, $location, $project_id, $beneficiary_id);
        $stmt->execute();
        header('Location: beneficiaries.php?msg=updated');
        exit;
    } catch (mysqli_sql_exception $e) {
        header('Location: beneficiaries.php?msg=' . urlencode('Error: ' . $e->getMessage()));
        exit;
    }
}

header('Location: beneficiaries.php?msg=error');
exit;
