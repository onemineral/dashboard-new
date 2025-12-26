import {
    Page, PageActions,
    PageContent,
    PageDescription,
    PageHeader, PageHeaderContainer,
    PageTitle
} from "@/components/application/page";
import {DemoVerticalBarChart} from "@/app/demo/charts/vertical-bar-chart.tsx";
import {DemoPieChart} from "@/app/demo/charts/pie-chart.tsx";
import {DemoHorizontalBarChart} from "@/app/demo/charts/horizontal-bar-chart.tsx";
import {DemoLineChart} from "@/app/demo/charts/line-chart.tsx";
import {DemoRadialChart} from "@/app/demo/charts/radial-chart.tsx";
import Link from "@/components/application/link.tsx";
import {PropertySelect} from "@/components/application/inputs/property-select.tsx";
import {useState} from "react";
import {AccountSelect} from "@/components/application/inputs/account-select.tsx";
import {DateRangePicker} from "@/components/application/inputs/daterange-picker.tsx";
import {Account, Property} from "@sdk/generated";

export default function Dashboard() {
    const [property, setProperty] = useState<Property|null>(null);
    const [account, setAccount] = useState<Account|null>(null);

    return (<Page size="lg">
        <PageHeaderContainer>
            <PageHeader>
                <PageTitle>Dashboard</PageTitle>
                <PageDescription>
                    Welcome to the dashboard. This is a demo page.
                </PageDescription>
            </PageHeader>
            <PageActions>
                <DateRangePicker enablePresets className={'w-full max-w-xs'} />
            </PageActions>
        </PageHeaderContainer>

        <PageContent className={'!px-0'}>
            <div className={'px-4 flex items-center space-x-4'}>
                <PropertySelect className={'w-auto max-w-64'} value={property} onChange={setProperty} />
                <AccountSelect className={'w-auto max-w-64'} value={account} onChange={setAccount} />
            </div>
            <div className={'mt-4 grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 gap-6 pb-4'}>
                <DemoVerticalBarChart/>
                <DemoPieChart/>
                <DemoHorizontalBarChart/>
                <DemoLineChart/>
                <DemoRadialChart/>

                <Link modal to={'/pms/properties'}>Open calendar</Link>
            </div>
        </PageContent>
    </Page>);
}