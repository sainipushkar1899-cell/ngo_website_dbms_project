<?php
/* ============================================================
   process_project.php - Add / Edit / Delete a project
   Accepts POST only.  Fields: action, project_id,
   project_name, category, budget.
   Redirects to projects.php with a message.
   ============================================================ */
require_once 'includes/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: projects.php');
    exit;
}

$action     = $_POST['action']     ?? '';
$project_id = $_POST['project_id'] ?? 0;
$project_id = (int)$project_id;

/* ---------- DELETE ---------- */
if ($action === 'delete') {
    try {
        $stmt = $conn->prepare('DELETE FROM projects WHERE project_id = ?');
        $stmt->bind_param('i', $project_id);
        $stmt->execute();
        header('Location: projects.php?msg=deleted');
        exit;
    } catch (mysqli_sql_exception $e) {
        // FK RESTRICT – project has donations or beneficiaries
        header('Location: projects.php?msg=' . urlencode('Cannot delete this project: it has donations or beneficiaries linked to it.'));
        exit;
    }
}

/* ---------- ADD / EDIT – validate ---------- */
$project_name = trim($_POST['project_name'] ?? '');
$category     = $_POST['category'] ?? '';
$budget       = $_POST['budget'] ?? '';

$allowed_categories = ['Education', 'Health', 'Environment', 'Food', 'Other'];

$errors = [];

if ($project_name === '') {
    $errors[] = 'Project name is required.';
}
if (!in_array($category, $allowed_categories)) {
    $errors[] = 'Category must be one of: ' . implode(', ', $allowed_categories) . '.';
}
if (!is_numeric($budget) || (float)$budget < 0) {
    $errors[] = 'Budget must be a number >= 0.';
}

if ($errors) {
    header('Location: projects.php?msg=' . urlencode(implode(' ', $errors)));
    exit;
}

$budget = (float)$budget;

/* ---------- ADD ---------- */
if ($action === 'add') {
    try {
        $stmt = $conn->prepare('INSERT INTO projects (project_name, category, budget) VALUES (?, ?, ?)');
        $stmt->bind_param('ssd', $project_name, $category, $budget);
        $stmt->execute();
        header('Location: projects.php?msg=added');
        exit;
    } catch (mysqli_sql_exception $e) {
        header('Location: projects.php?msg=' . urlencode('Error: ' . $e->getMessage()));
        exit;
    }
}

/* ---------- EDIT ---------- */
if ($action === 'edit') {
    try {
        $stmt = $conn->prepare('UPDATE projects SET project_name = ?, category = ?, budget = ? WHERE project_id = ?');
        $stmt->bind_param('ssdi', $project_name, $category, $budget, $project_id);
        $stmt->execute();
        header('Location: projects.php?msg=updated');
        exit;
    } catch (mysqli_sql_exception $e) {
        header('Location: projects.php?msg=' . urlencode('Error: ' . $e->getMessage()));
        exit;
    }
}

header('Location: projects.php?msg=error');
exit;
