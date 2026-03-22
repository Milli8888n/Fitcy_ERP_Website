# Simple Asset Extractor - Working Version
# Extracts assets from Phive.pt HTML files

Write-Host "=== ASSET EXTRACTOR ===" -ForegroundColor Green
Write-Host ""

# Paths
$sourcePath = "f:\FitcityFE\phive_analysis\phive.pt"
$outputPath = "f:\FitcityFE\reverse-engineering\extracted"

# Create output directory
if (-not (Test-Path $outputPath)) {
    New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
    Write-Host "Created output directory" -ForegroundColor Cyan
}

# Get HTML files
Write-Host "Scanning for HTML files..." -ForegroundColor Yellow
$htmlFiles = Get-ChildItem -Path $sourcePath -Filter "*.html" -Recurse
Write-Host "Found: $($htmlFiles.Count) files" -ForegroundColor Green
Write-Host ""

# Initialize collections
$allImages = @()
$allVideos = @()
$allFonts = @()
$allScripts = @()
$allComponents = @{}
$allCssVars = @()

# Process files
$counter = 0
foreach ($file in $htmlFiles) {
    $counter++
    Write-Host "[$counter/$($htmlFiles.Count)] Processing: $($file.Name)" -ForegroundColor Gray
    
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Extract images
        $imgPattern = 'src="([^"]+\.(jpg|jpeg|png|gif|webp|svg))"'
        $matches = [regex]::Matches($content, $imgPattern)
        foreach ($match in $matches) {
            $url = $match.Groups[1].Value
            if ($allImages -notcontains $url) {
                $allImages += $url
            }
        }
        
        # Extract videos
        $videoPattern = 'src="([^"]+\.(mp4|webm|ogg))"'
        $matches = [regex]::Matches($content, $videoPattern)
        foreach ($match in $matches) {
            $url = $match.Groups[1].Value
            if ($allVideos -notcontains $url) {
                $allVideos += $url
            }
        }
        
        # Extract fonts
        $fontPattern = '([^"'']+\.(woff2|woff|ttf|otf))'
        $matches = [regex]::Matches($content, $fontPattern)
        foreach ($match in $matches) {
            $url = $match.Groups[1].Value
            if ($allFonts -notcontains $url) {
                $allFonts += $url
            }
        }
        
        # Extract scripts
        $scriptPattern = 'src="([^"]+\.js)"'
        $matches = [regex]::Matches($content, $scriptPattern)
        foreach ($match in $matches) {
            $url = $match.Groups[1].Value
            if ($allScripts -notcontains $url) {
                $allScripts += $url
            }
        }
        
        # Extract components
        $compPattern = 'data-component="([^"]+)"'
        $matches = [regex]::Matches($content, $compPattern)
        foreach ($match in $matches) {
            $compName = $match.Groups[1].Value
            if (-not $allComponents.ContainsKey($compName)) {
                $allComponents[$compName] = 0
            }
            $allComponents[$compName]++
        }
        
        # Extract CSS variables
        $varPattern = '--([a-zA-Z0-9-]+)\s*:\s*([^;]+);'
        $matches = [regex]::Matches($content, $varPattern)
        foreach ($match in $matches) {
            $varName = "--" + $match.Groups[1].Value
            $varValue = $match.Groups[2].Value.Trim()
            $varLine = "$varName : $varValue"
            if ($allCssVars -notcontains $varLine) {
                $allCssVars += $varLine
            }
        }
    }
    catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== EXTRACTION COMPLETE ===" -ForegroundColor Green
Write-Host ""

# Display statistics
Write-Host "Statistics:" -ForegroundColor Cyan
Write-Host "  Images: $($allImages.Count)" -ForegroundColor White
Write-Host "  Videos: $($allVideos.Count)" -ForegroundColor White
Write-Host "  Fonts: $($allFonts.Count)" -ForegroundColor White
Write-Host "  Scripts: $($allScripts.Count)" -ForegroundColor White
Write-Host "  Components: $($allComponents.Count)" -ForegroundColor White
Write-Host "  CSS Variables: $($allCssVars.Count)" -ForegroundColor White
Write-Host ""

# Export to files
Write-Host "Exporting results..." -ForegroundColor Yellow

# Images
if ($allImages.Count -gt 0) {
    $allImages | Out-File "$outputPath\images.txt" -Encoding UTF8
    Write-Host "  Saved: images.txt" -ForegroundColor Green
}

# Videos
if ($allVideos.Count -gt 0) {
    $allVideos | Out-File "$outputPath\videos.txt" -Encoding UTF8
    Write-Host "  Saved: videos.txt" -ForegroundColor Green
}

# Fonts
if ($allFonts.Count -gt 0) {
    $allFonts | Out-File "$outputPath\fonts.txt" -Encoding UTF8
    Write-Host "  Saved: fonts.txt" -ForegroundColor Green
}

# Scripts
if ($allScripts.Count -gt 0) {
    $allScripts | Out-File "$outputPath\scripts.txt" -Encoding UTF8
    Write-Host "  Saved: scripts.txt" -ForegroundColor Green
}

# Components
if ($allComponents.Count -gt 0) {
    $componentReport = "# COMPONENTS FOUND`n`n"
    $sortedComponents = $allComponents.GetEnumerator() | Sort-Object -Property Value -Descending
    foreach ($comp in $sortedComponents) {
        $componentReport += "$($comp.Key): $($comp.Value) occurrences`n"
    }
    $componentReport | Out-File "$outputPath\components.txt" -Encoding UTF8
    Write-Host "  Saved: components.txt" -ForegroundColor Green
}

# CSS Variables
if ($allCssVars.Count -gt 0) {
    $cssVarReport = "/* CSS VARIABLES EXTRACTED */`n`n:root {`n"
    foreach ($var in ($allCssVars | Sort-Object)) {
        $cssVarReport += "  $var;`n"
    }
    $cssVarReport += "}`n"
    $cssVarReport | Out-File "$outputPath\css-variables.css" -Encoding UTF8
    Write-Host "  Saved: css-variables.css" -ForegroundColor Green
}

# Summary
$summary = @"
ASSET EXTRACTION SUMMARY
========================
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Files Processed: $($htmlFiles.Count)

Resources Found:
- Images: $($allImages.Count)
- Videos: $($allVideos.Count)
- Fonts: $($allFonts.Count)
- Scripts: $($allScripts.Count)
- Components: $($allComponents.Count)
- CSS Variables: $($allCssVars.Count)

Top 10 Components:
$($allComponents.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 10 | ForEach-Object { "- $($_.Key): $($_.Value)" } | Out-String)

Output Location: $outputPath

Files Generated:
- images.txt
- videos.txt
- fonts.txt
- scripts.txt
- components.txt
- css-variables.css
- summary.txt
"@

$summary | Out-File "$outputPath\summary.txt" -Encoding UTF8
Write-Host "  Saved: summary.txt" -ForegroundColor Green

Write-Host ""
Write-Host "=== ALL DONE ===" -ForegroundColor Green
Write-Host "Results saved to: $outputPath" -ForegroundColor Cyan
Write-Host ""
