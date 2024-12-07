<?php
session_start();

// Check if this is the first visit
if (!isset($_SESSION['first_visit'])) {
    // First visit - set the flag and redirect to splash
    $_SESSION['first_visit'] = true;
    header('Location: splash.html');
    exit;
} else {
    // Not first visit - redirect directly to login
    header('Location: index.html');
    exit;
}
?>
