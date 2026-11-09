# SPDX-License-Identifier: 0BSD
# Read-only PowerShell 7 preflight for Simply Well Executed.
# It does not retrieve secret values or authorize a deployment.
[CmdletBinding()]
param(
  [string]$Repository = 'Simply-Well-Executed/simply-well-executed-brand',
  [string]$Environment = 'production'
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false

function Get-GhJson([string]$Endpoint) {
  try {
    $raw = & gh api --method GET $Endpoint 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $raw) { return $null }
    return (($raw -join [Environment]::NewLine) | ConvertFrom-Json -AsHashtable)
  } catch { return $null }
}
function New-Check([string]$Name, [bool]$Passed, [string]$Details) {
  return [pscustomobject]@{
    Check = $Name
    Result = $(if ($Passed) { 'PASS' } else { 'BLOCKED / UNVERIFIED' })
    Details = $Details
  }
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw 'Install GitHub CLI first: winget install --id GitHub.cli'
}
& gh auth status 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Sign in with GitHub CLI: gh auth login' }

$ref = Get-GhJson "repos/$Repository/git/ref/heads/main"
if ($null -eq $ref) { throw 'Unable to read repository main branch.' }
$sha = [string]$ref.object.sha
if ($sha -notmatch '^[a-f0-9]{40}$') { throw 'Unexpected main commit SHA.' }

$results = [System.Collections.Generic.List[object]]::new()
$results.Add((New-Check 'Current GitHub HEAD' $true $sha))

$envData = Get-GhJson "repos/$Repository/environments/$Environment"
$envOk = $null -ne $envData
$results.Add((New-Check 'Production environment' $envOk $(if ($envOk) {'Exists'} else {'Missing / inaccessible'})))
$rules = if ($envOk -and $envData.Contains('protection_rules')) { @($envData.protection_rules) } else { @() }
$hasReview = @($rules | Where-Object { $_.type -eq 'required_reviewers' }).Count -gt 0
$results.Add((New-Check 'Required human reviewers' $hasReview $(if ($hasReview) {'Configured'} else {'Not configured or unverified'})))

$secrets = if ($envOk) { Get-GhJson "repos/$Repository/environments/$Environment/secrets" } else { $null }
$hasSecret = $false
if ($null -ne $secrets -and $secrets.Contains('secrets')) {
  $hasSecret = @($secrets.secrets | Where-Object { $_.name -eq 'LOVABLE_API_KEY' }).Count -gt 0
}
$results.Add((New-Check 'LOVABLE_API_KEY name' $hasSecret $(if ($hasSecret) {'Present; value remains private'} else {'Not present / permission unavailable'})))

$flag = Get-GhJson "repos/$Repository/actions/variables/SWE_ALLOW_PRODUCTION_DEPLOY"
$enabled = $null -ne $flag -and $flag.Contains('value') -and $flag.value -eq 'true'
$results.Add((New-Check 'Explicit publish opt-in' $enabled $(if ($enabled) {'true'} else {'Disabled by default'})))

foreach ($spec in @(
  @{ Name = 'SWE Security & Integrity Gate'; File = 'swe-security.yml' },
  @{ Name = 'CodeQL'; File = 'codeql.yml' }
)) {
  $data = Get-GhJson "repos/$Repository/actions/workflows/$($spec.File)/runs?per_page=100"
  $matching = @()
  if ($null -ne $data -and $data.Contains('workflow_runs')) {
    $matching = @($data.workflow_runs | Where-Object { $_.head_sha -eq $sha -and $_.event -eq 'push' } | Sort-Object run_number -Descending)
  }
  $run = if ($matching.Count -gt 0) { $matching[0] } else { $null }
  $pass = ($null -ne $run -and $run.status -eq 'completed' -and $run.conclusion -eq 'success')
  $details = if ($null -eq $run) {'No matching push workflow for current HEAD'} else {"$($run.status) / $($run.conclusion): $($run.html_url)"}
  $results.Add((New-Check $spec.Name $pass $details))
}
$results | Format-Table -Wrap -AutoSize
Write-Host ''
Write-Host 'Lovable API plan, token validity, and matching security scan require separate verification.' -ForegroundColor Yellow
Write-Host 'This script never deploys or reads secret values.' -ForegroundColor Cyan
if (@($results | Where-Object { $_.Result -ne 'PASS' }).Count -gt 0) { exit 1 }
Write-Host 'GitHub-only checks passed; Lovable-side approval is still required.' -ForegroundColor Green
