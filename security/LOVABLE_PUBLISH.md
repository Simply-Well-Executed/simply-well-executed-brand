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
