import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const login = useStore((state) => state.login);
  const { toast } = useToast();
  
  const [contact, setContact] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    
    if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
      toast({
        variant: "destructive",
        title: "Invalid Contact",
        description: "Please enter a valid email or phone number.",
      });
      return;
    }

    if (username.length < 1) {
      toast({
        variant: "destructive",
        title: "Invalid Username",
        description: "Username must be at least 1 characters.",
      });
      return;
    }
    
    if (username.length > 7) {
      toast({
        variant: "destructive",
        title: "Invalid Username",
        description: "Username cant be more than 7 characters.",
      });
      return;
    }

    login(username, contact);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50/50">
      <Card className="w-full max-w-sm shadow-xl border-border/50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-serif text-primary">Welcome Back</CardTitle>
          <CardDescription>Enter your details to access the competition</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contact">Email or Phone</Label>
              <Input 
                id="contact" 
                placeholder="user@example.com" 
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="h-12 bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="HistoricPhotog" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 bg-background"
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-lg font-medium mt-4">
              Enter Competition
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
