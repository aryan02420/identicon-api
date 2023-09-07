import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import * as jdenticon from "npm:jdenticon";

async function getHash(str: string) {
  const data = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = hashArray.map((b) => {
    return b.toString(16).padStart(2, "0");
  }).join("");
  return hashString;
}

function getImageSize(sizeString: string) {
  const size = parseInt(sizeString);
  if (Number.isNaN(size)) {
    return 200;
  }
  return Math.min(Math.max(8, size), 2048);
}

function getJdenticonConfigFromString(
  configString: string | null,
): jdenticon.JdenticonConfig {
  if (
    configString === null ||
    !/^([a-z0-9]{24})$/i.test(configString)
  ) {
    return {};
  }
  const configParts = {
    backgroundColor: configString.substring(0, 8),
    singleHue: configString.substring(8, 9),
    hue: configString.substring(9, 12),
    colorSaturation: configString.substring(12, 14),
    grayscaleSaturation: configString.substring(14, 16),
    colorLightnessMin: configString.substring(16, 18),
    colorLightnessMax: configString.substring(18, 20),
    grayscaleLightnessMin: configString.substring(20, 22),
    grayscaleLightnessMax: configString.substring(22, 24),
  };
  return {
    backColor: "#" + configParts.backgroundColor,
    hues: configParts.singleHue === "0"
      ? undefined
      : [parseInt(configParts.hue, 16)],
    lightness: {
      color: [
        parseInt(configParts.colorLightnessMin, 16) / 100,
        parseInt(configParts.colorLightnessMax, 16) / 100,
      ],
      grayscale: [
        parseInt(configParts.grayscaleLightnessMin, 16) / 100,
        parseInt(configParts.grayscaleLightnessMax, 16) / 100,
      ],
    },
    saturation: {
      color: parseInt(configParts.colorSaturation, 16) / 100,
      grayscale: parseInt(configParts.grayscaleSaturation, 16) / 100,
    },
  };
}

const app = new Application();
const router = new Router();

router.get("/", async (ctx) => {
  await send(ctx, "index.html");
});

router.get("/:username/:size", async (ctx) => {
  const configString = ctx.request.url.searchParams.get("config");
  const format = ctx.request.url.searchParams.get("format");

  const hash = await getHash(ctx.params.username);
  const size = getImageSize(ctx.params.size);
  const config = getJdenticonConfigFromString(configString);

  // Cache for 1 week, reuse for 1 day
  ctx.response.headers.set("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400, immutable");

  if (format === "png") {
    const imgBuf = jdenticon.toPng(hash, size, config);
    ctx.response.body = imgBuf;
    ctx.response.headers.set("Content-Type", "image/png");
    return;
  }

  const imgBuf = jdenticon.toSvg(hash, size, config);
  ctx.response.body = imgBuf;
  ctx.response.headers.set("Content-Type", "image/svg+xml");
  return;
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
