<?php
/* ============================================================
   project_form.php - Add / Edit a project
   If ?project_id=... is present, load that record and pre-fill
   the form for editing.  Otherwise show an empty add form.
   Category is a <select> dropdown.
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'projects';
include 'includes/header.php';

// Defaults
$project_id   = 0;
$project_name = '';
$category     = '';
$budget       = '';
$page_title   = 'Add New Project';

if (isset($_GET['project_id']) && (int)$_GET['project_id'] > 0) {
    $project_id = (int)$_GET['project_id'];
    $stmt = $conn->prepare('SELECT project_name, category, budget FROM projects WHERE project_id = ?');
    $stmt->bind_param('i', $project_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows > 0) {
        $row         = $res->fetch_assoc();
        $project_name = $row['project_name'];
        $category     = $row['category'];
        $budget       = $row['budget'];
        $page_title   = 'Edit Project';
    }
}

$allowed_categories = ['Education', 'Health', 'Environment', 'Food', 'Other'];
?>

<div class="wrapper">
    <div class="form-card">
        <h1><?php echo htmlspecialchars($page_title); ?></h1>

        <form action="process_project.php" method="post">
            <!-- Hidden id and action -->
            <input type="hidden" name="project_id" value="<?php echo (int)$project_id; ?>">
            <input type="hidden" name="action" value="<?php echo $project_id > 0 ? 'edit' : 'add'; ?>">

            <div class="form-group">
                <label for="project_name">Project Name</label>
                <input type="text" id="project_name" name="project_name"
                       required placeholder="e.g. School Books Drive"
                       value="<?php echo htmlspecialchars($project_name); ?>">
            </div>

            <div class="form-group">
                <label for="category">Category</label>
                <select id="category" name="category" required>
                    <option value="">-- Select Category --</option>
                    <?php foreach ($allowed_categories as $cat): ?>
                        <option value="<?php echo htmlspecialchars($cat); ?>"
                            <?php echo $category === $cat ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($cat); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="budget">Budget (&#8377;)</label>
                <input type="number" id="budget" name="budget"
                       min="0" step="1" required placeholder="e.g. 50000"
                       value="<?php echo $budget !== '' ? htmlspecialchars($budget) : ''; ?>">
                <p class="hint">Enter the target budget in rupees.</p>
            </div>

            <div class="form-actions">
                <a href="projects.php" class="btn btn-cancel">Cancel</a>
                <button type="submit" class="btn btn-primary">Save Project</button>
            </div>
        </form>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
