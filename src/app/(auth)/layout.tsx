import { ReactNode } from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold font-headline text-primary">FoodConnect</h1>
            <p className="text-muted-foreground">Connecting surplus food with those in need.</p>
        </div>
        {children}
    </div>
    </div>
);
}
