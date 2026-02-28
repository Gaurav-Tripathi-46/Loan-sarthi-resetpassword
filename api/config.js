export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');
    
    // Return environment variables from Vercel
    res.status(200).json({
        SUPABASE_URL: process.env.SUPABASE_URL || null,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || null
    });
}