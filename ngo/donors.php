<?php
/* ============================================================
   donors.php - List all donors in a table
   Live data from the donors table.
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'donors';
include 'includes/header.php';

// Fetch all donors
$result = $conn->query('SELECT donor_id, donor_name, email, phone FROM donors ORDER BY donor_id');

// Message from query string (after add/edit/delete redirect)
$msg = $_GET['msg'] ?? '';
$messages = [
    'added'   => 'Donor added successfully.',
    'updated' => 'Donor updated successfully.',
    'deleted' => 'Donor deleted successfully.',
];
?>

<div class="wrapper">
    <div class="page-header">
        <h1>Donors</h1>
        <a href="donor_form.php" class="btn btn-primary">+ Add New Donor</a>
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
                    <th>Donor ID</th>
                    <th>Donor Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($result->num_rows === 0): ?>
                    <tr><td colspan="5" style="text-align:center;">No records yet</td></tr>
                <?php else: ?>
                    <?php while ($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo (int)$row['donor_id']; ?></td>
                            <td><?php echo htmlspecialchars($row['donor_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['email']); ?></td>
                            <td><?php echo htmlspecialchars($row['phone']); ?></td>
                            <td class="row-actions">
                                <a href="donor_form.php?donor_id=<?php echo (int)$row['donor_id']; ?>">Edit</a>
                                <form action="process_donor.php" method="post">
                                    <input type="hidden" name="donor_id" value="<?php echo (int)$row['donor_id']; ?>">
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
