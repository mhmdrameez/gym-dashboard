
import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import { cookies } from 'next/headers'


export const metadata = {
  title: "Dashboard", 
  description: "GYM Dashboard",
};

interface User {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  gym_name: string;
}

interface Access {
  'x-access-token': string;
  'refresh-token': string;
  token_expiry: string;
}

interface ThemeData {
  success: boolean;
  data: {
    message: string;
    user: User;
    access: Access;
  };
}


export default async function Page() {
  const cookieStore = await cookies()

  const theme = cookieStore.get('token')

const themeValue = theme ? theme.value : 'No theme' 


  let parsedData: ThemeData = {} as ThemeData; 
  try {
    parsedData = JSON.parse(themeValue);
  } catch (error) {
    console.error('Failed to parse themeValue:', error);
  }

  const { success, data } = parsedData;
  const { message, user, access } = data || {};

  const gymName = user ? user.gym_name : 'N/A';


  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Welcome to {gymName}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
