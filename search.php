<?php
header('Content-Type: application/json');

function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

$response = [
    'success' => false,
    'results' => [],
    'message' => ''
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

if (!isset($_POST['searchTerm']) || empty($_POST['searchTerm'])) {
    $response['message'] = 'No search term provided';
    echo json_encode($response);
    exit;
}

$searchTerm = sanitizeInput($_POST['searchTerm']);

$logDir = 'loglar';

if (!is_dir($logDir)) {
    $response['message'] = 'Log directory not found';
    echo json_encode($response);
    exit;
}

$logFiles = glob($logDir . '/*.txt');

if (empty($logFiles)) {
    $response['message'] = 'No log files found';
    echo json_encode($response);
    exit;
}

$results = [];

foreach ($logFiles as $logFile) {
    $fileName = basename($logFile);
    
    $fileHandle = fopen($logFile, 'r');
    
    if ($fileHandle) {
        $lineNumber = 0;
        
        while (($line = fgets($fileHandle)) !== false) {
            $lineNumber++;
            
            if (stripos($line, $searchTerm) !== false) {
                $originalLine = $line;
                
                $highlightedLine = preg_replace('/(' . preg_quote($searchTerm, '/') . ')/i', '<span style="background-color: rgba(33, 150, 243, 0.3); color: white; padding: 0 3px; border-radius: 3px;">$1</span>', htmlspecialchars($line));
                
                $results[] = [
                    'file' => $fileName,
                    'lineNumber' => $lineNumber,
                    'line' => $highlightedLine,
                    'originalLine' => $originalLine
                ];
            }
        }
        
        fclose($fileHandle);
    }
}

$response['success'] = true;
$response['results'] = $results;
$response['message'] = count($results) . ' results found';

echo json_encode($response);
?> 