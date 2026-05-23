import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/github/:owner/:repo", async (req, res) => {
  const owner = String(req.params.owner ?? "").trim();
  const repo = String(req.params.repo ?? "").trim();

  if (!owner || !repo) {
    res.json({ repo: null });
    return;
  }

  try {
    const gh = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "shubhsanket-portfolio",
        },
      }
    );

    if (!gh.ok) {
      res.json({ repo: null });
      return;
    }

    res.json({ repo: await gh.json() });
  } catch {
    res.json({ repo: null });
  }
});

app.get("/api/content", async (_req, res) => {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "profile.json"), "utf-8");
    res.json(JSON.parse(raw));
  } catch {
    res.status(500).json({ ok: false, error: "Failed to load content." });
  }
});

app.post("/api/contact", async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const email = String(req.body?.email ?? "").trim();
  const message = String(req.body?.message ?? "").trim();

  if (!name || !email || !message) {
    res.status(400).json({ ok: false, error: "All fields are required." });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ ok: false, error: "Please enter a valid email." });
    return;
  }

  if (message.length > 4000) {
    res.status(400).json({ ok: false, error: "Message is too long." });
    return;
  }

  const entry = { name, email, message, at: new Date().toISOString() };
  const contactsPath = path.join(DATA_DIR, "contacts.json");

  try {
    let list = [];
    try {
      list = JSON.parse(await fs.readFile(contactsPath, "utf-8"));
    } catch {
      list = [];
    }
    if (!Array.isArray(list)) list = [];
    list.push(entry);
    await fs.writeFile(contactsPath, JSON.stringify(list, null, 2));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "Could not save your message." });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio API listening on http://localhost:${PORT}`);
});
