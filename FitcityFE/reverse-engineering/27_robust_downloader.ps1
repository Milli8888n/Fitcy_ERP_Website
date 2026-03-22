$assetList = "f:\FitcityFE\docs\master_asset_list.txt"
$baseDir = "f:\FitcityFE\assets\downloaded"

if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

$urls = Get-Content $assetList

foreach ($url in $urls) {
    $cleanUrl = $url.Trim()
    if ($cleanUrl -eq "") { continue }

    # Handle spaces in URL for Invoke-WebRequest
    $encodedUrl = $cleanUrl.Replace(" ", "%20")

    # Determine extension and sub-directory
    $ext = ""
    if ($cleanUrl -match "\.([a-z0-9]{2,5})(\?.*)?$") {
        $ext = $Matches[1].ToLower()
    }

    $subDir = "misc"
    if ($ext -match "jpg|jpeg|png|webp|svg|gif") { $subDir = "images" }
    elseif ($ext -match "mp4|webm|mov") { $subDir = "videos" }
    elseif ($ext -match "glb|gltf|riv|woff|woff2") { $subDir = "models_fonts" }
    elseif ($cleanUrl -match "wp-json") { $subDir = "api_data" }

    $targetDir = Join-Path $baseDir $subDir
    if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir }

    # Generate file name - sanitize spaces and query params
    $fileName = $cleanUrl.Split('/')[-1]
    if ($fileName -match "([^\?]+)\?") { $fileName = $Matches[1] }
    $fileName = $fileName.Replace(" ", "_") # Use underscore for local files
    
    if ($fileName -notmatch "\.") { $fileName = $fileName + ".json" }
    $targetPath = Join-Path $targetDir $fileName

    if (!(Test-Path $targetPath)) {
        Write-Host "Downloading: $fileName..." -ForegroundColor Cyan
        try {
            # 60s timeout for large assets
            Invoke-WebRequest -Uri $encodedUrl -OutFile $targetPath -TimeoutSec 60
        }
        catch {
            Write-Host "FAILED: $cleanUrl" -ForegroundColor Red
        }
    }
    else {
        # Optional: verify file size if it exists
        # Write-Host "Exists: $fileName" -ForegroundColor Gray
    }
}

Write-Host "--- RECOVERY COMPLETE ---" -ForegroundColor Green
