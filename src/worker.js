function encodePayload(data) {
  return btoa(JSON.stringify(data));
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const authKey = request.headers.get("x-api-key");
    if (!authKey || authKey !== env.APIKEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const isEnable = url.pathname === "/enable";
    const isDisable = url.pathname === "/disable";

    if (!isEnable && !isDisable) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!env.GAESA || !env.SESSION) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sessionCookie = `GAESA=${env.GAESA}; session=${env.SESSION}`;
    const payloadData = [{ enabled: 1 }, isEnable];
    const payload = encodePayload(payloadData);

    try {
      const upstreamRes = await fetch(
        "https://ampcode.com/_app/remote/w6b2h6/setAmpFreeEnabled",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, */*;q=0.1",
            Origin: "https://ampcode.com",
            Referer: "https://ampcode.com/settings",
            Cookie: sessionCookie,
          },
          body: JSON.stringify({ payload, refreshes: [] }),
        }
      );

      const bodyText = await upstreamRes.text();
      const contentType =
        upstreamRes.headers.get("content-type") || "application/json";

      return new Response(bodyText, {
        status: upstreamRes.status,
        headers: { "Content-Type": contentType },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Failed to reach ampcode.com" }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
