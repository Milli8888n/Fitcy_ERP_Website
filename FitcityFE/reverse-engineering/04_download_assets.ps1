# Asset Downloader Script
# Reads extracted resources.json and downloads assets

$startDir = "f:\FitcityFE"
$resourcesFile = "$startDir\reverse-engineering\extracted_pro\resources.json"
$assetsDir = "$startDir\assets"
$baseUrl = "https://phive.pt"

# Create directories
New-Item -ItemType Directory -Force -Path "$assetsDir\fonts" | Out-Null
New-Item -ItemType Directory -Force -Path "$assetsDir\images" | Out-Null
New-Item -ItemType Directory -Force -Path "$assetsDir\models" | Out-Null

# Load JSON
if (-not (Test-Path $resourcesFile)) {
    Write-Host "Error: resources.json not found at $resourcesFile" -ForegroundColor Red
    exit
}
$json = Get-Content $resourcesFile -Raw | ConvertFrom-Json

# Function to download file
function Download-File {
    param ($Url, $DestPath)
    try {
        if (-not (Test-Path $DestPath)) {
            Write-Host "Downloading $Url ..." -NoNewline
            
            # Add user agent to mimic browser
            $webClient = New-Object System.Net.WebClient
            $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
            $webClient.DownloadFile($Url, $DestPath)
            
            Write-Host " OK" -ForegroundColor Green
        }
        else {
            Write-Host "Skipping $Url (already exists)" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host " Failed: $_" -ForegroundColor Red
    }
}

# 1. Download Fonts
Write-Host "`n=== Downloading Fonts ===" -ForegroundColor Cyan
foreach ($font in $json.fonts) {
    if ($font.url) {
        $fileUrl = "$baseUrl$($font.url)"
        $fileName = Split-Path $font.url -Leaf
        $destPath = "$assetsDir\fonts\$fileName"
        Download-File -Url $fileUrl -DestPath $destPath
    }
}

# 2. Download Images
Write-Host "`n=== Downloading Images ===" -ForegroundColor Cyan
foreach ($img in $json.images.standard) {
    if ($img.url) {
        $rawUrl = $img.url
        $realUrl = $null
        $fileName = $null

        if ($rawUrl -match "/https://") {
            # Extract Sanity URL
            $parts = $rawUrl -split "/https://"
            $realUrl = "https://" + $parts[1]
            
            # Clean URL for filename (remove query params)
            $cleanUrlForName = $realUrl.Split("?")[0]
            $fileName = Split-Path $cleanUrlForName -Leaf
        }
        elseif ($rawUrl.StartsWith("/")) {
            # Relative URL
            $realUrl = "$baseUrl$rawUrl"
            $fileName = Split-Path $rawUrl -Leaf
        }

        if ($realUrl -and $fileName) {
            # Handle duplicate filenames by searching if needed, 
            # but for now simple overwrite/skip logic
            $destPath = "$assetsDir\images\$fileName"
            Download-File -Url $realUrl -DestPath $destPath
        }
    }
}

# 3. Download 3D Model (Hardcoded based on investigation)
Write-Host "`n=== Downloading 3D Models ===" -ForegroundColor Cyan
$modelUrl = "$baseUrl/webgl/plates-color-whit-imetal-round.glb"
$modelDest = "$assetsDir\models\plates-color-whit-imetal-round.glb"
Download-File -Url $modelUrl -DestPath $modelDest

Write-Host "`nAsset download complete!" -ForegroundColor Green
