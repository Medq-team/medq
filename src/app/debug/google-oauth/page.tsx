import { GoogleOAuthDebug } from '@/components/debug/GoogleOAuthDebug';

export default function GoogleOAuthDebugPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Google OAuth Debug</h1>
        <div className="grid gap-8">
          <GoogleOAuthDebug />
          
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Check if your Google Client ID is configured in environment variables</li>
              <li>Verify that Google Identity Services script is loading</li>
              <li>Test the Google sign-in flow</li>
              <li>Check browser console for any errors</li>
              <li>Ensure your domain is added to authorized origins in Google Cloud Console</li>
              <li>Verify OAuth consent screen is properly configured</li>
            </ol>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Environment Variables Check</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>GOOGLE_CLIENT_ID:</strong> {process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>NEXT_PUBLIC_GOOGLE_CLIENT_ID:</strong> {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>JWT_SECRET:</strong> {process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 