'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OctagonMinus } from "lucide-react"
import { Link } from "react-router-dom"

function NotFound() {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md mx-3">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <OctagonMinus className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Not found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        Sorry, the page you are looking for does not exist.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="default" asChild={true}>
                        <Link to={'/'}>Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export { NotFound }