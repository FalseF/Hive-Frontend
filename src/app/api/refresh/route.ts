export async function POST() {
  const response = await fetch("https://localhost:7287/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
