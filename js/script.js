$(document).ready(function() {
    const searchInput = $('#searchInput');
    const searchButton = $('#searchButton');
    const loadingContainer = $('#loadingContainer');
    const resultsContainer = $('#resultsContainer');
    const resultsContent = $('#resultsContent');
    const downloadButton = $('#downloadButton');
    const clearFilterButton = $('#clearFilterButton');
    
    let searchResults = [];
    let isFiltered = false;
    
    function performSearch() {
        const searchTerm = searchInput.val().trim();
        
        if (!searchTerm) {
            showNoResults('Lütfen arama yapmak için bir terim girin.');
            return;
        }
        
        resultsContent.empty();
        loadingContainer.css('display', 'flex');
        downloadButton.prop('disabled', true);
        clearFilterButton.removeClass('active');
        isFiltered = false;
        
        addLightningEffect();
        
        $.ajax({
            url: 'search.php',
            type: 'POST',
            data: { searchTerm: searchTerm },
            dataType: 'json',
            success: function(response) {
                setTimeout(function() {
                    loadingContainer.hide();
                    
                    if (response.success) {
                        searchResults = response.results;
                        
                        if (searchResults.length === 0) {
                            showNoResults('Sonuç bulunamadı.');
                        } else {
                            showResults(searchResults);
                            downloadButton.prop('disabled', false);
                            
                            addDownloadButtonEffect();
                        }
                    } else {
                        showNoResults('Hata: ' + response.message);
                    }
                }, 1000);
            },
            error: function() {
                setTimeout(function() {
                    loadingContainer.hide();
                    showNoResults('Sunucu ile iletişim hatası.');
                }, 1000);
            }
        });
    }
    
    function addLightningEffect() {
        const header = $('.header');
        header.addClass('searching');
        
        setTimeout(() => {
            header.removeClass('searching');
        }, 1000);
    }
    
    function addDownloadButtonEffect() {
        downloadButton.addClass('ready');
        
        setTimeout(() => {
            downloadButton.removeClass('ready');
        }, 1000);
    }
    
    function showNoResults(message) {
        resultsContent.html(`<p class="no-results">${message}</p>`);
        downloadButton.prop('disabled', true);
        clearFilterButton.removeClass('active');
    }
    
    function showResults(results, filtered = false) {
        resultsContent.empty();
        
        results.forEach(function(result, index) {
            let content = result.line;
            
            if (filtered) {
                content = extractCredentials(result.line);
            }
            
            const resultItem = $(`
                <div class="result-item" style="animation-delay: ${index * 0.05}s">
                    <div class="result-file">${result.file}</div>
                    <div class="result-content">${content}</div>
                </div>
            `);
            
            resultsContent.append(resultItem);
            
            setTimeout(() => {
                resultItem.addClass('visible');
            }, index * 100);
        });
    }
    
    function extractCredentials(line) {
        const plainText = line.replace(/<[^>]*>/g, '');
        
        let match = plainText.match(/https?:\/\/[^:]+:([^:]+):(.+?)(?=\s|$)/);
        if (match) {
            return `<span class="formatted-content">${match[1]}:${match[2]}</span>`;
        }
        
        match = plainText.match(/@https?:\/\/[^:]+:([^:]+):(.+?)(?=\s|$)/);
        if (match) {
            return `<span class="formatted-content">${match[1]}:${match[2]}</span>`;
        }
        
        match = plainText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}):([^:\s]+)/);
        if (match) {
            return `<span class="formatted-content">${match[1]}:${match[2]}</span>`;
        }
        
        match = plainText.match(/([a-zA-Z0-9._-]{3,}):([^:\s]{3,})/);
        if (match) {
            return `<span class="formatted-content">${match[1]}:${match[2]}</span>`;
        }
        
        return line;
    }
    
    function toggleClearFilter() {
        if (!searchResults.length) return;
        
        isFiltered = !isFiltered;
        
        if (isFiltered) {
            clearFilterButton.addClass('active');
            
            let filteredResults = [];
            let uniqueCredentials = new Set();
            
            searchResults.forEach(function(result) {
                const credentialLine = extractCredentials(result.line);
                const plainCredential = credentialLine.replace(/<[^>]*>/g, '');
                
                if (!uniqueCredentials.has(plainCredential)) {
                    uniqueCredentials.add(plainCredential);
                    filteredResults.push(result);
                }
            });
            
            showResults(filteredResults, true);
        } else {
            clearFilterButton.removeClass('active');
            showResults(searchResults, false);
        }
        
        clearFilterButton.addClass('pop');
        setTimeout(() => {
            clearFilterButton.removeClass('pop');
        }, 300);
    }
    
    function downloadResults() {
        if (searchResults.length === 0) return;
        
        downloadButton.addClass('downloading');
        setTimeout(() => {
            downloadButton.removeClass('downloading');
        }, 1000);
        
        let content = '';
        
        if (isFiltered) {
            let uniqueCredentials = new Set();
            
            searchResults.forEach(function(result) {
                const plainCredential = extractCredentials(result.line).replace(/<[^>]*>/g, '');
                uniqueCredentials.add(plainCredential);
            });
            
            content = Array.from(uniqueCredentials).join('\n');
        } else {
            searchResults.forEach(function(result) {
                if (result.originalLine) {
                    content += result.originalLine;
                } else {
                    content += result.line.replace(/<[^>]*>/g, '') + '\n';
                }
            });
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'search_results.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    searchButton.on('click', performSearch);
    
    searchInput.on('keypress', function(e) {
        if (e.which === 13) {
            performSearch();
        }
    });
    
    downloadButton.on('click', downloadResults);
    
    clearFilterButton.on('click', toggleClearFilter);
    
    searchInput.on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        $(this).parent().removeClass('focused');
    });
    
    $(document).on('mousemove', function(e) {
        const mouseX = e.pageX / $(window).width();
        const mouseY = e.pageY / $(window).height();
        
        $('.container').css({
            'background-position': `${mouseX * 100}% ${mouseY * 100}%`
        });
    });
    
    setTimeout(() => {
        $('.header h1 i').addClass('lightning-initial');
        setTimeout(() => {
            $('.header h1 i').removeClass('lightning-initial');
        }, 1000);
    }, 500);
}); 