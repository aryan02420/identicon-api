import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import * as jdenticon from "npm:jdenticon";

function getJdenticonConfigFromString(
  configString: string | null,
): jdenticon.JdenticonConfig {
  if (configString === null) {
    return {};
  }
  if (!/^([a-z0-9]{24})$/i.test(configString)) {
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

router.get("/:username/:size", (ctx) => {
  const configString = ctx.request.url.searchParams.get("config");
  const imgBuf = jdenticon.toPng(
    ctx.params.username,
    parseInt(ctx.params.size),
    getJdenticonConfigFromString(configString),
  );
  ctx.response.body = imgBuf;
  ctx.response.headers.set("Content-Type", "image/png");
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
