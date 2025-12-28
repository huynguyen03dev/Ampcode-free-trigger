function encodePayload(data) {
  return btoa(JSON.stringify(data));
}

export default {
  async fetch(request, env) {
    const authKey = request.headers.get("x-api-key");
    if (authKey !== env.APIKEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const sessionCookie = `GAESA=${env.GAESA};session=${env.SESSION}`;

    const url = new URL(request.url);
    const isEnable = url.pathname === "/enable";
    const isDisable = url.pathname === "/disable";

    if (!isEnable && !isDisable) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const payloadData = [{ enabled: 1 }, isEnable];
    const payload = encodePayload(payloadData);

    const res = await fetch("https://ampcode.com/_app/remote/w6b2h6/setDailyGrantEnabled", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Origin": "https://ampcode.com",
        "Referer": "https://ampcode.com/settings",
        "Cookie": sessionCookie
      },
      body: JSON.stringify({ payload, refreshes: [] })
    });

    return new Response(await res.text(), {
      headers: { "Content-Type": "application/json" }
    });
  }
}