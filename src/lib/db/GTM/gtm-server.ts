// lib/gtm-server.ts
export async function sendServerEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    const clientId =
      (typeof window !== "undefined" && localStorage.getItem("ga_client_id")) ||
      crypto.randomUUID();

    // Optional: persist client_id for consistent user session
    if (typeof window !== "undefined") {
      localStorage.setItem("ga_client_id", clientId);
    }

    const payload = {
      client_id: clientId,
      events: [
        {
          name: eventName,
          params,
        },
      ],
    };

    await fetch("https://babytoysbd.com/som/g/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // helps on page unload
    });
  } catch (err) {
    console.error("GTM server send error:", err);
  }
}
