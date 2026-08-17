# Ownership and Handoff

## Ownership model

Prefer client-owned assets where practical:

- domains and DNS zones;
- Google Business Profiles;
- sender identities/domains;
- communication-provider accounts;
- CRM/scheduling/POS accounts;
- production cloud resources for dedicated deployments.

LDW uses named/scoped access instead of shared credentials.

An LDW-managed shared service may own the shared application infrastructure because management itself creates service value, while each client's business identities and destinations remain tenant-owned/configured assets.

## Onboarding

Future onboarding should record ownership and authority for each external asset, deployment model, tenant/location mapping, data classification, support responsibility, provider billing ownership, and export/offboarding expectations.

Do not collect credentials into repository documentation.

## Offboarding

A future supported offboarding path should:

1. disable pending work/integration identities as appropriate;
2. revoke/remove LDW access to client-owned providers/resources;
3. export agreed tenant configuration and applicable client-owned data;
4. transfer or document authoritative destinations/configuration;
5. delete tenant data according to approved retention/disposition policy;
6. retain only justified security/audit evidence;
7. document completion without embedding customer secrets or regulated data.

## Public source and service model

The Apache-2.0 codebase is portable. LDW's commercial value should come from deployment, integration, operation, maintenance, security, customization, and support rather than withholding a practical handoff path.
