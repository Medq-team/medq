import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signUp } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function SignupHelper() {
  const [email, setEmail] = useState('belleghasousou2365@gmail.com');
  const [password, setPassword] = useState('Sousou2365');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const { user, error } = await signUp(email, password);
      
      if (error) {
        setError(
          typeof error === 'object' && error && 'message' in error
            ? (error.message as string)
            : 'An unexpected error occurred'
        );
      } else if (user) {
        setMessage('User created successfully! You can now sign in.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Create Demo User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          
          <Button 
            className="w-full" 
            onClick={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating user...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
