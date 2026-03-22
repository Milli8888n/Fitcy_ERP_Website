
# 05_extract_content.ps1 - Extract Text & Missing Assets

$baseDir = "f:\FitcityFE"
$htmlPath = "$baseDir\resources\source_code\phive.pt\en.html"
$jsonPath = "$baseDir\reverse-engineering\extracted_pro\resources.json"
$outputContent = "$baseDir\assets\content.json"
$outputIcons = "$baseDir\assets\missing_icons.txt"

Write-Host "🔍 Starting Content & Icon Extraction..." -ForegroundColor Cyan

# --- 1. Extract Text Content ---
$contentData = @{
    "translations" = @{}
    "headings"     = @()
    "audit"        = @{
        "h1"         = 0
        "h2"         = 0
        "paragraphs" = 0
    }
}

# 1a. Extract Translations from resources.json (window.__NUXT__)
if (Test-Path $jsonPath) {
    try {
        $jsonStr = Get-Content $jsonPath -Raw | ConvertFrom-Json
        $nuxtScript = $jsonStr.scripts.inline[0].content
        
        # Regex to grab stringTranslations object
        if ($nuxtScript -match "stringTranslations:(\{.*?\})(,audio|,\}\})") {
            $transRaw = $matches[1]
            # Convert simple JS object to JSON for PowerShell (quoted keys)
            $transJson = $transRaw -replace '([a-zA-Z0-9_]+):', '"$1":'
            $contentData["translations"] = $transJson | ConvertFrom-Json
            Write-Host "✅ Extracted UI Translations" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️ Could not parse stringTranslations" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ Error parsing resources.json: $_" -ForegroundColor Red
    }
}

# 1b. Extract Headings from HTML
if (Test-Path $htmlPath) {
    $htmlContent = Get-Content $htmlPath -Raw
    
    # Simple regex for H1-H6
    $headings = [regex]::Matches($htmlContent, "<h([1-6])[^>]*>(.*?)</h\1>", "IgnoreCase")
    foreach ($match in $headings) {
        $tag = "h" + $match.Groups[1].Value
        $text = $match.Groups[2].Value.Trim()
        if ($text.Length -gt 0) {
            $contentData.headings += @{
                "tag"  = $tag
                "text" = $text
            }
            $contentData.audit[$tag]++
        }
    }
    
    # Regex for elements with specific classes like "title", "label"
    $titles = [regex]::Matches($htmlContent, 'class="[^"]*?(title|label|description)[^"]*?"[^>]*>(.*?)<', "IgnoreCase")
    foreach ($match in $titles) {
        $type = $match.Groups[1].Value
        $text = $match.Groups[2].Value.Trim()
        if ($text.Length -gt 2 -and $text -notmatch "^<") {
            $contentData.headings += @{
                "type" = $type
                "text" = $text
            }
        }
    }

    Write-Host "✅ Extracted $($headings.Count) Headings & $($titles.Count) UI Text Elements" -ForegroundColor Green
}

# Save Content JSON
$contentData | ConvertTo-Json -Depth 5 | Set-Content $outputContent
Write-Host "💾 Saved content to $outputContent" -ForegroundColor Gray

# --- 2. Find Missing Icons ---
Write-Host "`n🔍 Scanning for Icon Assets..." -ForegroundColor Cyan

$iconExtensions = @(".svg", ".ico", ".png", ".webp")
$foundIcons = @()

# Scan HTML and processed CSS
$filesToScan = @($htmlPath, "$baseDir\assets\css\design-system.css")

foreach ($file in $filesToScan) {
    if (Test-Path $file) {
        $text = Get-Content $file -Raw
        
        # Regex for urls inside url() or src=""
        $urls = [regex]::Matches($text, '(url\(|src="|href=")(/[^"\)]+?)("||\))')
        foreach ($match in $urls) {
            $url = $match.Groups[2].Value
            $ext = [System.IO.Path]::GetExtension($url)
            
            if ($iconExtensions -contains $ext) {
                $foundIcons += $url
            }
        }
    }
}

$uniqueIcons = $foundIcons | Select-Object -Unique
$missingList = @()

foreach ($iconUrl in $uniqueIcons) {
    $fileName = [System.IO.Path]::GetFileName($iconUrl)
    $localPath = "$baseDir\assets\images\$fileName"
    
    if (-not (Test-Path $localPath)) {
        $missingList += $iconUrl
    }
}

$missingList | Out-File $outputIcons
Write-Host "✅ Found $($uniqueIcons.Count) icon references."
Write-Host "⚠️  $($missingList.Count) are missing from /assets/images." -ForegroundColor Yellow
Write-Host "💾 List saved to $outputIcons" -ForegroundColor Gray
