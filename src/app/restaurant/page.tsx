'use client';

import { addFoodPost } from '@/lib/firestore';


import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/app-header';
import { StatusView } from '@/components/status-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Clock, CheckCircle2, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import type { FoodPost } from '@/lib/types';

export default function RestaurantPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [posts, setPosts] = useState<FoodPost[]>([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'restaurant')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
  if (!user || !user.id) return;

  const q = query(
    collection(db, 'foodPosts'),
    where('restaurantId', '==', user.uid)
  );

  const unsubscribe = onSnapshot(q, snapshot => {
    const fetched = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      expiryTime: doc.data().expiryTime.toDate(),
    })) as FoodPost[];
    setPosts(fetched);
  });

  return () => unsubscribe();
}, [user?.id]);


  const handlePostFood = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  setSubmitting(true);

  try {
    const newPost = {
      itemName,
      quantity,
      expiryTime: new Date(expiryDate),
      pickupTime,
      status: 'Available',
      city: user.city,
      restaurantId: user.uid,
      claimedByNgoId: null,
    } as Omit<FoodPost, 'id'>;

    const createdPost = await addFoodPost(newPost); // 🔁 await here
    setPosts(prev => [...prev, createdPost]);

    toast({
      title: 'Food Posted!',
      description: `${itemName} has been successfully listed.`,
    });

    setFormOpen(false);
    setItemName('');
    setQuantity('');
    setExpiryDate('');
    setPickupTime('');
  } catch (error) {
    console.error('Failed to post food:', error); // ✅ See what the real error is
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Could not post food.',
    });
  } finally {
    setSubmitting(false);
  }
};


  const getStatusIcon = (status: FoodPost['status']) => {
    switch (status) {
      case 'Available': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Claimed': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'Picked up': return <Truck className="h-4 w-4 text-green-500" />;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user.status !== 'approved') {
    return (
      <>
        <AppHeader />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <StatusView status={user.status} />
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold font-headline tracking-tight">My Dashboard</h1>
          <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Post Food
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Post Surplus Food</DialogTitle>
                <DialogDescription>
                  Fill out the details below to list your surplus food for NGOs.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostFood}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="item-name" className="text-right">Item Name</Label>
                    <Input id="item-name" value={itemName} onChange={e => setItemName(e.target.value)} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">Quantity</Label>
                    <Input id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiry-time" className="text-right">Expiry Date</Label>
                    <Input id="expiry-time" type="datetime-local" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pickup-time" className="text-right">Pickup Times</Label>
                    <Input id="pickup-time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="col-span-3" required />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Food
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Food Postings</CardTitle>
            <CardDescription>A history of all the surplus food you've listed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Pickup Window</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length > 0 ? posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.itemName}</TableCell>
                    <TableCell>{post.quantity}</TableCell>
                    <TableCell>{format(post.expiryTime, 'PPp')}</TableCell>
                    <TableCell>{post.pickupTime}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit">
                        {getStatusIcon(post.status)}
                        <span className="ml-2">{post.status}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No posts yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
