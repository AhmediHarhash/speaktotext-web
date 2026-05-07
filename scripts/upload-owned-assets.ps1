param(
  [string]$MediaBucket = "speaktotext-media",
  [string]$DownloadsBucket = "speaktotext-downloads",
  [string]$Version = "0.0.0"
)

$ErrorActionPreference = "Stop"

function Upload-R2Object {
  param(
    [string]$Bucket,
    [string]$Key,
    [string]$File,
    [string]$ContentType,
    [string]$CacheControl
  )

  if (-not (Test-Path -LiteralPath $File)) {
    Write-Warning "Missing file, skipped: $File"
    return
  }

  Write-Host "Uploading $File -> $Bucket/$Key"
  & npx wrangler r2 object put "$Bucket/$Key" --remote --file "$File" --content-type "$ContentType" --cache-control "$CacheControl"
  if ($LASTEXITCODE -ne 0) {
    throw "Upload failed: $Bucket/$Key"
  }
}

$immutable = "public, max-age=31536000, immutable"
$short = "public, max-age=60"

Upload-R2Object `
  -Bucket $MediaBucket `
  -Key "final-cta/v1/final-cta-loop.webm" `
  -File "exports/final-cta/v1/final-cta-loop.webm" `
  -ContentType "video/webm" `
  -CacheControl $immutable

Upload-R2Object `
  -Bucket $MediaBucket `
  -Key "final-cta/v1/final-cta-loop.mp4" `
  -File "exports/final-cta/v1/final-cta-loop.mp4" `
  -ContentType "video/mp4" `
  -CacheControl $immutable

Upload-R2Object `
  -Bucket $MediaBucket `
  -Key "final-cta/v1/final-cta-poster.avif" `
  -File "exports/final-cta/v1/final-cta-poster.avif" `
  -ContentType "image/avif" `
  -CacheControl $immutable

Upload-R2Object `
  -Bucket $MediaBucket `
  -Key "hero/v1/hero-video.mp4" `
  -File "exports/hero/v1/hero-video.mp4" `
  -ContentType "video/mp4" `
  -CacheControl $immutable

Upload-R2Object `
  -Bucket $MediaBucket `
  -Key "hero/v1/hero-poster.avif" `
  -File "exports/hero/v1/hero-poster.avif" `
  -ContentType "image/avif" `
  -CacheControl $immutable

Upload-R2Object `
  -Bucket $MediaBucket `
  -Key "how-it-works/v1/how-it-works-video.mp4" `
  -File "exports/how-it-works/v1/how-it-works-video.mp4" `
  -ContentType "video/mp4" `
  -CacheControl $immutable

Upload-R2Object `
  -Bucket $MediaBucket `
  -Key "how-it-works/v1/how-it-works-poster.avif" `
  -File "exports/how-it-works/v1/how-it-works-poster.avif" `
  -ContentType "image/avif" `
  -CacheControl $immutable

Upload-R2Object `
  -Bucket $DownloadsBucket `
  -Key "releases/$Version/SpeakToText-Setup.exe" `
  -File "exports/downloads/$Version/SpeakToText-Setup.exe" `
  -ContentType "application/vnd.microsoft.portable-executable" `
  -CacheControl $immutable

Upload-R2Object `
  -Bucket $DownloadsBucket `
  -Key "latest.json" `
  -File "exports/downloads/latest.json" `
  -ContentType "application/json" `
  -CacheControl $short
