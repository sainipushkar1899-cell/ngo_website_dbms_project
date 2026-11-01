<?php
/* ============================================================
   beneficiary_form.php - Add / Edit a beneficiary
   If ?beneficiary_id=... is present, load that record and
   pre-fill the form for editing.  Otherwise show an empty
   add form.  Project is a <select> dropdown filled from DB.
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'beneficiaries';
include 'includes/header.php';

// Defaults
$beneficiary_id   = 0;
$beneficiary_name = '';
$location         = '';
$project_id       = 0;
$page_title       = 'Add New Beneficiary';

if (isset($_GET['beneficiary_id']) && (int)$_GET['beneficiary_id'] > 0) {
    $beneficiary_id = (int)$_GET['beneficiary_id'];
    $stmt = $conn->prepare('SELECT beneficiary_name, location, project_id FROM beneficiaries WHERE beneficiary_id = ?');
    $stmt->bind_param('i', $beneficiary_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows > 0) {
        $row             = $res->fetch_assoc();
        $beneficiary_name = $row['beneficiary_name'];
        $location         = $row['location'];
        $project_id       = (int)$row['project_id'];
        $page_title       = 'Edit Beneficiary';
    }
}

// Fetch all projects for the dropdown
$projects = $conn->query('SELECT project_id, project_name FROM projects ORDER BY project_id');
?>

<div class="wrapper">
    <div class="form-card">
        <h1><?php echo htmlspecialchars($page_title); ?></h1>

        <form action="process_beneficiary.php" method="post">
            <!-- Hidden id and action -->
            <input type="hidden" name="beneficiary_id" value="<?php echo (int)$beneficiary_id; ?>">
            <input type="hidden" name="action" value="<?php echo $beneficiary_id > 0 ? 'edit' : 'add'; ?>">

            <div class="form-group">
                <label for="beneficiary_name">Beneficiary Name</label>
                <input type="text" id="beneficiary_name" name="beneficiary_name"
                       required placeholder="e.g. Aarav Singh"
                       value="<?php echo htmlspecialchars($beneficiary_name); ?>">
            </div>

            <div class="form-group">
                <label for="location">Location</label>
                <input type="text" id="location" name="location"
                       required placeholder="e.g. Jaipur, Rajasthan"
                       value="<?php echo htmlspecialchars($location); ?>">
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

            <div class="form-actions">
                <a href="beneficiaries.php" class="btn btn-cancel">Cancel</a>
                <button type="submit" class="btn btn-primary">Save Beneficiary</button>
            </div>
        </form>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
