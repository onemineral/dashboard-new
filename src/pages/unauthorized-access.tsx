'use client'

import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { AlertOctagon } from "lucide-react"

function UnauthorizedAccess() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <AlertOctagon className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Unauthorized Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        Sorry, you don't have permission to access this page. Please log out and sign in with an account that has the necessary permissions.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="default" asChild={true}>
                        <a href={'/auth/logout'}>Log Out</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export { UnauthorizedAccess }