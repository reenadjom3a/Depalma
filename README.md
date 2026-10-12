# De Palma — First Anniversary Invitation

index.html is the whole invitation (all pictures are inside it).

Deploy with the guest notes wall working for everyone:
    npm install
    npx netlify-cli deploy --prod

Drag-and-drop deploys work too, but then each guest only sees the notes written on her own phone.

Deleting a note after publishing:
  1. Netlify → your site → Site configuration → Environment variables → add ADMIN_KEY = (any secret word), then redeploy.
  2. Open the invitation with ?admin=YOUR-SECRET at the end of the link (e.g. https://your-site.netlify.app/?admin=YOUR-SECRET).
  3. Each fan shows a small × — tap it and confirm. Guests never see the ×.
