# Checkmate event website + MySQL

## Deploy free with Vercel + TiDB Cloud

The `api/registrations.js` file is the Vercel API for the form. Vercel automatically hosts the site and this API when you import this folder from GitHub.

1. Create a free TiDB Cloud Starter cluster and create a database named `checkmate_event`.
2. Run `schema.sql` in TiDB Cloud's SQL Editor to create the registrations table.
3. Import this folder's GitHub repository into Vercel.
4. In Vercel, open **Project → Settings → Environment Variables** and add every value from `.env.vercel.example`, using the actual TiDB Cloud connection details.
5. Deploy. Do not upload your local `.env` file to GitHub.

The Vercel API requires `DB_SSL=true`, because TiDB Cloud uses a secure connection.

## Run locally with MySQL

## 1. Create the database

Run `schema.sql` in MySQL Workbench or use:

```bash
mysql -u root -p < schema.sql
```

## 2. Configure credentials

Copy `.env.example` to `.env`, then set the MySQL host, user, password, and database name. Never upload `.env` to GitHub.

## 3. Install and run

```bash
npm install
npm start
```

Open http://localhost:3000. Do not open `index.html` directly once using the database: the Node server supplies the `/api/registrations` endpoint.

Each form submission is saved in the `registrations` table. Scholar numbers are unique, so a participant cannot register twice.
