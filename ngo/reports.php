<?php
/* ============================================================
   reports.php - Reports Dashboard
   4 live report sections with SQL shown in <pre> blocks:
   (a) Total donated per project vs budget (% funded)
   (b) Total donated by each donor (count + sum)
   (c) Beneficiaries per project (LEFT JOIN + COUNT)
   (d) Top 5 donors by total amount
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'reports';
include 'includes/header.php';

/* ---------- (a) Total donated per project vs budget ---------- */
$sql_a = "
    SELECT p.project_name,
           p.budget,
           COALESCE(SUM(d.amount), 0) AS total_donated,
           ROUND(COALESCE(SUM(d.amount), 0) / p.budget * 100, 1) AS pct_funded
    FROM projects p
    LEFT JOIN donations d ON p.project_id = d.project_id
    GROUP BY p.project_id, p.project_name, p.budget
    ORDER BY p.project_id
";
$result_a = $conn->query($sql_a);

/* ---------- (b) Total donated by each donor ---------- */
$sql_b = "
    SELECT donors.donor_name,
           COUNT(donations.donation_id) AS num_donations,
           COALESCE(SUM(donations.amount), 0) AS total_amount
    FROM donors
    JOIN donations ON donors.donor_id = donations.donor_id
    GROUP BY donors.donor_id, donors.donor_name
    ORDER BY total_amount DESC
";
$result_b = $conn->query($sql_b);

/* ---------- (c) Beneficiaries per project ---------- */
$sql_c = "
    SELECT p.project_name,
           COUNT(b.beneficiary_id) AS num_beneficiaries,
           GROUP_CONCAT(b.location SEPARATOR ', ') AS locations
    FROM projects p
    LEFT JOIN beneficiaries b ON p.project_id = b.project_id
    GROUP BY p.project_id, p.project_name
    ORDER BY p.project_id
";
$result_c = $conn->query($sql_c);

/* ---------- (d) Top 5 donors by total amount ---------- */
$sql_d = "
    SELECT donors.donor_name,
           COUNT(donations.donation_id) AS num_donations,
           SUM(donations.amount) AS total_amount
    FROM donors
    JOIN donations ON donors.donor_id = donations.donor_id
    GROUP BY donors.donor_id, donors.donor_name
    ORDER BY total_amount DESC
    LIMIT 5
";
$result_d = $conn->query($sql_d);
?>

<div class="wrapper">
    <h1 class="section-title">Reports &amp; Analytics</h1>

    <!-- ============ Report A: Donations vs Budget ============ -->
    <div class="report-section">
        <h2>(a) Total Donated per Project vs Budget</h2>
        <pre class="sql-block"><?php echo htmlspecialchars($sql_a); ?></pre>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Budget (&#8377;)</th>
                        <th>Total Donated (&#8377;)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result_a->num_rows === 0): ?>
                        <tr><td colspan="4" style="text-align:center;">No records yet</td></tr>
                    <?php else: ?>
                        <?php while ($row = $result_a->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($row['project_name']); ?></td>
                                <td><?php echo number_format($row['budget']); ?></td>
                                <td><?php echo number_format($row['total_donated']); ?></td>
                                <td><?php echo $row['pct_funded'] . '% Funded'; ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- ============ Report B: Donations by Donor ============ -->
    <div class="report-section">
        <h2>(b) Donations Made by Each Donor</h2>
        <pre class="sql-block"><?php echo htmlspecialchars($sql_b); ?></pre>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Donor Name</th>
                        <th>Number of Donations</th>
                        <th>Total Amount (&#8377;)</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result_b->num_rows === 0): ?>
                        <tr><td colspan="3" style="text-align:center;">No records yet</td></tr>
                    <?php else: ?>
                        <?php while ($row = $result_b->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($row['donor_name']); ?></td>
                                <td><?php echo (int)$row['num_donations']; ?></td>
                                <td><?php echo number_format($row['total_amount']); ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- ============ Report C: Beneficiaries per Project ============ -->
    <div class="report-section">
        <h2>(c) Beneficiaries per Project</h2>
        <pre class="sql-block"><?php echo htmlspecialchars($sql_c); ?></pre>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Number of Beneficiaries</th>
                        <th>Locations Covered</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result_c->num_rows === 0): ?>
                        <tr><td colspan="3" style="text-align:center;">No records yet</td></tr>
                    <?php else: ?>
                        <?php while ($row = $result_c->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($row['project_name']); ?></td>
                                <td><?php echo (int)$row['num_beneficiaries']; ?></td>
                                <td><?php echo $row['locations'] !== null ? htmlspecialchars($row['locations']) : '—'; ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- ============ Report D: Top 5 Donors ============ -->
    <div class="report-section">
        <h2>(d) Top 5 Donors</h2>
        <pre class="sql-block"><?php echo htmlspecialchars($sql_d); ?></pre>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Donor Name</th>
                        <th>Total Donated (&#8377;)</th>
                        <th>Number of Donations</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result_d->num_rows === 0): ?>
                        <tr><td colspan="4" style="text-align:center;">No records yet</td></tr>
                    <?php else: ?>
                        <?php $rank = 1; ?>
                        <?php while ($row = $result_d->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo $rank++; ?></td>
                                <td><?php echo htmlspecialchars($row['donor_name']); ?></td>
                                <td><?php echo number_format($row['total_amount']); ?></td>
                                <td><?php echo (int)$row['num_donations']; ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

</div>

<?php include 'includes/footer.php'; ?>
