'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

export const BillboardClient = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title='Billboards (0)'
          description='Billboards are the main way to advertise your products and services. You can create a billboard by clicking on the button.'
        />

        {/* Button to navigate to new Billboard creation page */}
        <Button onClick={() => router.push}>
          <Plus className='mr-4 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />
    </>
  );
};