# ZTP Lifestyle storefront

A responsive, static storefront ready for GitHub Pages. It uses plain HTML, CSS and JavaScript, so there is no build step.

## Preview locally

Open `index.html` in a browser.

## Put your own logo and product photos in

- Replace `assets/logo.svg` with your logo (keep the filename), or update the logo image path in `index.html`.
- Product images and sample names/prices are in `script.js`. Replace each `image` URL with your own image path, such as `assets/shirt.jpg`, and put that photo in the `assets` folder.
- The large cover photo is set in `styles.css` under `.hero-image`. Replace that image URL with your own photo.
- Update the sample email address, Instagram link, prices and offer text in `index.html` and `script.js` before launch.

## Publish free on GitHub Pages

1. Create or sign into a GitHub account, then choose **New repository**. Name it `ztp-lifestyle` and set it to **Public**.
2. Unzip this package on your computer. In the new repository, choose **Add file → Upload files**, then upload the *contents* of the `ztp-lifestyle` folder (make sure `index.html` is at the repository's top level). Commit the files.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. GitHub will show your live link under **Settings → Pages** after publishing finishes. A project site normally uses `https://YOUR-USERNAME.github.io/ztp-lifestyle/`.

GitHub Pages hosts the website files. The contact email link opens the visitor's email app; it does not store orders or form submissions. Add your preferred order/contact service if you need submissions collected online.
