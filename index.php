<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lightning Log Searcher</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-bolt"></i> Lightning Log Searcher</h1>
            <a href="https://discord.gg/codejs" target="_blank" class="discord-link">
                <i class="fab fa-discord"></i> discord.gg/codejs
            </a>
        </div>
        
        <div class="search-container">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="URL, login veya kelime ara..." autocomplete="off">
                <button id="searchButton"><i class="fas fa-search"></i></button>
            </div>
        </div>
        
        <div class="loading-container" id="loadingContainer">
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Lütfen bekleyin, loglar taranıyor...</p>
            </div>
        </div>
        
        <div class="results-container" id="resultsContainer">
            <div class="results-header">
                <h2><i class="fas fa-list-ul"></i> Sonuçlar</h2>
                <div class="results-actions">
                    <button id="clearFilterButton" class="filter-btn"><i class="fas fa-filter"></i> Clear</button>
                    <button id="downloadButton" class="download-btn" disabled><i class="fas fa-bolt"></i> <span>İndir</span></button>
                </div>
            </div>
            <div class="results-content" id="resultsContent">
                <p class="no-results">Arama yapmak için bir terim girin.</p>
            </div>
        </div>
    </div>
    
    <script src="js/script.js"></script>
</body>
</html> 