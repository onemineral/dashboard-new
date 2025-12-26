"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "../link"
import {useMatchPath} from "@/hooks/use-match-path.ts";
import {cn} from "@/lib/utils.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {FormattedMessage} from "react-intl";

export function MainNavigationMenu({className}: {className?: string}) {
  const match = useMatchPath();

  return (
    <NavigationMenu viewport={false} className={cn(className, 'grow justify-start max-w-dvw w-full overflow-x-scroll pb-2')}>
      <NavigationMenuList className="items-center flex px-2">
          <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn({
                  '!bg-primary/5 !rounded-sm': match('/')
              })}>
                  <Link to="/" className={'flex flex-row items-center'}>
                      <span><FormattedMessage defaultMessage="Home" description="Navigation menu item for the homepage (reports dashboard)" /></span>
                  </Link>
              </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn({
                  '!bg-primary/5 !rounded-sm': match('/pms/multi-calendar')
              })}>
                  <Link to="/pms/multi-calendar" className={'flex flex-row items-center'}>
                      <span><FormattedMessage defaultMessage="Calendar" description="Navigation menu item for the calendar page" /></span>
                  </Link>
              </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink asChild>
                  <Link to="/docs" className={'flex flex-row items-center'}>
                      <span><FormattedMessage defaultMessage="Messaging" description="Navigation menu item for the messaging inbox page" /></span>
                      <Badge variant={'destructive'} className={'py-0.5 px-1'}>12</Badge>
                  </Link>
              </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn({
                  '!bg-primary/5 !rounded-sm': match('/pms/*') && !match('/pms/multi-calendar')
              })}>
                  <Link to="/pms/properties" className={'flex flex-row items-center text-nowrap'}>
                      <span><FormattedMessage defaultMessage="Properties" description="Navigation menu item for the properties page" /></span>
                  </Link>
              </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink asChild>
                  <Link to="/docs" className={'flex flex-row items-center'}>
                      <FormattedMessage defaultMessage="Bookings" description="Navigation menu item for the bookings page" />
                  </Link>
              </NavigationMenuLink>
          </NavigationMenuItem>
        <NavigationMenuItem>
            <NavigationMenuLink asChild>
                <Link to="/docs" className={'flex flex-row items-center text-nowrap'}>
                    <FormattedMessage defaultMessage="My Website" description="Navigation menu item for the website management page" />
                </Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink asChild>
                  <Link to="/docs" className={'flex flex-row items-center'}>
                      <span><FormattedMessage defaultMessage="Integrations" description="Navigation menu item for the app integrations page" /></span>
                  </Link>
              </NavigationMenuLink>
          </NavigationMenuItem>

        <li className={'grow'}>&nbsp;</li>
        
      </NavigationMenuList>
    </NavigationMenu>
  )
}