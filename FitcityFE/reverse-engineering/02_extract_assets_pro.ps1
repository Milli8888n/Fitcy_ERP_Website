# ============================================================================
# PROFESSIONAL ASSET EXTRACTION TOOL v2.1 - WORKING VERSION
# ============================================================================
# Purpose: Deep analysis and extraction of web assets for reverse engineering
# Author: Lead Reverse Engineering Team
# Date: 2026-02-05
# ============================================================================

#Requires -Version 5.1

Write-Host "=== PROFESSIONAL ASSET EXTRACTION TOOL v2.1 ===" -ForegroundColor Green
Write-Host ""

# Configuration
$Config = @{
    SourcePath  = "f:\FitcityFE\phive_analysis\phive.pt"
    OutputPath  = "f:\FitcityFE\reverse-engineering\extracted_pro"
    MaxFileSize = 50MB
    Encoding    = 'UTF8'
}

Write-Host "Source: $($Config.SourcePath)" -ForegroundColor Cyan
Write-Host "Output: $($Config.OutputPath)" -ForegroundColor Cyan
Write-Host ""

# Create output directory
if (-not (Test-Path $Config.OutputPath)) {
    New-Item -ItemType Directory -Force -Path $Config.OutputPath | Out-Null
    Write-Host "Created output directory" -ForegroundColor Green
}

# Get HTML files
Write-Host "Scanning for HTML files..." -ForegroundColor Yellow
$htmlFiles = Get-ChildItem -Path $Config.SourcePath -Filter "*.html" -Recurse -ErrorAction SilentlyContinue
Write-Host "Found: $($htmlFiles.Count) files" -ForegroundColor Green
Write-Host ""

if ($htmlFiles.Count -eq 0) {
    Write-Host "No HTML files found. Exiting." -ForegroundColor Red
    exit 0
}

# Initialize data structures
$cssData = @{
    inline       = @()
    external     = @()
    variables    = @{}
    animations   = @{}
    mediaQueries = @{}
}

$resources = @{
    images  = @{
        standard   = @()
        srcset     = @()
        background = @()
        dataUri    = @()
    }
    videos  = @()
    fonts   = @()
    scripts = @{
        external = @()
        inline   = @()
        modules  = @()
    }
    audio   = @()
    iframes = @()
}

$dataAttributes = @{
    components = @{}
    scroll     = @()
    animation  = @()
    other      = @{}
}

$metaTags = @{
    seo       = @()
    openGraph = @()
    twitter   = @()
    other     = @()
}

# Process files
$counter = 0
Write-Host "=== EXTRACTING DATA ===" -ForegroundColor Green

foreach ($file in $htmlFiles) {
    $counter++
    Write-Host "[$counter/$($htmlFiles.Count)] $($file.Name)" -ForegroundColor Gray
    
    try {
        # Check file size
        if ($file.Length -gt $Config.MaxFileSize) {
            Write-Host "  Skipping (too large: $([math]::Round($file.Length/1MB, 2))MB)" -ForegroundColor Yellow
            continue
        }
        
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8 -ErrorAction Stop
        
        # === CSS EXTRACTION ===
        
        # Inline CSS blocks
        $stylePattern = '(?s)<style[^>]*>(.*?)</style>'
        $styleMatches = [regex]::Matches($content, $stylePattern)
        foreach ($match in $styleMatches) {
            $cssContent = $match.Groups[1].Value
            
            $cssData.inline += @{
                source  = $file.Name
                content = $cssContent
                size    = $cssContent.Length
            }
            
            # Extract CSS variables
            $varPattern = '--([a-zA-Z0-9-]+)\s*:\s*([^;]+);'
            $varMatches = [regex]::Matches($cssContent, $varPattern)
            foreach ($varMatch in $varMatches) {
                $varName = "--" + $varMatch.Groups[1].Value
                $varValue = $varMatch.Groups[2].Value.Trim()
                
                if (-not $cssData.variables.ContainsKey($varName)) {
                    $cssData.variables[$varName] = @{
                        value   = $varValue
                        sources = @()
                    }
                }
                if ($cssData.variables[$varName].sources -notcontains $file.Name) {
                    $cssData.variables[$varName].sources += $file.Name
                }
            }
            
            # Extract @keyframes animations
            $animPattern = '@keyframes\s+([a-zA-Z0-9-]+)'
            $animMatches = [regex]::Matches($cssContent, $animPattern)
            foreach ($animMatch in $animMatches) {
                $animName = $animMatch.Groups[1].Value
                if (-not $cssData.animations.ContainsKey($animName)) {
                    $cssData.animations[$animName] = @{
                        source = $file.Name
                    }
                }
            }
            
            # Extract @media queries
            $mediaPattern = '@media\s+([^{]+)'
            $mediaMatches = [regex]::Matches($cssContent, $mediaPattern)
            foreach ($mediaMatch in $mediaMatches) {
                $mediaQuery = $mediaMatch.Groups[1].Value.Trim()
                if (-not $cssData.mediaQueries.ContainsKey($mediaQuery)) {
                    $cssData.mediaQueries[$mediaQuery] = @{
                        source = $file.Name
                    }
                }
            }
        }
        
        # External CSS
        $linkPattern = '<link[^>]+href="([^"]+\.css)"'
        $linkMatches = [regex]::Matches($content, $linkPattern)
        foreach ($match in $linkMatches) {
            $url = $match.Groups[1].Value
            if ($cssData.external -notcontains $url) {
                $cssData.external += $url
            }
        }
        
        # === RESOURCE EXTRACTION ===
        
        # Images - standard
        $imgPattern = '<img[^>]+src="([^"]+)"'
        $imgMatches = [regex]::Matches($content, $imgPattern)
        foreach ($match in $imgMatches) {
            $url = $match.Groups[1].Value
            if ($url -notmatch '^data:') {
                $resources.images.standard += @{
                    url    = $url
                    source = $file.Name
                }
            }
            else {
                $resources.images.dataUri += @{
                    type   = ($url -split ';')[0] -replace 'data:', ''
                    source = $file.Name
                    size   = $url.Length
                }
            }
        }
        
        # Images - srcset
        $srcsetPattern = 'srcset="([^"]+)"'
        $srcsetMatches = [regex]::Matches($content, $srcsetPattern)
        foreach ($match in $srcsetMatches) {
            $resources.images.srcset += @{
                value  = $match.Groups[1].Value
                source = $file.Name
            }
        }
        
        # Images - background (from inline styles)
        $bgPattern = 'background[^:]*:\s*url\(([^)]+)\)'
        $bgMatches = [regex]::Matches($content, $bgPattern)
        foreach ($match in $bgMatches) {
            $url = $match.Groups[1].Value -replace '[''"]', ''
            $resources.images.background += @{
                url    = $url
                source = $file.Name
            }
        }
        
        # Videos
        $videoPattern = '<video[^>]*>.*?</video>'
        $videoMatches = [regex]::Matches($content, $videoPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        foreach ($match in $videoMatches) {
            $videoBlock = $match.Value
            $srcPattern = 'src="([^"]+\.(?:mp4|webm|ogg))"'
            $srcMatches = [regex]::Matches($videoBlock, $srcPattern)
            foreach ($srcMatch in $srcMatches) {
                $resources.videos += @{
                    url      = $srcMatch.Groups[1].Value
                    source   = $file.Name
                    autoplay = $videoBlock -match 'autoplay'
                    loop     = $videoBlock -match 'loop'
                    muted    = $videoBlock -match 'muted'
                }
            }
        }
        
        # Fonts
        $fontPattern = '([^"'']+\.(?:woff2|woff|ttf|otf|eot))'
        $fontMatches = [regex]::Matches($content, $fontPattern)
        foreach ($match in $fontMatches) {
            $url = $match.Groups[1].Value
            if ($url -notmatch '^http' -and $url -notmatch '^/') { continue }
            $resources.fonts += @{
                url    = $url
                source = $file.Name
            }
        }
        
        # Scripts - external
        $scriptPattern = '<script[^>]+src="([^"]+)"'
        $scriptMatches = [regex]::Matches($content, $scriptPattern)
        foreach ($match in $scriptMatches) {
            $scriptTag = $match.Value
            $url = $match.Groups[1].Value
            
            if ($scriptTag -match 'type="module"') {
                $resources.scripts.modules += @{
                    url    = $url
                    source = $file.Name
                }
            }
            else {
                $resources.scripts.external += @{
                    url    = $url
                    source = $file.Name
                    async  = $scriptTag -match 'async'
                    defer  = $scriptTag -match 'defer'
                }
            }
        }
        
        # Scripts - inline
        $inlineScriptPattern = '<script(?![^>]*src)[^>]*>(.*?)</script>'
        $inlineMatches = [regex]::Matches($content, $inlineScriptPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        foreach ($match in $inlineMatches) {
            $scriptContent = $match.Groups[1].Value.Trim()
            if ($scriptContent.Length -gt 0) {
                $resources.scripts.inline += @{
                    content = $scriptContent
                    source  = $file.Name
                    size    = $scriptContent.Length
                }
            }
        }
        
        # Iframes
        $iframePattern = '<iframe[^>]+src="([^"]+)"'
        $iframeMatches = [regex]::Matches($content, $iframePattern)
        foreach ($match in $iframeMatches) {
            $resources.iframes += @{
                url    = $match.Groups[1].Value
                source = $file.Name
            }
        }
        
        # === DATA ATTRIBUTES ===
        
        # Components
        $compPattern = 'data-component="([^"]+)"'
        $compMatches = [regex]::Matches($content, $compPattern)
        foreach ($match in $compMatches) {
            $compName = $match.Groups[1].Value
            if (-not $dataAttributes.components.ContainsKey($compName)) {
                $dataAttributes.components[$compName] = @{
                    count   = 0
                    sources = @()
                }
            }
            $dataAttributes.components[$compName].count++
            if ($dataAttributes.components[$compName].sources -notcontains $file.Name) {
                $dataAttributes.components[$compName].sources += $file.Name
            }
        }
        
        # Scroll attributes
        $scrollPattern = 'data-(scroll[^=]*)="([^"]+)"'
        $scrollMatches = [regex]::Matches($content, $scrollPattern)
        foreach ($match in $scrollMatches) {
            $dataAttributes.scroll += @{
                attribute = "data-" + $match.Groups[1].Value
                value     = $match.Groups[2].Value
                source    = $file.Name
            }
        }
        
        # Animation attributes
        $animAttrPattern = 'data-(anim[^=]*)="([^"]+)"'
        $animAttrMatches = [regex]::Matches($content, $animAttrPattern)
        foreach ($match in $animAttrMatches) {
            $dataAttributes.animation += @{
                attribute = "data-" + $match.Groups[1].Value
                value     = $match.Groups[2].Value
                source    = $file.Name
            }
        }
        
        # === META TAGS ===
        
        $metaPattern = '<meta\s+([^>]+)>'
        $metaMatches = [regex]::Matches($content, $metaPattern)
        foreach ($match in $metaMatches) {
            $metaTag = $match.Groups[1].Value
            
            $nameMatch = [regex]::Match($metaTag, 'name="([^"]+)"')
            $propertyMatch = [regex]::Match($metaTag, 'property="([^"]+)"')
            $contentMatch = [regex]::Match($metaTag, 'content="([^"]+)"')
            
            $metaData = @{
                source  = $file.Name
                content = if ($contentMatch.Success) { $contentMatch.Groups[1].Value } else { '' }
            }
            
            if ($nameMatch.Success) {
                $name = $nameMatch.Groups[1].Value
                $metaData.name = $name
                
                if ($name -match '^(description|keywords|author|viewport)$') {
                    $metaTags.seo += $metaData
                }
                elseif ($name -match '^twitter:') {
                    $metaTags.twitter += $metaData
                }
                else {
                    $metaTags.other += $metaData
                }
            }
            
            if ($propertyMatch.Success) {
                $property = $propertyMatch.Groups[1].Value
                $metaData.property = $property
                
                if ($property -match '^og:') {
                    $metaTags.openGraph += $metaData
                }
                else {
                    $metaTags.other += $metaData
                }
            }
        }
    }
    catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== GENERATING STATISTICS ===" -ForegroundColor Green

$stats = @{
    timestamp      = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    css            = @{
        inlineBlocks   = $cssData.inline.Count
        externalSheets = $cssData.external.Count
        variables      = $cssData.variables.Count
        animations     = $cssData.animations.Count
        mediaQueries   = $cssData.mediaQueries.Count
    }
    resources      = @{
        images  = @{
            standard   = $resources.images.standard.Count
            srcset     = $resources.images.srcset.Count
            background = $resources.images.background.Count
            dataUri    = $resources.images.dataUri.Count
        }
        videos  = $resources.videos.Count
        fonts   = $resources.fonts.Count
        scripts = @{
            external = $resources.scripts.external.Count
            inline   = $resources.scripts.inline.Count
            modules  = $resources.scripts.modules.Count
        }
        iframes = $resources.iframes.Count
    }
    dataAttributes = @{
        components = $dataAttributes.components.Count
        scroll     = $dataAttributes.scroll.Count
        animation  = $dataAttributes.animation.Count
    }
    metaTags       = @{
        seo       = $metaTags.seo.Count
        openGraph = $metaTags.openGraph.Count
        twitter   = $metaTags.twitter.Count
        other     = $metaTags.other.Count
    }
}

Write-Host ""
Write-Host "=== EXPORTING RESULTS ===" -ForegroundColor Green

# Export JSON files
try {
    $cssData | ConvertTo-Json -Depth 10 | Out-File "$($Config.OutputPath)\css-data.json" -Encoding UTF8
    Write-Host "  Exported: css-data.json" -ForegroundColor Cyan
}
catch { Write-Host "  Failed: css-data.json - $_" -ForegroundColor Red }

try {
    $resources | ConvertTo-Json -Depth 10 | Out-File "$($Config.OutputPath)\resources.json" -Encoding UTF8
    Write-Host "  Exported: resources.json" -ForegroundColor Cyan
}
catch { Write-Host "  Failed: resources.json - $_" -ForegroundColor Red }

try {
    $dataAttributes | ConvertTo-Json -Depth 10 | Out-File "$($Config.OutputPath)\data-attributes.json" -Encoding UTF8
    Write-Host "  Exported: data-attributes.json" -ForegroundColor Cyan
}
catch { Write-Host "  Failed: data-attributes.json - $_" -ForegroundColor Red }

try {
    $metaTags | ConvertTo-Json -Depth 10 | Out-File "$($Config.OutputPath)\meta-tags.json" -Encoding UTF8
    Write-Host "  Exported: meta-tags.json" -ForegroundColor Cyan
}
catch { Write-Host "  Failed: meta-tags.json - $_" -ForegroundColor Red }

try {
    $stats | ConvertTo-Json -Depth 10 | Out-File "$($Config.OutputPath)\statistics.json" -Encoding UTF8
    Write-Host "  Exported: statistics.json" -ForegroundColor Cyan
}
catch { Write-Host "  Failed: statistics.json - $_" -ForegroundColor Red }

# Export CSV files
if ($resources.images.standard.Count -gt 0) {
    try {
        $resources.images.standard | Export-Csv -Path "$($Config.OutputPath)\images-standard.csv" -NoTypeInformation -Encoding UTF8
        Write-Host "  Exported: images-standard.csv" -ForegroundColor Cyan
    }
    catch { Write-Host "  Failed: images-standard.csv" -ForegroundColor Red }
}

if ($resources.videos.Count -gt 0) {
    try {
        $resources.videos | Export-Csv -Path "$($Config.OutputPath)\videos.csv" -NoTypeInformation -Encoding UTF8
        Write-Host "  Exported: videos.csv" -ForegroundColor Cyan
    }
    catch { Write-Host "  Failed: videos.csv" -ForegroundColor Red }
}

if ($resources.fonts.Count -gt 0) {
    try {
        $resources.fonts | Export-Csv -Path "$($Config.OutputPath)\fonts.csv" -NoTypeInformation -Encoding UTF8
        Write-Host "  Exported: fonts.csv" -ForegroundColor Cyan
    }
    catch { Write-Host "  Failed: fonts.csv" -ForegroundColor Red }
}

# Generate human-readable report
$report = @"
# PROFESSIONAL ASSET EXTRACTION REPORT v2.1
Generated: $($stats.timestamp)

## SUMMARY

### CSS Analysis
- Inline Style Blocks: $($stats.css.inlineBlocks)
- External Stylesheets: $($stats.css.externalSheets)
- CSS Variables: $($stats.css.variables)
- Animations (@keyframes): $($stats.css.animations)
- Media Queries: $($stats.css.mediaQueries)

### Resources
- Images (Standard): $($stats.resources.images.standard)
- Images (Srcset): $($stats.resources.images.srcset)
- Images (Background): $($stats.resources.images.background)
- Images (Data URI): $($stats.resources.images.dataUri)
- Videos: $($stats.resources.videos)
- Fonts: $($stats.resources.fonts)
- Scripts (External): $($stats.resources.scripts.external)
- Scripts (Inline): $($stats.resources.scripts.inline)
- Scripts (Modules): $($stats.resources.scripts.modules)
- Iframes: $($stats.resources.iframes)

### Data Attributes
- Components: $($stats.dataAttributes.components)
- Scroll-related: $($stats.dataAttributes.scroll)
- Animation-related: $($stats.dataAttributes.animation)

### Meta Tags
- SEO Tags: $($stats.metaTags.seo)
- Open Graph: $($stats.metaTags.openGraph)
- Twitter Cards: $($stats.metaTags.twitter)
- Other: $($stats.metaTags.other)

## TOP 10 COMPONENTS

$($dataAttributes.components.GetEnumerator() | Sort-Object { $_.Value.count } -Descending | Select-Object -First 10 | ForEach-Object {
    "- **$($_.Key)**: $($_.Value.count) occurrences"
})

## TOP 10 CSS VARIABLES

$($cssData.variables.GetEnumerator() | Select-Object -First 10 | ForEach-Object {
    "- **$($_.Key)**: $($_.Value.value)"
})

## FILES GENERATED

- css-data.json - Complete CSS analysis with context
- resources.json - All resources with metadata
- data-attributes.json - Data attributes categorized
- meta-tags.json - SEO and social meta tags
- statistics.json - Summary metrics
- images-standard.csv - Image URLs (Excel-ready)
- videos.csv - Video URLs with attributes
- fonts.csv - Font files list
- REPORT.md - This file

## NEXT STEPS

1. Review JSON files for detailed data
2. Analyze CSV files in Excel for patterns
3. Use statistics.json for metrics dashboard
4. Plan component architecture based on findings
5. Extract CSS variables for design system

---
Report generated by Professional Asset Extraction Tool v2.1
"@

$report | Out-File "$($Config.OutputPath)\REPORT.md" -Encoding UTF8
Write-Host "  Exported: REPORT.md" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== EXTRACTION COMPLETE ===" -ForegroundColor Green
Write-Host "Results saved to: $($Config.OutputPath)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  CSS Variables: $($stats.css.variables)" -ForegroundColor White
Write-Host "  Components: $($stats.dataAttributes.components)" -ForegroundColor White
Write-Host "  Images: $($stats.resources.images.standard)" -ForegroundColor White
Write-Host "  Videos: $($stats.resources.videos)" -ForegroundColor White
Write-Host "  Fonts: $($stats.resources.fonts)" -ForegroundColor White
Write-Host ""
