'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, HandHeart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FoodPost } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';

export default function NgoPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<FoodPost[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ngo')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'foodPosts'), where('city', '==', user.city));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expiryTime: doc.data().expiryTime.toDate(),
      })) as FoodPost[];
      setPosts(data);
    });

    return () => unsub();
  }, [user]);

  const availablePosts = useMemo(() => posts.filter(p => p.status === 'Available'), [posts]);
  const myClaims = useMemo(() => posts.filter(p => p.claimedByNgoId === user?.uid), [posts, user]);

  const handleClaim = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'foodPosts', postId), {
        status: 'Claimed',
        claimedByNgoId: user?.uid,
      });
      toast({ title: 'Claimed!', description: 'You claimed the food.' });
    } catch {
      toast({ title: 'Error', description: 'Claim failed.', variant: 'destructive' });
    }
  };

  if (authLoading || !user) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold font-headline mb-6">NGO Dashboard</h1>
        <Tabs defaultValue="available">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="claims">My Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {availablePosts.map(post => (
              <Card key={post.id} className="mb-4 p-4">
                <p className="font-bold text-lg">{post.itemName}</p>
                <p>Qty: {post.quantity}</p>
                <p>Pickup: {post.pickupTime}</p>
                <p>Expires in {formatDistanceToNow(post.expiryTime, { addSuffix: true })}</p>
                <Button onClick={() => handleClaim(post.id)} className="mt-2"><HandHeart className="mr-2 h-4 w-4" />Claim</Button>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="claims">
            {myClaims.map(post => (
              <Card key={post.id} className="mb-4 p-4">
                <p className="font-bold text-lg">{post.itemName}</p>
                <p>Status: {post.status}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
