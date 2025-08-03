import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, XCircle } from "lucide-react";
import { UserStatus } from "@/lib/types";

interface StatusViewProps {
    status: UserStatus;
}

export function StatusView({ status }: StatusViewProps) {
        if (status === 'pending') {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Clock className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl font-headline">Account Pending Approval</CardTitle>
                </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    our account is currently under review by our administrators. You will be notified once it has been approved. Thank you for your patience.
                </p>
            </CardContent>
            </Card>
            </div>
        );
    }
    
    if (status === 'rejected') {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-md text-center shadow-lg border-destructive">
                <CardHeader>
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                    <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="mt-4 text-2xl font-headline">Account Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    We're sorry, but your account registration was not approved at this time. If you believe this is an error, please contact support.
                </p>
                </CardContent>
            </Card>
            </div>
        );
    }
    
    return null;
}
