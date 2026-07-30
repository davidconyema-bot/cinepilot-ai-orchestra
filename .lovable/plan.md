## Goal
Change the actor login (nusaibasaudu@gmail.com) password from `12345678` to `12345678qwerty`.

## Why two steps are needed
The account already exists in the backend (created Jul 29), so its stored password won't change just by editing the constant in the code. The existing user record has to be updated too.

## Steps

1. **Update the app constant**
   - `src/lib/actor-data.ts`: `ACTOR_PASSWORD = "12345678qwerty"`.
   - This keeps the auto-provision / auto-sign-in path on `/auth` working for the actor account (`src/routes/auth.tsx` compares against this constant).

2. **Update the existing account's password**
   - Add a temporary admin-only server function that uses the privileged backend client to set the password for `nusaibasaudu@gmail.com`.
   - Invoke it once, confirm success.
   - Delete the temporary function immediately afterwards so no password-changing endpoint is left in the app.

3. **Verify**
   - Sign in at `/auth` with `nusaibasaudu@gmail.com` / `12345678qwerty` and confirm it lands on the Actor Studio dashboard.

## Note
The credentials remain hardcoded demo values visible in the client bundle — unchanged from today's setup, just a new value.
