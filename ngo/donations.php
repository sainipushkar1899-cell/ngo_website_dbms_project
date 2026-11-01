<?php
/* ============================================================
   donations.php - List all donations in a table
   JOIN donors + projects so we show names instead of ids.
   Total amount line at the bottom (SUM of amount).
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'donations';
include 'includes/header.php';

// Fetch all donations with donor and project names
$result = $conn->query('
    SELECT d.donation_id, d.donor_id, d.project_id,
           donors.donor_name, projects.project_name,
           d.donation_date, d.amount
    FROM donations d
    JOIN donors   ON d.donor_id   = donors.donor_id
    JOIN projects ON d.project_id = projects.project_id
    ORDER BY d.donation_id
');

// Total amount
$total_result = $conn->query('SELECT COALESCE(SUM(amount), 0) AS total FROM donations');
$total_row    = $total_result->fetch_assoc();
$grand_total  = $total_row['total'];

// Message from query string
$msg = $_GET['msg'] ?? '';
$messages = [
    'added'   => 'Donation added successfully.',
    'updated' => 'Donation updated successfully.',
    'deleted' => 'Donation deleted successfully.',
];
?>

<div class="wrapper">
    <div class="page-header">
        <h1>Donations</h1>
        <a href="donate.php" class="btn btn-primary">+ Add Donation</a>
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
                    <th>Donation ID</th>
                    <th>Donor Name</th>
                    <th>Project Name</th>
                    <th>Donation Date</th>
                    <th>Amount (&#8377;)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($result->num_rows === 0): ?>
                    <tr><td colspan="6" style="text-align:center;">No records yet</td></tr>
                <?php else: ?>
                    <?php while ($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo (int)$row['donation_id']; ?></td>
                            <td><?php echo htmlspecialchars($row['donor_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['project_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['donation_date']); ?></td>
                            <td><?php echo number_format($row['amount']); ?></td>
                            <td class="row-actions">
                                <a href="donate.php?donation_id=<?php echo (int)$row['donation_id']; ?>">Edit</a>
                                <form action="process_donation.php" method="post">
                                    <input type="hidden" name="donation_id" value="<?php echo (int)$row['donation_id']; ?>">
                                    <button type="submit" name="action" value="delete" class="delete-btn">Delete</button>
                                </form>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Total amount line -->
    <div class="total-line">
        Total Donations: &#8377; <?php echo number_format($grand_total); ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
