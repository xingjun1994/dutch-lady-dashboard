export async function POST(request) {
  const { password } = await request.json();
  
  const correctPassword = process.env.DASHBOARD_PASSWORD || 'dutchlady2026';
  
  if (password === correctPassword) {
    return Response.json({ success: true });
  }
  
  return Response.json({ success: false, error: 'Incorrect password' }, { status: 401 });
}