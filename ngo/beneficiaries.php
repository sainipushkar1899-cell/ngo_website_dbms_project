<?php
/* ============================================================
   beneficiaries.php - List all beneficiaries in a table
   JOIN projects so we show the project name instead of id.
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'beneficiaries';
include 'includes/header.php';

// Fetch all beneficiaries with project names
$result = $conn->query('
    SELECT b.beneficiary_id, b.beneficiary_name, b.location,
           p.project_name
    FROM beneficiaries b
    JOIN projects p ON b.project_id = p.project_id
    ORDER BY b.beneficiary_id
');

// Message from query string
$msg = $_GET['msg'] ?? '';
$messages = [
    'added'   => 'Beneficiary added successfully.',
    'updated' => 'Beneficiary updated successfully.',
    'deleted' => 'Beneficiary deleted successfully.',
];
?>

<div class="wrapper">
    <div class="page-header">
        <h1>Beneficiaries</h1>
        <a href="beneficiary_form.php" class="btn btn-primary">+ Add New Beneficiary</a>
    </div>

    <?php if ($msg !== ''): ?>
        <?php
        $is_error = !isset($messages[$msg]);
        $notice_text = isset($messages[$msg]) ? $messages[$msg] : htmlspecialchars($msg);
        ?>
        <div class="notice <?php echo $is_error ? 'notice-error' : ''; ?>">
            <?php echo $notice_text; ?>
        </div>
    <?php endif; ?>

    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Beneficiary ID</th>
                    <th>Beneficiary Name</th>
                    <th>Location</th>
                    <th>Project</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($result->num_rows === 0): ?>
                    <tr><td colspan="5" style="text-align:center;">No records yet</td></tr>
                <?php else: ?>
                    <?php while ($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo (int)$row['beneficiary_id']; ?></td>
                            <td><?php echo htmlspecialchars($row['beneficiary_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['location']); ?></td>
                            <td><?php echo htmlspecialchars($row['project_name']); ?></td>
                            <td class="row-actions">
                                <a href="beneficiary_form.php?beneficiary_id=<?php echo (int)$row['beneficiary_id']; ?>">Edit</a>
                                <form action="process_beneficiary.php" method="post">
                                    <input type="hidden" name="beneficiary_id" value="<?php echo (int)$row['beneficiary_id']; ?>">
                                    <button type="submit" name="action" value="delete" class="delete-btn">Delete</button>
                                </form>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
