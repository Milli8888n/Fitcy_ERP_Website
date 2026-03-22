# PHASE 1: Extract và phân tích static assets từ HTML files

# Script này sẽ:
# 1. Extract tất cả CSS từ <style> tags
# 2. Extract tất cả inline styles
# 3. List tất cả external resources (images, fonts, scripts)
# 4. Analyze component structure từ data-component attributes

$htmlFiles = Get-ChildItem -Path "f:\FitcityFE\phive_analysis\phive.pt" -Filter "*.html" -Recurse

$outputDir = "f:\FitcityFE\reverse-engineering\extracted"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

# 1. Extract CSS
Write-Host "=== EXTRACTING CSS ===" -ForegroundColor Green
$allCss = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Extract <style> blocks
    $styleMatches = [regex]::Matches($content, '<style[^>]*>(.*?)</style>')
    foreach ($match in $styleMatches) {
        $allCss += "/* From: $($file.Name) */"
        $allCss += $match.Groups[1].Value
        $allCss += "`n`n"
    }
}

$allCss | Out-File "$outputDir\extracted-styles.css" -Encoding UTF8
Write-Host "✓ Extracted CSS to extracted-styles.css" -ForegroundColor Cyan

# 2. Extract Components List
Write-Host "`n=== EXTRACTING COMPONENTS ===" -ForegroundColor Green
$components = @{}

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Find all data-component attributes
    $componentMatches = [regex]::Matches($content, 'data-component="([^"]+)"')
    foreach ($match in $componentMatches) {
        $componentName = $match.Groups[1].Value
        if (-not $components.ContainsKey($componentName)) {
            $components[$componentName] = 0
        }
        $components[$componentName]++
    }
}

# Sort by frequency
$sortedComponents = $components.GetEnumerator() | Sort-Object -Property Value -Descending

$componentReport = @"
# COMPONENT ANALYSIS REPORT
Generated: $(Get-Date)

## Components Found (by frequency)

"@

foreach ($comp in $sortedComponents) {
    $componentReport += "- **$($comp.Key)**: $($comp.Value) occurrences`n"
}

$componentReport | Out-File "$outputDir\components-list.md" -Encoding UTF8
Write-Host "✓ Component list saved to components-list.md" -ForegroundColor Cyan

# 3. Extract External Resources
Write-Host "`n=== EXTRACTING RESOURCE URLS ===" -ForegroundColor Green
$resources = @{
    images = @()
    fonts = @()
    scripts = @()
    videos = @()
    audio = @()
}

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Images
    $imgMatches = [regex]::Matches($content, 'src="([^"]+\.(jpg|jpeg|png|gif|webp|svg))"')
    foreach ($match in $imgMatches) {
        $url = $match.Groups[1].Value
        if ($resources.images -notcontains $url) {
            $resources.images += $url
        }
    }
    
    # Fonts
    $fontMatches = [regex]::Matches($content, 'url\([''"]?([^)]+\.(woff2?|ttf|otf|eot))[''"]?\)')
    foreach ($match in $fontMatches) {
        $url = $match.Groups[1].Value
        if ($resources.fonts -notcontains $url) {
            $resources.fonts += $url
        }
    }
    
    # Scripts
    $scriptMatches = [regex]::Matches($content, '<script[^>]+src="([^"]+)"')
    foreach ($match in $scriptMatches) {
        $url = $match.Groups[1].Value
        if ($resources.scripts -notcontains $url) {
            $resources.scripts += $url
        }
    }
    
    # Videos
    $videoMatches = [regex]::Matches($content, 'src="([^"]+\.(mp4|webm|ogg))"')
    foreach ($match in $videoMatches) {
        $url = $match.Groups[1].Value
        if ($resources.videos -notcontains $url) {
            $resources.videos += $url
        }
    }
    
    # Audio
    $audioMatches = [regex]::Matches($content, 'src="([^"]+\.mp3)"')
    foreach ($match in $audioMatches) {
        $url = $match.Groups[1].Value
        if ($resources.audio -notcontains $url) {
            $resources.audio += $url
        }
    }
}

$resourceReport = @"
# RESOURCE ANALYSIS REPORT
Generated: $(Get-Date)

## Images ($($resources.images.Count))
$($resources.images | ForEach-Object { "- $_" } | Out-String)

## Fonts ($($resources.fonts.Count))
$($resources.fonts | ForEach-Object { "- $_" } | Out-String)

## Scripts ($($resources.scripts.Count))
$($resources.scripts | ForEach-Object { "- $_" } | Out-String)

## Videos ($($resources.videos.Count))
$($resources.videos | ForEach-Object { "- $_" } | Out-String)

## Audio ($($resources.audio.Count))
$($resources.audio | ForEach-Object { "- $_" } | Out-String)
"@

$resourceReport | Out-File "$outputDir\resources-list.md" -Encoding UTF8
Write-Host "✓ Resource list saved to resources-list.md" -ForegroundColor Cyan

# 4. Extract CSS Variables
Write-Host "`n=== EXTRACTING CSS VARIABLES ===" -ForegroundColor Green
$cssVars = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Find CSS variables
    $varMatches = [regex]::Matches($content, '--([a-zA-Z0-9-]+)\s*:\s*([^;]+);')
    foreach ($match in $varMatches) {
        $varName = "--" + $match.Groups[1].Value
        $varValue = $match.Groups[2].Value.Trim()
        $cssVars += "$varName : $varValue"
    }
}

$uniqueVars = $cssVars | Select-Object -Unique | Sort-Object

$varsReport = @"
# CSS VARIABLES EXTRACTED
Generated: $(Get-Date)

Total unique variables: $($uniqueVars.Count)

``````css
:root {
$($uniqueVars | ForEach-Object { "  $_;" } | Out-String)
}
``````
"@

$varsReport | Out-File "$outputDir\css-variables.md" -Encoding UTF8
Write-Host "✓ CSS variables saved to css-variables.md" -ForegroundColor Cyan

Write-Host "`n=== EXTRACTION COMPLETE ===" -ForegroundColor Green
Write-Host "Results saved to: $outputDir" -ForegroundColor Yellow
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Review extracted-styles.css" -ForegroundColor White
Write-Host "2. Analyze components-list.md" -ForegroundColor White
Write-Host "3. Check resources-list.md for dependencies" -ForegroundColor White
Write-Host "4. Study css-variables.md for design tokens" -ForegroundColor White
