# GitHub-to-Lovable gated publishing

Lovable project ID: 975a1426-4d20-433c-8675-00a7e8e80d2e
Production domain: https://simpwellx.com
Git repository: Simply-Well-Executed/simply-well-executed-brand

Git push and Lovable Git synchronization update source/preview, NOT the published custom domain.

## Flow
1. Read-only SWE Security & Integrity Gate must pass on a reviewed push to main.
2. A separate post-gate workflow runs with restricted GitHub permissions and the protected production environment.
3. Recheck the current main commit against the triggering SHA and the Lovable project's latest_commit_sha. Fail closed on mismatch.
4. Query Lovable security scans for a completed scan for *exactly the same commit*. If missing, stale or with untriaged high/critical findings, block publication.
5. POST https://api.lovable.dev/v1/projects/{project_id}/publish, then poll GET /v1/projects/{project_id}/publish/{deployment_id}, verifying status, HTTPS URL and later the custom domain.

## Setup required
The Lovable public REST API requires a Business or Enterprise workspace API key. The connected ChatGPT plugin cannot provide its credentials to GitHub Actions.
Create a short-lived token with Projects read/write access in Lovable Workspace settings → API keys & OAuth → Workspace access tokens.
Add the token as a GitHub repository/production environment Actions secret named LOVABLE_API_KEY. Do not commit it.
Create a production environment with required human reviewers and branch restrictions. Require the SWE security workflow status check in a branch ruleset.
Enable a current Lovable security scan for the reviewed commit (Lovable Security view).

The pipeline is *fail closed* without its secret, a matching security scan, and synchronized source state. It will not silently deploy old code.

References: https://docs.lovable.dev/api-reference/introduction and https://docs.lovable.dev/api-reference/deploy-domains/get-publish-status

## Explicit production activation

The privileged workflow also requires an explicit GitHub Actions variable `SWE_ALLOW_PRODUCTION_DEPLOY` set to `true`. Its default/absent value keeps publication disabled. Configure the variable under **Settings → Secrets and variables → Actions → Variables** only after verifying branch protections, production-environment reviewers, matching Lovable security scan, a clean dependency audit, and code review. The publisher also requires a successful CodeQL analysis run for the exact same commit SHA.

## Verified account limitation and deployment activation (November 9, 2026)

The connected Lovable workspace "Paul's Lovable" (`65dcd5e419a56a8bc0ed`) is currently **Pro**, with owner permissions. Lovable's standalone API key issuance and /v1 public API require **Business or Enterprise**. Therefore this automated REST publishing cannot be activated on the current Pro plan. Native Lovable/ChatGPT publishing can still be performed separately following review.

GitHub account integrations in ChatGPT cannot administer repository environment settings, Actions secrets or variables. These must be set by a repository administrator through the browser or authenticated GitHub CLI. The connected Lovable app credential is not accessible to GitHub Actions.

### Account-owner setup

1. If desired, upgrade the Lovable workspace to **Business or Enterprise**, then open **Workspace settings → API keys & OAuth → Workspace access tokens**. Generate a scoped `projects:read` + `projects:write` token with an appropriate expiry. Never paste the token into a chat or store it in the repository.
2. In the GitHub [repository environments](https://github.com/Simply-Well-Executed/simply-well-executed-brand/settings/environments), configure `production`. Require human reviewers and restrict deployment to `main`. Where feasible, enable prevent-self-review and disable bypass.
3. Add an **environment secret** named `LOVABLE_API_KEY` under the protected `production` environment. Do not use a plaintext repository variable. Use GitHub UI or GitHub CLI prompt (below).
4. Repair and review **all high/critical dependency audit findings**. Ensure both GitHub's `SWE Security & Integrity Gate` and `CodeQL` pass for the same main commit. Do not set an audit suppression merely to allow publication.
5. In Lovable, complete a security scan for the approved commit and review its findings. A scan for an older revision will be rejected.
6. Only when all conditions pass, explicitly set the **repository** Actions variable `SWE_ALLOW_PRODUCTION_DEPLOY=true` under [Actions variables](https://github.com/Simply-Well-Executed/simply-well-executed-brand/settings/variables/actions). Without this variable the deploy job remains skipped.
7. Push a reviewed main-branch commit, inspect the workflow and approve the GitHub protected environment. Verify `https://simpwellx.com/` and the emblem URL after Lovable reports successful publishing.

### Read-only PowerShell 7 preflight

Run from a clone of the repository. The script checks GitHub environment metadata, required reviewers, the **presence of the secret name** (never its value), the explicit opt-in variable and whether the two security checks succeeded for the same head commit.

```powershell
winget install --id GitHub.cli
gh auth login
pwsh.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\security\Test-LovableAutomationReadiness.ps1
```

The preflight does not publish, override failures or test the Lovable token; Lovable API access and scan evidence require separate verification.

### Add the credential without exposing it

Only after configuring required reviewers, on your own authenticated computer:

```powershell
gh secret set LOVABLE_API_KEY --env production --repo Simply-Well-Executed/simply-well-executed-brand
```

The GitHub CLI prompts for the secret value. Do not use a command-line token literal or paste it into an issue, commit, or chat.

Activate the repository-wide opt-in **only after release gates and Lovable scan evidence are clean**:

```powershell
gh variable set SWE_ALLOW_PRODUCTION_DEPLOY --body true --repo Simply-Well-Executed/simply-well-executed-brand
```

To immediately disable automation, set that variable to `false` or remove it. The pipeline continues to enforce security tests and SHA matching.

### Pro-plan manual alternative

Stay on Lovable Pro and keep the independent GitHub checks. Once the gates are clean, publish with the **Lovable editor** or the connected **Lovable ChatGPT plugin** after human review. This is not a fully automated GitHub-to-Lovable API pipeline, and must not be represented as one.
