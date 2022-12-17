import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import * as jdenticon from "npm:jdenticon";

const app = new Application();
const router = new Router();

router.get("/", async (ctx) => {
  await send(ctx, "index.html");
});

router.get("/:username/:size", (ctx) => {
  const imgBuf = jdenticon.toPng(
    ctx.params.username,
    parseInt(ctx.params.size),
  );
  ctx.response.body = imgBuf;
  ctx.response.headers.set("Content-Type", "image/png");
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
