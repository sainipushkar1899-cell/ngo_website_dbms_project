<?php
/* ============================================================
   donor_form.php - Add / Edit a donor
   If ?donor_id=... is present, load that record and pre-fill
   the form for editing.  Otherwise show an empty add form.
   Form posts to process_donor.php.
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'donors';
include 'includes/header.php';

// Defaults for an empty add form
$donor_id   = 0;
$donor_name = '';
$email      = '';
$phone      = '';
$page_title = 'Add New Donor';

// If editing, load the existing record
if (isset($_GET['donor_id']) && (int)$_GET['donor_id'] > 0) {
    $donor_id = (int)$_GET['donor_id'];
    $stmt = $conn->prepare('SELECT donor_name, email, phone FROM donors WHERE donor_id = ?');
    $stmt->bind_param('i', $donor_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows > 0) {
        $row        = $res->fetch_assoc();
        $donor_name = $row['donor_name'];
        $email      = $row['email'];
        $phone      = $row['phone'];
        $page_title = 'Edit Donor';
    }
}
?>

<div class="wrapper">
    <div class="form-card">
        <h1><?php echo htmlspecialchars($page_title); ?></h1>

        <form action="process_donor.php" method="post">
            <!-- Hidden id and action (set when editing) -->
            <input type="hidden" name="donor_id" value="<?php echo (int)$donor_id; ?>">
            <input type="hidden" name="action" value="<?php echo $donor_id > 0 ? 'edit' : 'add'; ?>">

            <div class="form-group">
                <label for="donor_name">Donor Name</label>
                <input type="text" id="donor_name" name="donor_name"
                       required placeholder="e.g. Rajesh Kumar"
                       value="<?php echo htmlspecialchars($donor_name); ?>">
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email"
                       required placeholder="e.g. rajesh@email.com"
                       value="<?php echo htmlspecialchars($email); ?>">
            </div>

            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone"
                       required placeholder="e.g. 9876543210"
                       value="<?php echo htmlspecialchars($phone); ?>">
            </div>

            <div class="form-actions">
                <a href="donors.php" class="btn btn-cancel">Cancel</a>
                <button type="submit" class="btn btn-primary">Save Donor</button>
            </div>
        </form>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
