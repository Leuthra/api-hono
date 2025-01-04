import axios from "axios";

async function carbonara(text) {
  try {
    const response = await fetch("https://carbonara.solopov.dev/api/cook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: text,
      }),
    });
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    throw new Error("Unable to generate image");
  }
}

export { carbonara };
