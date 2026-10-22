<#
  Bundles the CMS content into the files the website reads.

    content/listings/*.json  ->  data/listings.json   (newest first, hidden ones dropped)
                             ->  sitemap.xml          (home page + every poster image)

  Pages CMS saves one JSON file per property; a static site cannot list a
  folder, so this joins them into one array and adds an "id" taken from the
  filename. A file with broken JSON is skipped with a warning instead of
  taking the whole site down.

  data/site.json (website settings) is edited directly by the CMS and is
  published as-is, so it is not touched here.

  Runs on Windows PowerShell 5.1 (local preview - serve.ps1 calls it) and on
  pwsh 7 in GitHub Actions (.github/workflows/deploy.yml). Keep this file ASCII.
#>
param([string]$Root = (Split-Path $PSScriptRoot -Parent))

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding $false

# ---- listings ----
$dir = Join-Path (Join-Path $Root 'content') 'listings'
$items = @()
$hiddenCount = 0
if (Test-Path $dir) {
  foreach ($f in Get-ChildItem -Path $dir -Filter '*.json' -File) {
    $raw = [System.IO.File]::ReadAllText($f.FullName, $utf8).Trim()
    try { $obj = $raw | ConvertFrom-Json } catch {
      Write-Warning "skipped $($f.Name): invalid JSON"; continue
    }
    if ($null -eq $obj -or -not $raw.StartsWith('{')) { Write-Warning "skipped $($f.Name): not an object"; continue }
    if ([string]$obj.status -eq 'Hidden') { $hiddenCount++; continue }

    # Splice the id into the original text rather than re-serialising, so
    # 5.1's ConvertTo-Json quirks (depth, \u escaping, dates) cannot creep in.
    $id   = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    $rest = $raw.Substring(1).TrimStart()
    $sep  = if ($rest.StartsWith('}')) { '' } else { ',' }
    # Read "date" from the raw text: pwsh 7 turns date-looking JSON strings
    # into [datetime] objects, which would break the sort order and lastmod.
    $dm   = [regex]::Match($raw, '"date"\s*:\s*"([^"]*)"')
    $items += [pscustomobject]@{
      id   = $id
      date = $(if ($dm.Success) { $dm.Groups[1].Value } else { '' })
      img  = [string]$obj.img
      json = '{"id":' + (ConvertTo-Json $id) + $sep + $rest
    }
  }
}
$sorted = @($items | Sort-Object -Property @{Expression = 'date'; Descending = $true}, @{Expression = 'id'})
$body = '[' + "`n" + (($sorted | ForEach-Object { $_.json }) -join ",`n") + "`n" + ']' + "`n"
$dataDir = Join-Path $Root 'data'
if (-not (Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir | Out-Null }
[System.IO.File]::WriteAllText((Join-Path $dataDir 'listings.json'), $body, $utf8)

# ---- sitemap ----
$domain = 'rohtakpropertypoint.com'
$cname = Join-Path $Root 'CNAME'
if (Test-Path $cname) {
  $c = ([System.IO.File]::ReadAllText($cname, $utf8)).Trim()
  if ($c) { $domain = $c }
}
$base = "https://$domain"

$today  = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd')
$newest = @($sorted | Where-Object { $_.date -match '^\d{4}-\d{2}-\d{2}' } | ForEach-Object { $_.date.Substring(0, 10) } | Sort-Object -Descending) | Select-Object -First 1
if (-not $newest) { $newest = $today }

$esc = { param($s) [System.Security.SecurityElement]::Escape($s) }
$images = @("$base/assets/img/hero-building.jpg")
foreach ($i in $sorted) {
  if ($i.img) { $images += ($base + '/' + $i.img.TrimStart('/')) }
}
$images = @($images | Select-Object -Unique)

$xml = '<?xml version="1.0" encoding="UTF-8"?>' + "`n" +
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' + "`n" +
       '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' + "`n" +
       '  <url>' + "`n" +
       '    <loc>' + (& $esc "$base/") + '</loc>' + "`n" +
       '    <lastmod>' + $newest + '</lastmod>' + "`n" +
       (($images | ForEach-Object { '    <image:image><image:loc>' + (& $esc $_) + '</image:loc></image:image>' }) -join "`n") + "`n" +
       '  </url>' + "`n" +
       '</urlset>' + "`n"
[System.IO.File]::WriteAllText((Join-Path $Root 'sitemap.xml'), $xml, $utf8)

Write-Host ("built: {0} properties ({1} hidden skipped), sitemap with {2} images" -f $sorted.Count, $hiddenCount, $images.Count)
