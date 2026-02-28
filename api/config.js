// api/config.js
export default function handler(req, res) {
    // Get timestamp for logging
    const timestamp = new Date().toISOString();
    
    // ============================================
    // LOG EVERYTHING for debugging
    // ============================================
    
    // 1. Log all environment variable names (safe)
    const allEnvVars = Object.keys(process.env).sort();
    console.log(`[${timestamp}] 🔍 All environment variables (${allEnvVars.length} total):`);
    console.log(allEnvVars);
    
    // 2. Look specifically for Supabase-related vars
    const supabaseVars = allEnvVars.filter(key => 
        key.toLowerCase().includes('supabase') || 
        key.includes('SUPABASE')
    );
    console.log(`[${timestamp}] 🔍 Supabase-related vars found:`, supabaseVars);
    
    // 3. Check exact variable names we need
    const exactUrl = process.env.SUPABASE_URL;
    const exactKey = process.env.SUPABASE_ANON_KEY;
    
    console.log(`[${timestamp}] 🔍 Exact SUPABASE_URL:`, {
        exists: !!exactUrl,
        type: typeof exactUrl,
        length: exactUrl ? exactUrl.length : 0,
        preview: exactUrl ? exactUrl.substring(0, 20) + '...' : null
    });
    
    console.log(`[${timestamp}] 🔍 Exact SUPABASE_ANON_KEY:`, {
        exists: !!exactKey,
        type: typeof exactKey,
        length: exactKey ? exactKey.length : 0,
        preview: exactKey ? exactKey.substring(0, 20) + '...' : null
    });
    
    // 4. Check case variations (in case of case sensitivity issues)
    const variations = {
        SUPABASE_URL: process.env.SUPABASE_URL,
        supabase_url: process.env.supabase_url,
        SupabaseUrl: process.env.SupabaseUrl,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        supabase_anon_key: process.env.supabase_anon_key,
        SupabaseAnonKey: process.env.SupabaseAnonKey
    };
    
    console.log(`[${timestamp}] 🔍 Case variations:`, 
        Object.fromEntries(
            Object.entries(variations).map(([k, v]) => [k, !!v])
        )
    );
    
    // 5. Check Vercel-specific environment variables
    console.log(`[${timestamp}] 🔍 Vercel env:`, {
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
        VERCEL_REGION: process.env.VERCEL_REGION,
        NODE_ENV: process.env.NODE_ENV
    });
    
    // 6. Check if we're running in a serverless function
    console.log(`[${timestamp}] 🔍 Function info:`, {
        awsRegion: process.env.AWS_REGION,
        lambdaTaskRoot: process.env.LAMBDA_TASK_ROOT,
        runtime: process.env.AWS_EXECUTION_ENV
    });
    
    // 7. Check request headers (might contain useful info)
    console.log(`[${timestamp}] 🔍 Request headers:`, {
        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer,
        'user-agent': req.headers['user-agent']?.substring(0, 50)
    });
    
    // ============================================
    // RETURN RESPONSE with debug info
    // ============================================
    
    // Get the values we want to return
    const url = process.env.SUPABASE_URL || null;
    const key = process.env.SUPABASE_ANON_KEY || null;
    
    // Set headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('X-Debug-Timestamp', timestamp);
    
    // Return comprehensive response
    res.status(200).json({
        // The actual values we need
        SUPABASE_URL: url,
        SUPABASE_ANON_KEY: key,
        
        // Debug information
        debug: {
            timestamp,
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV,
            vercelUrl: process.env.VERCEL_URL,
            
            // What we found
            envVarsFound: {
                total: allEnvVars.length,
                supabaseRelated: supabaseVars,
                hasExactUrl: !!exactUrl,
                hasExactKey: !!exactKey
            },
            
            // Case sensitivity check
            caseSensitivity: {
                uppercase: {
                    url: !!process.env.SUPABASE_URL,
                    key: !!process.env.SUPABASE_ANON_KEY
                },
                lowercase: {
                    url: !!process.env.supabase_url,
                    key: !!process.env.supabase_anon_key
                },
                mixed: {
                    url: !!process.env.SupabaseUrl,
                    key: !!process.env.SupabaseAnonKey
                }
            },
            
            // System info
            system: {
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version
            }
        }
    });
}