import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { carbonara } from "./scraper/maker/carbonara.js";
import { ai4chat } from "./scraper/ai/ai4chat.js";
import { pinterest } from "./scraper/search/pinterest.js";
import { konachan } from "./scraper/search/konachan.js";
import { bratgenerator } from "./scraper/maker/brat.js";
import { quotly } from "./scraper/maker/quotly.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = new Hono();

export const config = {
  runtime: "edge",
};

// templates
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const home = fs.readFileSync(
  path.join(__dirname, "../templates/index.html"),
  "utf-8"
);
app.get("/", (c) => {
  return c.html(home);
});

app.get("/system/ip", async (c) => {
  try {
    const response = await fetch("https://ipinfo.io/json");
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json(
      {
        author: "Leuthra",
        error: "Unable to fetch IP information",
      },
      500
    );
  }
});

app.get("/api/maker/carbonara", async (c) => {
  const text = c.req.query("text");
  if (!text) {
    return c.json({ error: "Text is required" }, 400);
  }
  try {
    const data = await carbonara(text);
    const buff = Buffer.from(data, "base64");
    return new Response(buff, {
      headers: {
        "cache-control": "no-store",
        "Content-Disposition": 'inline; filename="image.png"',
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.log(error);
    return c.json(
      { author: "Leuthra", error: "Unable to generate image" },
      500
    );
  }
});

app.get("/api/ai/ai4chat", async (c) => {
  const text = c.req.query("text");
  if (!text) {
    return c.json(
      {
        author: "Leuthra",
        error: "Text is required",
      },
      400
    );
  }
  try {
    const data = await ai4chat(text);
    return c.json({
      author: "Leuthra",
      result: JSON.parse(data),
    });
  } catch (error) {
    return c.json({ author: "Leuthra", error: "Unable to retrieve data" }, 500);
  }
});

app.get("/api/search/pinterest", async (c) => {
  const text = c.req.query("text");
  if (!text) {
    return c.json({ author: "Leuthra", error: "Text is required" }, 400);
  }
  try {
    const data = await pinterest(text);
    return c.json({ author: "Leuthra", result: data });
  } catch (error) {
    return c.json({ author: "Leuthra", error: "Unable to retrieve data" }, 500);
  }
});

app.get("/api/search/konachan", async (c) => {
  const text = c.req.query("text");
  if (!text) {
    return c.json({ author: "Leuthra", error: "Text is required" }, 400);
  }
  try {
    const data = await konachan(text);
    return c.json({ author: "Leuthra", result: data });
  } catch (error) {
    return c.json({ author: "Leuthra", error: "Unable to retrieve data" }, 500);
  }
});

app.get("/api/maker/brat", async (c) => {
  const text = c.req.query("text");
  if (!text) {
    return c.json({ author: "Leuthra", error: "Text is required" }, 400);
  }
  try {
    const data = await bratgenerator(text);
    const buff = Buffer.from(data, "base64");
    return new Response(buff, {
      headers: {
        "cache-control": "no-store",
        "Content-Disposition": 'inline; filename="image.png"',
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    return c.json(
      { author: "Leuthra", error: "Unable to generate image" },
      500
    );
  }
});

app.get("/api/maker/quotly", async (c) => {
  const avatar = c.req.query("avatar");
  const name = c.req.query("name");
  const text = c.req.query("text");
  const theme = c.req.query("theme") || "gelap";

  if (!avatar || !name || !text) {
    return c.json(
      { author: "Leuthra", error: "Avatar, name, and text are required" },
      400
    );
  }

  try {
    const data = await quotly(text, name, avatar, theme);
    const buff = Buffer.from(data, "base64");

    return new Response(buff, {
      headers: {
        "cache-control": "no-store",
        "Content-Disposition": 'inline; filename="quote.png"',
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    return c.json(
      { author: "Leuthra", error: "Unable to generate image" },
      500
    );
  }
});

app.notFound((c) => {
  return c.json({
    author: "Leuthra",
    message: "Not Found",
  });
});

app.onError((err, c) => {
  console.log(`${err}`);
  return c.json({
    author: "Leuthra",
    message: "Internal Server Error",
  });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
