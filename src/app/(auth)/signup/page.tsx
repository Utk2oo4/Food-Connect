'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/lib/types';

import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [role, setRole] = useState<UserRole | ''>('');
    const [loading, setLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!role) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please select a role.',
            });
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Save user details to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                role,
                city,
                status: 'pending',
                createdAt: new Date()
            });

            toast({
                title: 'Signup Successful',
                description: 'Your account has been created!',
            });

            setIsSignedUp(true);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Signup Failed',
                description: error.message || 'An error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    if (isSignedUp) {
        return (
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Registration Complete!</CardTitle>
                    <CardDescription>Your account has been created.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        You can now log in to your account.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/login">
                        <Button>Back to Login</Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-lg">
            <form onSubmit={handleSubmit}>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
                    <CardDescription>Join our network to fight food waste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Organization Name</Label>
                        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. New York" disabled={loading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">I am a...</Label>
                        <Select onValueChange={(value) => setRole(value as UserRole)} required value={role} disabled={loading}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select your organization type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="restaurant">Restaurant</SelectItem>
                                <SelectItem value="ngo">NGO / Charity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign Up
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
