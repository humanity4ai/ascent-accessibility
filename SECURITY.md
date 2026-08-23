# Security

The engine is a library for accessibility testing; it is not a network service itself. If you
believe you have found a security issue, please report it responsibly:

- Email contact@ascent-partners.com (do not open a public issue).

## What we care about
- **SSRF**: consumers should validate target URLs before scanning (the product wraps every
  target with a `validateTargetUrl` guard — see the full product repo).
- **Secrets**: the AI review is BYOK; never commit keys or tokens.

We will acknowledge reports within a few business days.
