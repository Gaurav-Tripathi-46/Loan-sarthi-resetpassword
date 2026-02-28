// api/config.js
export default function handler(req, res) {
    console.log('🔍 API called at:', new Date().toISOString());
    console.log('🔍 Environment check:', {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
    });
    
    // Log partial values for debugging (never log full keys!)
    if (process.env.SUPABASE_URL) {
        console.log('🔍 URL starts with:', process.env.SUPABASE_URL.substring(0, 20) + '...');
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        SUPABASE_URL: process.env.SUPABASE_URL || null,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || null,
        debug: {
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV
        }
    });
}