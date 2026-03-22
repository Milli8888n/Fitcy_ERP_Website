
# 06_download_missed.ps1 - Download Missing Assets

$baseUrl = "https://phive.pt"
$baseDir = "f:\FitcityFE"
$listPath = "$baseDir\assets\missing_icons.txt"
$imgDir = "$baseDir\assets\images"

if (-not (Test-Path $listPath)) {
    Write-Host "No missing icons list found." -ForegroundColor Yellow
    exit
}

$files = Get-Content $listPath

foreach ($file in $files) {
    $url = "$baseUrl$file"
    $fileName = Split-Path $file -Leaf
    $dest = "$imgDir\$fileName"
    
    Write-Host "⬇️ Downloading: $fileName" -NoNewline
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UserAgent "Mozilla/5.0"
        Write-Host " [OK]" -ForegroundColor Green
    }
    catch {
        Write-Host " [FAIL]: $_" -ForegroundColor Red
    }
}
Write-Host "`n✅ Download attempt complete."
