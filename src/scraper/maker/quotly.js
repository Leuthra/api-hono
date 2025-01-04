import axios from "axios";

async function quotly(text, name, avatar, theme) {
  const json = {
    type: "quote",
    format: "png",
    backgroundColor: "terang" === theme
        ? "#ffffff"
        : "gelap" === theme
          ? "#1b1429"
          : `#${[...Array(3)]
              .map(() =>
                Math.floor(200 * Math.random())
                  .toString(16)
                  .padStart(2, "0"),
              )
              .join("")}`,
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: name,
          photo: {
            url: avatar,
          },
        },
        text: text,
        replyMessage: {},
      },
    ],
  };
  try {
    const res = await axios.post(
      "https://bot.lyo.su/quote/generate",
      json,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const buffer = Buffer.from(res.data.result.image, "base64");
    return buffer;
  } catch (error) {
    console.error("Unable to generate image");
  }
}

export { quotly };
