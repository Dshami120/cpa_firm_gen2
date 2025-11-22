# YourCPA Firm Website (v3)

This is a production-ready v3 of the **YourCPA Firm** website.  
It includes:

- Fully responsive front-end (HTML + CSS + vanilla JS)
- Contact forms (home + contact page) wired to a Node/Express backend
- Newsletter subscription forms wired to the backend
- Simple JSON file storage for submissions (no database required)
- Ready to run on any Node-capable host (AWS, Render, etc.)

---

## Project Structure

```text
yourcpa_v3/
  index.html
  about.html
  services.html
  resources.html
  tax-center.html
  contact.html
  styles.css
  script.js
  server.js
  package.json
  .env.example
  data/
    contacts.json  (auto-created)
    newsletter.json (auto-created)
```

> All HTML pages share the same navigation, footer, and styling.

---

## Getting Started (Local)

1. **Install Node.js** (18+ recommended).

2. In a terminal, go to the project folder:

```bash
cd yourcpa_v3
```

3. Install dependencies:

```bash
npm install
```

4. Copy the example env file and adjust if you want a custom port:

```bash
cp .env.example .env
```

5. Start the server:

```bash
npm start
```

6. Open the site in your browser:

```text
http://localhost:3000
```

---

## How Forms Work

### Contact Forms

- Forms on the **Home** page and **Contact** page are marked with `data-form="contact-home"` and `data-form="contact-page"`.
- When you submit, the browser sends a JSON POST request to:

```http
POST /api/contact
```

- The backend validates the required fields (`name`, `email`, `message`), then appends the data to:

```text
data/contacts.json
```

Example saved record:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-0000",
  "message": "I'd like help with my business taxes.",
  "receivedAt": "2025-02-01T12:34:56.000Z",
  "source": "https://yourdomain.com/contact"
}
```

### Newsletter Forms

- Footer forms on every page use `data-form="newsletter"`.
- On submit they POST to:

```http
POST /api/newsletter
```

- The backend saves them to:

```text
data/newsletter.json
```

Example record:

```json
{
  "email": "client@example.com",
  "subscribedAt": "2025-02-01T12:34:56.000Z"
}
```

---

## Deploying

You can deploy this as a simple Node.js app almost anywhere:

### On a VPS / EC2

1. Copy the project folder to the server.
2. Run `npm install` once.
3. Use a process manager like `pm2` or `forever` to run `npm start`.
4. Set up Nginx / Apache as a reverse proxy from port 80/443 to the Node port (3000 or whatever you set).

### On Render / Railway / Fly.io / Heroku (or similar)

- Create a new Node app.
- Upload this repo or connect to your GitHub repo.
- It will run `npm install` and then `npm start` automatically (because of **package.json**).

---

## Customization Notes

- Update the firm details (name, address, phone, email) directly in the HTML files.
- To hook the contact form into email (SES, Gmail, etc.), extend `server.js` in `/api/contact` with a mail provider (e.g., `nodemailer`). Right now it just saves to JSON and logs to the console.
- Styling is controlled via `styles.css`. Colors and spacing are defined at the top in `:root` so you can quickly rebrand.

---

## Security Notes

- This demo backend does not implement CAPTCHA or rate limiting. Add those if you put the site on the public internet.
- For actual production use, ensure you:
  - Serve via HTTPS
  - Add basic validation / sanitization for inputs
  - Restrict file permissions for the `data/` folder
