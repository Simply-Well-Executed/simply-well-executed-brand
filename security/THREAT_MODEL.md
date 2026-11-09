# Simply Well Executed threat model · 2026-11-09

**Status:** Security method and gap register, not a penetration-test report or a certification.

## Source & adaptation
Adapted from nvm-sh/nvm's THREAT_MODEL.md: https://github.com/nvm-sh/nvm/blob/master/.github/THREAT_MODEL.md
The source treats command input, URI/path resolution, transport, environment variables, insiders, third parties and the payload/metadata trust boundary separately. These are *analogies* to the SWE website; the nvm CLI and mirrors are not deployed in SWE.

## Assets & actors
Assets: public source, translated standards content, branded SVGs and output, Bun dependencies and lockfile, GitHub Actions, Lovable publishing privileges, Supabase data and credentials, website uptime, and Git provenance.
Threat actors: external visitors, compromised dependencies or runners, malicious insiders, compromised accounts, and an unauthorized user of the Lovable API key.

## Risk and control register
| ID | Boundary | Mitigation / evidence | Remaining gap |
|---|---|---|---|
| T1 | User inputs to server commands | SWE C++20 five-channel *demonstration* without dynamic evaluation | Review live SSR handlers; PoC is not runtime validation |
| T2 | URL/path to filesystem | Guard rejects userinfo, unallowlisted hosts, traversal, encoded delimiters; asset symlink check | Redirects, actual filesystem containment, archive extraction still need review |
| T3 | Untrusted network | Fixed HTTPS endpoint and strict redirects in publish script | Independently review CDN/TLS and production headers |
| T4 | Env vars / secrets | Only six explicit public Supabase key names allowed in tracked .env; GitHub Actions secret for Lovable | Full historical secret scan, rotation and Supabase RLS review remain |
| T5 | Insiders & workflows | CODEOWNERS, read-only PR checks, segregated deployment workflow, no forced push | Enforce branch rulesets and required reviewers in GitHub UI |
| T6 | Third-party libraries | Frozen Bun lockfile, dependency audit, pinned actions on new workflows | Vulnerabilities and inherited transitive dependencies still need triage |
| T7 | Source metadata / interpreter | Remote metadata never evaluated; C++20 source pinned to commit in CI | Audit existing runtime and supply-chain tool behavior separately |
| T8 | Payload vs checksum | SHA-256 of 18 artwork files checked against committed manifest | Same-origin checksum does not prove origin authenticity or signing |
| T9 | Unicode & locales | Existing multilingual release gate preserved, RTL routes and fonts left unchanged | Real-browser RTL and assistive-technology testing needed |
| T10 | Lovable release divergence | Separate scan, commit-SHA equality and workflow-success gates | Publishing blocked if API key, scan or synchronization absent |
| T11 | Production DB migration | No migrations or data writes introduced by CI | Manual review and explicit approval needed for migration |

## Mandatory interpretation
- AND of independently required checks determines approval. OR and XOR are diagnostic signals, not permission.
- A hash validates integrity relative to an expected digest; it does not authenticate a compromised origin.
- The preexisting MIN-family ROT/CRC and multilingual rendering mechanisms are not encryption or authorization.
- No security guarantee follows just from a passing build, lack of reported vulnerabilities, or a GitHub badge.
- Source-file copyright, repository authorship and Git history must not be confused with trademark registration.

## Incident handling
Revoke exposed tokens, disable publishing, preserve audit and workflow evidence, assess affected data, remediate, revalidate a pinned revision and document a controlled restoration. Do not overwrite history to hide failures.

## Evidence
- security/verify-assets.sh: checksums, SVG syntax, symlinks, public .env key allowlist and forbidden workflow patterns.
- SWE Security & Integrity Gate: frozen dependencies, release wording gate, build, high-severity audit, pinned C++20 guard.
- pentagonal-xor-cpp20/shared: C++20 proof of concept with all 32 parity states and malicious-input counterexamples.
- Lovable-publish workflow: requires matching branch SHA, matching completed Lovable scan with no high/critical findings.

Unimplemented organizational controls: GitHub branch protection with CODEOWNERS and two reviews, secret scanning/push protection, full RLS/SSR audit, pentest, and externally verifiable release attestation.

References: nvm THREAT_MODEL and INCIDENT_RESPONSE_PLAN, Lovable API documentation, OWASP GitHub Actions Security Cheat Sheet.

**Deployment opt-in safeguard (2026-11-09):** publishing additionally requires Actions variable `SWE_ALLOW_PRODUCTION_DEPLOY=true`; it is absent by default. Matching successful CodeQL static-analysis results are also mandatory. A missing variable or missing protected secret causes no production publication.
