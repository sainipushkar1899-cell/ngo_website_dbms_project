<?php
/* ============================================================
   index.php - Home Page
   Hero section, impact figures (live from DB), cause cards,
   about section.
   ============================================================ */
require_once 'includes/db.php';

$current_page = 'home';
include 'includes/header.php';

// Live impact figures
$total_donated    = $conn->query('SELECT COALESCE(SUM(amount), 0) AS total FROM donations')->fetch_assoc()['total'];
$num_donors       = $conn->query('SELECT COUNT(*) AS cnt FROM donors')->fetch_assoc()['cnt'];
$num_projects     = $conn->query('SELECT COUNT(*) AS cnt FROM projects')->fetch_assoc()['cnt'];
$num_beneficiaries = $conn->query('SELECT COUNT(*) AS cnt FROM beneficiaries')->fetch_assoc()['cnt'];
?>

<!-- ============ HERO SECTION ============ -->
<section class="hero">
    <div class="wrapper">
        <div class="hero-text">
            <h1>Together We Can Bring Hope</h1>
            <p>
                Hope Foundation works to improve education, healthcare,
                environment, and food security for communities in need.
                Your donation directly supports real projects with real impact.
            </p>
            <a href="donate.php" class="btn-donate">Donate Now</a>
        </div>
        <div class="hero-image">
            <img src="images/community.png" alt="Hope Foundation volunteers planting together in a community garden">
        </div>
    </div>
</section>

<!-- ============ IMPACT FIGURES ============ -->
<section class="section">
    <div class="wrapper">
        <div class="impact-bar">
            <div class="impact-figure">
                <h3><?php echo number_format($num_beneficiaries); ?></h3>
                <p>Beneficiaries Reached</p>
            </div>
            <div class="impact-figure">
                <h3><?php echo number_format($num_projects); ?></h3>
                <p>Active Projects</p>
            </div>
            <div class="impact-figure">
                <h3><?php echo number_format($num_donors); ?></h3>
                <p>Donors</p>
            </div>
            <div class="impact-figure">
                <h3>&#8377;<?php echo number_format($total_donated); ?></h3>
                <p>Funds Raised</p>
            </div>
        </div>
    </div>
</section>

<!-- ============ CAUSE CARDS ============ -->
<section class="section">
    <div class="wrapper">
        <h2 class="section-title">Our Causes</h2>
        <div class="cards-grid">

            <!-- Education -->
            <div class="card">
                <div class="card-image">
                    <img src="images/education_photo.png" alt="Children in a classroom studying">
                </div>
                <div class="card-body">
                    <h3>Education</h3>
                    <p>Support schools, books, and scholarships for children in underserved areas.</p>
                    <a href="donate.php" class="btn btn-primary">Donate</a>
                </div>
            </div>

            <!-- Health -->
            <div class="card">
                <div class="card-image">
                    <img src="images/health_photo.png" alt="Healthcare camp with doctors and patients">
                </div>
                <div class="card-body">
                    <h3>Health</h3>
                    <p>Fund medical camps, check-ups, and essential medicines for rural communities.</p>
                    <a href="donate.php" class="btn btn-primary">Donate</a>
                </div>
            </div>

            <!-- Environment -->
            <div class="card">
                <div class="card-image">
                    <img src="images/enviornment_photo.png" alt="Volunteers planting trees">
                </div>
                <div class="card-body">
                    <h3>Environment</h3>
                    <p>Plant trees, clean drives, and awareness programmes for a greener tomorrow.</p>
                    <a href="donate.php" class="btn btn-primary">Donate</a>
                </div>
            </div>

            <!-- Food -->
            <div class="card">
                <div class="card-image">
                    <img src="images/food_photo.png" alt="Food distribution to people in need">
                </div>
                <div class="card-body">
                    <h3>Food</h3>
                    <p>Distribute meals and dry rations to families facing food insecurity.</p>
                    <a href="donate.php" class="btn btn-primary">Donate</a>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- ============ ABOUT SECTION ============ -->
<section class="about-section">
    <div class="wrapper">
        <div class="about-text">
            <h2>About Hope Foundation</h2>
            <p>
                Hope Foundation is a non-profit organisation dedicated to uplifting
                communities through education, healthcare, environmental action, and
                food security. Since our founding, we have partnered with volunteers,
                donors, and local leaders to deliver real change on the ground.
            </p>
            <p>
                Every rupee you donate is tracked from donor to project to beneficiary.
                Explore our <a href="reports.php">reports</a> to see the full picture.
            </p>
        </div>
        <div class="about-image">
            <img src="images/community.png" alt="Hope Foundation volunteers working together">
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
