<?php
/* ============================================================
   projects.php - List all projects in a table
   Live data from the projects table.
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'projects';
include 'includes/header.php';

// Fetch all projects
$result = $conn->query('SELECT project_id, project_name, category, budget FROM projects ORDER BY project_id');

// Message from query string
$msg = $_GET['msg'] ?? '';
$messages = [
    'added'   => 'Project added successfully.',
    'updated' => 'Project updated successfully.',
    'deleted' => 'Project deleted successfully.',
];
?>

<div class="wrapper">
    <div class="page-header">
        <h1>Projects</h1>
        <a href="project_form.php" class="btn btn-primary">+ Add New Project</a>
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
                    <th>Project ID</th>
                    <th>Project Name</th>
                    <th>Category</th>
                    <th>Budget (&#8377;)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($result->num_rows === 0): ?>
                    <tr><td colspan="5" style="text-align:center;">No records yet</td></tr>
                <?php else: ?>
                    <?php while ($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo (int)$row['project_id']; ?></td>
                            <td><?php echo htmlspecialchars($row['project_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['category']); ?></td>
                            <td><?php echo number_format($row['budget']); ?></td>
                            <td class="row-actions">
                                <a href="project_form.php?project_id=<?php echo (int)$row['project_id']; ?>">Edit</a>
                                <form action="process_project.php" method="post">
                                    <input type="hidden" name="project_id" value="<?php echo (int)$row['project_id']; ?>">
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
