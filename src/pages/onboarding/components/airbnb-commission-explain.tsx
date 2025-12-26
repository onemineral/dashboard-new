import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormattedMessage} from "react-intl";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {Equal, AlertTriangle} from "lucide-react";
import {useState} from "react";

export function AirbnbCommissionExplain({ children }: { children?: React.ReactNode }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
            <Button variant="link" className="h-auto p-0 text-primary font-medium inline">
                {children || (
                    <FormattedMessage
                        defaultMessage="How it works →"
                        description="Link to open commission structure explanation dialog"
                    />
                )}
            </Button>
        </DialogTrigger>
        <DialogContent size="lg">
            <DialogHeader>
                <DialogTitle>
                    <FormattedMessage
                        defaultMessage="Your earnings stay the same"
                        description="Dialog title for commission explanation"
                    />
                </DialogTitle>
                <DialogDescription>
                    <FormattedMessage
                        defaultMessage="Here's why adjusting your Airbnb prices doesn't change anything for you or your guests."
                        description="Dialog description"
                    />
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 text-sm">
                {/* The Key Insight - Before/After comparison */}
                <div className="space-y-4 mt-3">
                    <h4 className="font-semibold text-base">
                        <FormattedMessage
                            defaultMessage="Example: For a $100/night listing"
                            description="Example section title"
                        />
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* BEFORE - Current Airbnb */}
                        <Card className={'pb-0'}>
                            <CardContent className={'flex-1'}>
                                <Badge variant="outline">
                                    <FormattedMessage
                                        defaultMessage="Before"
                                        description="Before badge label"
                                    />
                                </Badge>
                                <div className="flex items-center justify-between my-3">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                                        <FormattedMessage
                                            defaultMessage="Split-fee commission"
                                            description="Airbnb split-fee commission structure label"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="Your listed price"
                                                description="Listed price label"
                                            />
                                        </span>
                                        <span>$100</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="+ Airbnb guest fee"
                                                description="Guest fee label"
                                            />
                                        </span>
                                        <span className="text-muted-foreground">$15</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="font-medium">
                                            <FormattedMessage
                                                defaultMessage="Guest pays total"
                                                description="Guest total label"
                                            />
                                        </span>
                                        <span className="font-semibold">$115</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>
                                            <FormattedMessage
                                                defaultMessage="− Your host fee (3%)"
                                                description="Host fee label"
                                            />
                                        </span>
                                        <span>$3</span>
                                    </div>

                                </div>
                            </CardContent>
                            <CardFooter className={'bg-accent rounded-b-xl py-3 flex justify-between'}>
                                        <span className="font-medium">
                                            <FormattedMessage
                                                defaultMessage="You receive"
                                                description="Amount received label"
                                            />
                                        </span>
                                    <span className="font-bold text-primary">$97</span>
                            </CardFooter>
                        </Card>

                        {/* AFTER - With PMS */}
                        <Card className={'pb-0'}>
                            <CardContent className={'flex-1'}>
                                <Badge variant="default">
                                    <FormattedMessage
                                        defaultMessage="After"
                                        description="After badge label"
                                    />
                                </Badge>
                                <div className="flex items-center justify-between my-3">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                                        <FormattedMessage
                                            defaultMessage="Host-only commission"
                                            description="Airbnb host-only commission structure label"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="Adjusted price"
                                                description="Adjusted price label"
                                            />
                                        </span>
                                        <span>$115</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="+ Airbnb guest fee"
                                                description="Guest fee label"
                                            />
                                        </span>
                                        <span className="text-muted-foreground">$0</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="font-medium">
                                            <FormattedMessage
                                                defaultMessage="Guest pays total"
                                                description="Guest total label"
                                            />
                                        </span>
                                        <span className="font-semibold">$115</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>
                                            <FormattedMessage
                                                defaultMessage="− Your host fee (15.5%)"
                                                description="Host fee label"
                                            />
                                        </span>
                                        <span>$18</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className={'bg-accent rounded-b-xl py-3 flex justify-between'}>
                                        <span className="font-medium">
                                            <FormattedMessage
                                                defaultMessage="You receive"
                                                description="Amount received label"
                                            />
                                        </span>
                                    <span className="font-bold text-primary">$97</span>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* The Result - Visual summary */}
                    <div className="space-y-3 py-2">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            <div className="text-right">
                                <div className="text-2xl font-bold">$115</div>
                                <div className="text-xs text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Guest pays (before)"
                                        description="Guest pays before summary"
                                    />
                                </div>
                            </div>
                            <Equal className="size-5 text-muted-foreground" />
                            <div className="text-left">
                                <div className="text-2xl font-bold">$115</div>
                                <div className="text-xs text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Guest pays (after)"
                                        description="Guest pays after summary"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">$97</div>
                                <div className="text-xs text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="You receive (before)"
                                        description="You receive before summary"
                                    />
                                </div>
                            </div>
                            <Equal className="size-5 text-muted-foreground" />
                            <div className="text-left">
                                <div className="text-2xl font-bold text-primary">$97</div>
                                <div className="text-xs text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="You receive (after)"
                                        description="You receive after summary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simple explanation */}
                <Alert variant="warning">
                    <AlertTriangle />
                    <AlertTitle>
                        <FormattedMessage
                            defaultMessage="Nothing changes, just where the fee appears"
                            description="Key takeaway title"
                        />
                    </AlertTitle>
                    <AlertDescription>
                        <FormattedMessage
                            defaultMessage="When connecting via API, Airbnb automatically switches your listings to their host-only commission structure (15.5% instead of 3%). We compensate by adjusting your prices, so guests pay the same amount and you receive the same payout."
                            description="Key takeaway explanation - clarifies Airbnb enforces this change"
                        />
                    </AlertDescription>
                </Alert>
            </div>
        </DialogContent>
    </Dialog>;
}