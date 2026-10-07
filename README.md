# ZTP Lifestyle storefront

A responsive storefront ready for GitHub Pages. It uses plain HTML, CSS and JavaScript, so there is no build step. It includes a secure Supabase-backed product editor at `/admin.html`.

## Preview locally

Open `index.html` in a browser.

## Put your own logo and product photos in

- Replace `assets/logo.svg` with your logo (keep the filename), or update the logo image path in `index.html`.
- If you do not connect Supabase, sample products are in `script.js`. Once Supabase is connected, add and manage products from `/admin.html`.
- The large cover photo is set in `styles.css` under `.hero-image`. Replace that image URL with your own photo.
- Update the sample email address, Instagram link, prices and offer text in `index.html` and `script.js` before launch.

## Turn on the private product manager

The storefront can use GitHub Pages as static hosting; secure admin sign-in and shared product/image storage are provided by Supabase.

1. Create a Supabase project at [supabase.com](https://supabase.com/).
2. In the Supabase project, open **SQL Editor**, create a query, paste the contents of `supabase-setup.sql`, and run it.
3. In Supabase **Authentication → Users**, add your own user with your admin email and a strong password. Do not enable public sign-ups.
4. In the SQL Editor, run the final admin insert example from `supabase-setup.sql`, replacing `YOUR-ADMIN-EMAIL` with the email used for the user you created. This is what grants admin access.
5. In Supabase **Project Settings → API Keys**, copy the **Project URL** and the **publishable key** (or legacy anon key). Put them in `supabase-config.js`. Never use the `service_role` or secret key in this website.
6. Upload the updated website files to GitHub and wait for the Pages workflow to finish.
7. Visit `https://YOUR-USERNAME.github.io/ztp-lifestyle/admin.html`, sign in with the admin account, and add products. Customers only see the storefront; database policies also block their write access.

The browser key is intended to be public. Supabase Row Level Security policies in the SQL setup restrict product edits and image uploads to the account added to `admin_users`.

## Publish free on GitHub Pages

1. Create or sign into a GitHub account, then choose **New repository**. Name it `ztp-lifestyle` and set it to **Public**.
2. Unzip this package on your computer. In the new repository, choose **Add file → Upload files**, then upload the *contents* of the `ztp-lifestyle` folder (make sure `index.html` is at the repository's top level). Commit the files.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. GitHub will show your live link under **Settings → Pages** after publishing finishes. A project site normally uses `https://YOUR-USERNAME.github.io/ztp-lifestyle/`.

GitHub Pages hosts the website files. The contact email link opens the visitor's email app; it does not store orders or form submissions. Add your preferred order/contact service if you need submissions collected online.
