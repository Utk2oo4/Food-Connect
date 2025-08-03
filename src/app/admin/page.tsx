'use client';

import { doc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/app-header';
import { Loader2, Users, Wheat, HandHeart, Check, X, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User, FoodPost } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { db } from '@/lib/firebase';

const chartConfig = {
  restaurants: {
    label: 'Restaurants',
    color: 'hsl(var(--primary))',
  },
  ngos: {
    label: 'NGOs',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [foodPosts, setFoodPosts] = useState<FoodPost[]>([]);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'admin') {
        router.push('/login');
      }
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), snapshot => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
      setUsers(fetched);
    });

    const unsubFood = onSnapshot(collection(db, 'foodPosts'), snapshot => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expiryTime: doc.data().expiryTime?.toDate?.() || new Date(),
      })) as FoodPost[];
      setFoodPosts(fetched);
    });

    return () => {
      unsubUsers();
      unsubFood();
    };
  }, []);

  const handleUpdateStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'users', userId), { status });
      toast({ title: 'User Updated', description: `User status set to ${status}.` });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: (error as Error).message || 'Something went wrong.',
      });
    }
  };

  const stats = useMemo(() => ({
    totalRestaurants: users.filter(u => u.role === 'restaurant' && u.status === 'approved').length,
    totalNgos: users.filter(u => u.role === 'ngo' && u.status === 'approved').length,
    foodPosted: foodPosts.length,
    foodClaimed: foodPosts.filter(p => p.status === 'Claimed' || p.status === 'Picked up').length,
  }), [users, foodPosts]);

  const cityData = useMemo(() => {
    const cityCounts: { [key: string]: { restaurants: number; ngos: number } } = {};
    users.forEach(u => {
      if (u.status !== 'approved') return;
      if (!cityCounts[u.city]) {
        cityCounts[u.city] = { restaurants: 0, ngos: 0 };
      }
      if (u.role === 'restaurant') cityCounts[u.city].restaurants++;
      if (u.role === 'ngo') cityCounts[u.city].ngos++;
    });
    return Object.entries(cityCounts).map(([city, counts]) => ({ city, ...counts }));
  }, [users]);

  if (authLoading || !user || !user.status) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight mb-6">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[{
            label: "Total Restaurants",
            value: stats.totalRestaurants,
            icon: <Users className="h-4 w-4 text-muted-foreground" />
          }, {
            label: "Total NGOs",
            value: stats.totalNgos,
            icon: <HandHeart className="h-4 w-4 text-muted-foreground" />
          }, {
            label: "Food Items Posted",
            value: stats.foodPosted,
            icon: <Wheat className="h-4 w-4 text-muted-foreground" />
          }, {
            label: "Food Items Claimed",
            value: stats.foodClaimed,
            icon: <Check className="h-4 w-4 text-muted-foreground" />
          }].map(({ label, value, icon }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                {icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="font-headline">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter(u => u.role !== 'admin').map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.city || '-'}</TableCell>
                      <TableCell className="capitalize">{u.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={u.status === 'approved' ? 'default' : u.status === 'pending' ? 'secondary' : 'destructive'}
                          className="capitalize"
                        >
                          {u.status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {u.status?.toLowerCase() !== 'approved' && (
                          <div className="space-x-2">
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleUpdateStatus(u.id, 'approved')}>
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleUpdateStatus(u.id, 'rejected')}>
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                City Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="city" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="restaurants" fill="var(--color-restaurants)" radius={4} />
                    <Bar dataKey="ngos" fill="var(--color-ngos)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
