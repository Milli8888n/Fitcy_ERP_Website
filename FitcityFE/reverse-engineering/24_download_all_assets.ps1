$assetList = "f:\FitcityFE\docs\master_asset_list.txt"
$baseDir = "f:\FitcityFE\assets\downloaded"

if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

$urls = Get-Content $assetList

foreach ($url in $urls) {
    $cleanUrl = $url.Trim()
    if ($cleanUrl -eq "") { continue }

    # Determine sub-directory based on extension or URL content
    $ext = [System.IO.Path]::GetExtension($cleanUrl).ToLower()
    $subDir = "misc"
    if ($ext -match "jpg|jpeg|png|webp|svg|gif") { $subDir = "images" }
    elseif ($ext -match "mp4|webm|mov") { $subDir = "videos" }
    elseif ($ext -match "glb|gltf|riv|woff|woff2") { $subDir = "models_fonts" }
    elseif ($cleanUrl -match "wp-json") { $subDir = "api_data" }

    $targetDir = Join-Path $baseDir $subDir
    if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir }

    # Generate file name
    $fileName = [System.IO.Path]::GetFileName($cleanUrl)
    if ($fileName -notmatch "\.") { $fileName = $fileName + ".json" }
    $targetPath = Join-Path $targetDir $fileName

    if (!(Test-Path $targetPath)) {
        Write-Host "Downloading: $fileName..." -ForegroundColor Cyan
        try {
            Invoke-WebRequest -Uri $cleanUrl -OutFile $targetPath -TimeoutSec 30
        }
        catch {
            Write-Host "Failed to download: $cleanUrl" -ForegroundColor Red
        }
    }
    else {
        Write-Host "Skipping $fileName (already exists)" -ForegroundColor Gray
    }
}

Write-Host "SUCCESS: ALL ASSETS DOWNLOADED!" -ForegroundColor Green
