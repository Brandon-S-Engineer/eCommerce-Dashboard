'use client';

import * as z from 'zod'; // import { z } from 'zod'; // Zod for schema validation
import axios from 'axios';
import { useState } from 'react';
import { Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/ui/heading'; // Component for titles
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';

// Store type is generated by Prisma from the Store model in schema.prisma.
interface SettingsFormProps {
  initialData: Store;
}

//? (1/4) Schema definition for form validation using Zod
const formSchema = z.object({
  // Validation: String, 3-25 characters, non-empty
  name: z.string().min(3, { message: 'Store name is required, (min 3 characters).' }).max(25),
});

//? (2/4) Type inference for the values from the schema created with Zod
type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams(); // Hook to access URL parameters (id)
  const router = useRouter(); // Hook to manage navigation and refreshing

  const [open, setOpen] = useState(false); // Modal State
  const [loading, setLoading] = useState(false);

  //? (3/4) Setup form validation with useForm
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema), // Use zodResolver for form validation from schema
    defaultValues: initialData, // Initalize form with provided prop (store name)
  });

  /* -------------------- Submit handler for form submition ------------------- */
  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      /* ------------------------------ Update Store ------------------------------ */
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh(); // Refresh the page after success
      toast.success('Store Updated Successfully.');
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }

    console.log(data);
  };

  /* --------------------- Handler for deleting the store --------------------- */
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`); // Delete store via API
      router.refresh(); // Refresh
      router.push('/'); // Redirect
      toast.success('Store deleted successfully'); // Success notification
    } catch (error) {
      toast.error('Make sure you deleted all products and categories first');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)} // Close modal handler
        onConfirm={onDelete} // Delete Handler
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading
          title='Settings'
          description='Manage store preferences'
        />

        <Button
          disabled={loading}
          variant='destructive'
          size='icon'
          onClick={() => setOpen(true)}>
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator /> {/* UI separator */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} //? (4/4)
          className='space-y-8 w-full'>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name' // Field name for validation, <Input />
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Store Name'
                      {...field} // Spread field props (onChange, onBlur...)
                    />
                  </FormControl>
                  <FormMessage /> {/* Validation Message Display */}
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            className='ml-auto'
            type='submit'>
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description='test description'
        variant='public'
      />
    </>
  );
};
