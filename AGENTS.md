<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep signed-in game screens on top-level routes behind the shared session-aware `AppShell`; this preserves the requested public URLs while centralizing access control.
- Keep account identity, profile, role, and notification data in Lovable Cloud; this prevents browser storage from becoming a security boundary.
- Register the generated app service worker only through the guarded PWA wrapper; this keeps previews fresh while supporting published offline use.
