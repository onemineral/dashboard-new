import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card.tsx"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx"
import {CheckCircle, AlertCircle} from "lucide-react"

function ReactivateSubscription() {
    const features = [
        "Comprehensive property management tools",
        "Automated rent collection and tracking",
        "Maintenance request system",
        "Financial reporting and analytics",
        "Tenant screening and application process",
        "Document storage and e-signing"
    ]

    // @todo: fetch the pricing tiers from the server
    // @todo: fetch the number of properties from the server
    // @todo: get the currency from the server

    const pricingTiers = [
        {min: 1, max: 5, price: 29.99},
        {min: 6, max: 15, price: 24.99},
        {min: 16, max: 30, price: 19.99},
        {min: 31, max: Infinity, price: 14.99}
    ]

    const numberOfProperties = 10

    const calculateTotalPrice = (properties: number) => {
        let totalPrice = 0;
        let remainingProperties = properties;

        for (const tier of pricingTiers) {
            if (remainingProperties <= 0) break;

            const propertiesInTier = Math.min(remainingProperties, tier.max - tier.min + 1);
            totalPrice += propertiesInTier * tier.price;
            remainingProperties -= propertiesInTier;
        }

        return totalPrice.toFixed(2);
    };

    const totalMonthlyPrice = calculateTotalPrice(numberOfProperties)

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Subscription Canceled</CardTitle>
                    <CardDescription className="text-center text-base sm:text-lg">
                        <AlertCircle className="inline-block text-yellow-500 mr-2"/>
                        Your subscription has been canceled. Reactivate to regain access to our premium features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 sm:space-y-8">
                    <div className="rounded-lg p-4 sm:p-6 bg-card text-card-foreground">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Platform Features</h3>
                        <ul className="grid grid-cols-1 gap-3 sm:gap-4">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <CheckCircle className="text-primary shrink-0 w-5 h-5"/>
                                    <span className="text-sm sm:text-base">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-lg p-4 sm:p-6 bg-card text-card-foreground overflow-x-auto">
                        <h4 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Tiered Pricing Structure</h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-left">Properties</TableHead>
                                    <TableHead className="text-right">Price per Property</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pricingTiers.map((tier, index) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            className="font-medium">{tier.max < Infinity ? `${tier.min} - ${tier.max}` : `${tier.min}+`}</TableCell>
                                        <TableCell className="text-right">${tier.price.toFixed(2)}/month</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="rounded-lg p-4 sm:p-6 bg-primary text-primary-foreground">
                        <h4 className="text-xl sm:text-2xl font-semibold mb-3">Your Subscription</h4>
                        <div className="space-y-2 mb-4">
                            {pricingTiers.map((tier, index) => {
                                const propertiesInTier = Math.min(Math.max(numberOfProperties - tier.min + 1, 0), tier.max - tier.min + 1);
                                if (propertiesInTier > 0) {
                                    return (
                                        <div key={index} className="flex justify-between items-center">
                                            <span>{tier.min} - {tier.max < Infinity ? tier.max : tier.min + '+'} properties:</span>
                                            <span>{propertiesInTier} x ${tier.price.toFixed(2)}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        <div className="border-t border-primary-foreground/20 pt-4 mt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <span
                                    className="text-base sm:text-lg font-medium mb-2 sm:mb-0">Total monthly cost:</span>
                                <span className="text-2xl sm:text-3xl font-bold flex items-center">
                  ${totalMonthlyPrice}/month
                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground text-center">
                        Your subscription covers all {numberOfProperties} properties. The price per property is
                        determined by the tier your total number of properties falls into.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button size="lg" className="w-full sm:w-auto">
                        Reactivate Subscription
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export { ReactivateSubscription }