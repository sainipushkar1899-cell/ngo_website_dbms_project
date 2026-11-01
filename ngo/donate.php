<?php
/* ============================================================
   donate.php - Make a Donation (add or edit)
   If ?donation_id=... is present, load that record and
   pre-fill the form for editing.  Otherwise show an empty
   add form.  Donor and project <select>s are filled from DB.
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'donate';
include 'includes/header.php';

// Defaults
$donation_id   = 0;
$donor_id      = 0;
$project_id    = 0;
$donation_date = '';
$amount        = '';
$page_title    = 'Make a Donation';

if (isset($_GET['donation_id']) && (int)$_GET['donation_id'] > 0) {
    $donation_id = (int)$_GET['donation_id'];
    $stmt = $conn->prepare('SELECT donor_id, project_id, donation_date, amount FROM donations WHERE donation_id = ?');
    $stmt->bind_param('i', $donation_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows > 0) {
        $row           = $res->fetch_assoc();
        $donor_id      = (int)$row['donor_id'];
        $project_id    = (int)$row['project_id'];
        $donation_date = $row['donation_date'];
        $amount        = $row['amount'];
        $page_title    = 'Edit Donation';
    }
}

// Fetch donors and projects for dropdowns
$donors   = $conn->query('SELECT donor_id, donor_name FROM donors ORDER BY donor_id');
$projects = $conn->query('SELECT project_id, project_name FROM projects ORDER BY project_id');
?>

<div class="wrapper">
    <div class="form-card">
        <h1><?php echo htmlspecialchars($page_title); ?></h1>

        <form action="process_donation.php" method="post">
            <!-- Hidden id and action -->
            <input type="hidden" name="donation_id" value="<?php echo (int)$donation_id; ?>">
            <input type="hidden" name="action" value="<?php echo $donation_id > 0 ? 'edit' : 'add'; ?>">

            <div class="form-group">
                <label for="donor_id">Donor</label>
                <select id="donor_id" name="donor_id" required>
                    <option value="">-- Select Donor --</option>
                    <?php while ($d = $donors->fetch_assoc()): ?>
                        <option value="<?php echo (int)$d['donor_id']; ?>"
                            <?php echo $donor_id === (int)$d['donor_id'] ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($d['donor_name']); ?>
                        </option>
                    <?php endwhile; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="project_id">Project</label>
                <select id="project_id" name="project_id" required>
                    <option value="">-- Select Project --</option>
                    <?php while ($p = $projects->fetch_assoc()): ?>
                        <option value="<?php echo (int)$p['project_id']; ?>"
                            <?php echo $project_id === (int)$p['project_id'] ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($p['project_name']); ?>
                        </option>
                    <?php endwhile; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="donation_date">Donation Date</label>
                <input type="date" id="donation_date" name="donation_date" required
                       value="<?php echo htmlspecialchars($donation_date); ?>">
            </div>

            <div class="form-group">
                <label for="amount">Amount (&#8377;)</label>
                <input type="number" id="amount" name="amount"
                       min="1" step="1" required placeholder="e.g. 5000"
                       value="<?php echo $amount !== '' ? htmlspecialchars($amount) : ''; ?>">
                <p class="hint">Enter the donation amount in rupees (minimum &#8377;1).</p>
            </div>

            <div class="form-actions">
                <a href="donations.php" class="btn btn-cancel">Cancel</a>
                <button type="submit" class="btn btn-primary"><?php echo $donation_id > 0 ? 'Update Donation' : 'Donate'; ?></button>
            </div>
        </form>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
