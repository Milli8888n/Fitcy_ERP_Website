# Quick Asset Extraction Demo
# Simplified version for demonstration

$SourcePath = "f:\FitcityFE\phive_analysis\phive.pt"
$OutputPath = "f:\FitcityFE\reverse-engineering\extracted_demo"

Write-Host "=== ASSET EXTRACTION DEMO ===" -ForegroundColor Green
Write-Host "Source: $SourcePath" -ForegroundColor Cyan
Write-Host "Output: $OutputPath" -ForegroundColor Cyan

# Create output directory
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Force -Path $OutputPath | Out-Null
    Write-Host "`n✓ Created output directory" -ForegroundColor Green
}

# Get HTML files
Write-Host "`nScanning for HTML files..." -ForegroundColor Yellow
$htmlFiles = Get-ChildItem -Path $SourcePath -Filter "*.html" -Recurse -ErrorAction SilentlyContinue
Write-Host "✓ Found $($htmlFiles.Count) HTML files" -ForegroundColor Green

# Initialize counters
$stats = @{
    images     = 0
    videos     = 0
    fonts      = 0
    scripts    = 0
    cssVars    = 0
    components = @{}
}

$resources = @{
    images  = @()
    videos  = @()
    fonts   = @()
    scripts = @()
}

Write-Host "`nExtracting resources..." -ForegroundColor Yellow

# Process first 5 files for demo
$filesToProcess = $htmlFiles | Select-Object -First 5

foreach ($file in $filesToProcess) {
    Write-Host "  Processing: $($file.Name)" -ForegroundColor Gray
    
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8 -ErrorAction Stop
        
        # Extract images
        $imgMatches = [regex]::Matches($content, 'src="([^"]+\.(jpg|jpeg|png|gif|webp|svg))"')
        foreach ($match in $imgMatches) {
            $url = $match.Groups[1].Value
            if ($resources.images -notcontains $url) {
                $resources.images += $url
                $stats.images++
            }
        }
        
        # Extract videos
        $videoMatches = [regex]::Matches($content, 'src="([^"]+\.(mp4|webm))"')
        foreach ($match in $videoMatches) {
            $url = $match.Groups[1].Value
            if ($resources.videos -notcontains $url) {
                $resources.videos += $url
                $stats.videos++
            }
        }
        
        # Extract fonts
        $fontMatches = [regex]::Matches($content, 'url\([''"]?([^)]+\.(woff2?|ttf|otf))[''"]?\)')
        foreach ($match in $fontMatches) {
            $url = $match.Groups[1].Value
            if ($resources.fonts -notcontains $url) {
                $resources.fonts += $url
                $stats.fonts++
            }
        }
        
        # Extract scripts
        $scriptMatches = [regex]::Matches($content, '<script[^>]+src="([^"]+)"')
        foreach ($match in $scriptMatches) {
            $url = $match.Groups[1].Value
            if ($resources.scripts -notcontains $url) {
                $resources.scripts += $url
                $stats.scripts++
            }
        }
        
        # Extract CSS variables
        $varMatches = [regex]::Matches($content, '--([a-zA-Z0-9-]+)\s*:\s*([^;]+);')
        $stats.cssVars += $varMatches.Count
        
        # Extract components
        $compMatches = [regex]::Matches($content, 'data-component="([^"]+)"')
        foreach ($match in $compMatches) {
            $compName = $match.Groups[1].Value
            if (-not $stats.components.ContainsKey($compName)) {
                $stats.components[$compName] = 0
            }
            $stats.components[$compName]++
        }
    }
    catch {
        Write-Host "  ⚠ Error processing file: $_" -ForegroundColor Red
    }
}

# Generate report
Write-Host "`n=== EXTRACTION RESULTS ===" -ForegroundColor Green
Write-Host "`nStatistics:" -ForegroundColor Cyan
Write-Host "  Images found: $($stats.images)" -ForegroundColor White
Write-Host "  Videos found: $($stats.videos)" -ForegroundColor White
Write-Host "  Fonts found: $($stats.fonts)" -ForegroundColor White
Write-Host "  Scripts found: $($stats.scripts)" -ForegroundColor White
Write-Host "  CSS Variables: $($stats.cssVars)" -ForegroundColor White
Write-Host "  Components: $($stats.components.Count)" -ForegroundColor White

# Export to files
Write-Host "`nExporting results..." -ForegroundColor Yellow

# Images list
if ($resources.images.Count -gt 0) {
    $resources.images | Out-File "$OutputPath\images.txt" -Encoding UTF8
    Write-Host "  ✓ Exported images.txt ($($resources.images.Count) items)" -ForegroundColor Green
}

# Videos list
if ($resources.videos.Count -gt 0) {
    $resources.videos | Out-File "$OutputPath\videos.txt" -Encoding UTF8
    Write-Host "  ✓ Exported videos.txt ($($resources.videos.Count) items)" -ForegroundColor Green
}

# Fonts list
if ($resources.fonts.Count -gt 0) {
    $resources.fonts | Out-File "$OutputPath\fonts.txt" -Encoding UTF8
    Write-Host "  ✓ Exported fonts.txt ($($resources.fonts.Count) items)" -ForegroundColor Green
}

# Scripts list
if ($resources.scripts.Count -gt 0) {
    $resources.scripts | Out-File "$OutputPath\scripts.txt" -Encoding UTF8
    Write-Host "  ✓ Exported scripts.txt ($($resources.scripts.Count) items)" -ForegroundColor Green
}

# Components report
if ($stats.components.Count -gt 0) {
    $componentReport = "# COMPONENTS FOUND`n`n"
    $sortedComponents = $stats.components.GetEnumerator() | Sort-Object -Property Value -Descending
    foreach ($comp in $sortedComponents) {
        $componentReport += "- $($comp.Key): $($comp.Value) occurrences`n"
    }
    $componentReport | Out-File "$OutputPath\components.txt" -Encoding UTF8
    Write-Host "  ✓ Exported components.txt ($($stats.components.Count) items)" -ForegroundColor Green
}

# Summary report
$summary = @"
# ASSET EXTRACTION SUMMARY
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Files Processed
- Total HTML files scanned: $($htmlFiles.Count)
- Files processed (demo): $($filesToProcess.Count)

## Resources Found
- Images: $($stats.images)
- Videos: $($stats.videos)
- Fonts: $($stats.fonts)
- Scripts: $($stats.scripts)
- CSS Variables: $($stats.cssVars)
- Components: $($stats.components.Count)

## Top Components
$($stats.components.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 5 | ForEach-Object {
    "- $($_.Key): $($_.Value) occurrences"
})

## Output Files
- images.txt - List of all image URLs
- videos.txt - List of all video URLs
- fonts.txt - List of all font URLs
- scripts.txt - List of all script URLs
- components.txt - Component usage statistics

---
Note: This is a demo extraction from first 5 HTML files.
For full extraction, process all $($htmlFiles.Count) files.
"@

$summary | Out-File "$OutputPath\SUMMARY.txt" -Encoding UTF8
Write-Host "  ✓ Exported SUMMARY.txt" -ForegroundColor Green

Write-Host "`n=== COMPLETE ===" -ForegroundColor Green
Write-Host "Results saved to: $OutputPath" -ForegroundColor Cyan
Write-Host "`nOpen the folder to view extracted data!" -ForegroundColor Yellow
