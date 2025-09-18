// at top
const { isAuthenticated, getIdToken } = useAuth();
// add: disable while auth state is loading to avoid bouncing
const [busy, setBusy] = useState<"monthly" | "annual" | null>(null);

const goCheckout = async (plan: "monthly" | "annual") => {
  // Require login first
  if (!isAuthenticated) {
    router.push(`/login?next=${encodeURIComponent("/pricing")}`);
    return;
  }

  setBusy(plan);
  try {
    // Try to get a token; if missing, nudge Amplify and retry once
    let idToken = await getIdToken();
    if (!idToken) {
      await new Promise(r => setTimeout(r, 250)); // brief wait
      idToken = await getIdToken();
    }
    if (!idToken) throw new Error("Could not get auth token.");

    const res = await fetch(`${API_BASE}/billing/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: idToken },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.url) window.location.href = data.url;
    else alert(data?.message || "Could not start checkout.");
  } catch (e) {
    console.error("Checkout error:", e);
    alert("An error occurred during checkout.");
  } finally {
    setBusy(null);
  }
};
