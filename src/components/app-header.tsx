'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User as UserIcon, LogOut, UtensilsCrossed, Building, HandHeart } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
    const { user, logout } = useAuth();

    const getRoleIcon = () => {
    if(!user) return null;
    switch(user.role) {
        case 'admin': return <UserIcon className="w-4 h-4 mr-2" />;
        case 'restaurant': return <Building className="w-4 h-4 mr-2" />;
        case 'ngo': return <HandHeart className="w-4 h-4 mr-2" />;
        default: return null;
    }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">FoodConnect</span>
            </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
            {user && (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-auto justify-start px-4">
                    <div className="flex items-center">
                        {getRoleIcon()}
                        <span>{user.name}</span>
                    </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            )}
        </div>
        </div>
    </header>
    );
}
