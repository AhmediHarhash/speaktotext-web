param(
  [string]$MediaBucket = "speaktotext-media",
  [string]$DownloadsBucket = "speaktotext-downloads",
  [string]$Location = "weur"
)

$ErrorActionPreference = "Stop"

function Run-Wrangler {
  param([string[]]$Args)

  & npx wrangler @Args
  if ($LASTEXITCODE -ne 0) {
    throw "wrangler $($Args -join ' ') failed with exit code $LASTEXITCODE"
  }
}

Write-Host "Checking Cloudflare authentication..."
Run-Wrangler @("whoami")

foreach ($bucket in @($MediaBucket, $DownloadsBucket)) {
  Write-Host "Creating R2 bucket if needed: $bucket"
  & npx wrangler r2 bucket create $bucket --location $Location
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Bucket create failed for $bucket. If it already exists, this is fine; otherwise re-run after fixing Wrangler auth."
  }
}

Write-Host ""
Write-Host "Next manual Cloudflare dashboard steps:"
Write-Host "1. Open R2 > $MediaBucket > Settings > Public access > Connect custom domain: media.speaktotext.org"
Write-Host "2. Open R2 > $DownloadsBucket > Settings > Public access > Connect custom domain: downloads.speaktotext.org"
Write-Host "3. Keep both records proxied in Cloudflare."
