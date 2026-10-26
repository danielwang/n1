# Figma-to-DESIGN.md workflow

1. Obtain the authoritative N1 Figma file and current component/code library. Confirm permission and access.
2. Use connected Figma MCP when available; otherwise use an authorized variable/token export. Capture file URLs and component node IDs where available.
3. Inventory variable collections, modes, token aliases, typography, spacing, radii, elevation, icons, components, states and responsive examples.
4. Classify information: explicit source value, inferred visual pattern, or missing. Do not turn an observation into a rule without validation.
5. Generate or update the standalone `DESIGN.md` according to the intended consumer's schema. Do not copy this skill's provisional `references/DESIGN.md` as a purported official export.
6. Map semantics and aliases to the actual component library; verify every numeric value and font.
7. Audit contrast and state coverage, compare representative component screenshots and implement a small prototype.
8. Record extraction date, Figma file URL, design-system version, missing content and reviewer.

## Copy-ready extraction prompt
"Inspect the provided N1 Figma design-system file through approved MCP access. Extract semantic tokens, modes and component states with exact source references. First produce an inventory and uncertainty report. Then produce DESIGN.md using only verified facts; label missing information instead of inventing values. Compare results to the N1 code library and summarize differences."
