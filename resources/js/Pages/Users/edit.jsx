import { useState,useEffect } from 'react';
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link ,useForm} from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth , user }) {
  const {data, setData, put, errors , reset, processing} = useForm({
    name:user?.name,
    email:user?.email,
    password:"",
    password_confirmation:"",
    method: 'post'
  });

  const onSubmit = (e) => {
    e.preventDefault();
    put(route('user.update',user));
  }

  return (
    <Authenticated
      user={auth.user}
      header={
        <div className='flex justify-between items-center'>
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit User</h2>
          <Link href={route("user.index")} className="bg-emerald-500 py-1 px-3 text-white
          rounded shadow transition-all hover:bg-emerald-300">Back</Link>
        </div>
      }
    >
      <Head title="Create User" />
      <div className="py-5">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-9">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className='p-4 sm:p-8 bg-white
             dark:bg-gray-800 shadow sm:rounded-lg grid grid-cols-2 gap-4'>
                <div className='mt-4'>
                  <InputLabel htmlFor="name" value="Name" />
                  <TextInput type="text" id="name" name="name"
                  onChange={(e) => setData("name",e.target.value)} value={data?.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  placeholder="Enter your name" />
                  <InputError message={errors.name} className='mt-2' />
                </div>

                <div className='mt-4'>
                  <InputLabel htmlFor="email" value="Email" />
                  <TextInput type="email" id="email" name="email"
                  onChange={(e) => setData("email",e.target.value)} value={data?.email}
                  className="mt-1 block w-full"
                  isFocused={true}
                  placeholder="Enter your email address" />
                  <InputError message={errors.email} className='mt-2' />
                </div>

                <div className='mt-4'>
                  <InputLabel htmlFor="passsword" value="Passsword" />
                  <TextInput type="password" id="passsword" name="password"
                  onChange={(e) => setData("password",e.target.value)} value={data?.password}
                  className="mt-1 block w-full"
                  isFocused={true}
                  placeholder="Enter password" />
                  <InputError message={errors.password} className='mt-2' />
                </div>
                <div className='mt-4'>
                  <InputLabel htmlFor="password_confirmation" value="Password Confirmation" />
                  <TextInput type="password" id="password_confirmation" name="password_confirmation"
                  onChange={(e) => setData("password_confirmation",e.target.value)} value={data?.password_confirmation}
                  className="mt-1 block w-full"
                  isFocused={true}
                  placeholder="Enter your name" />
                  <InputError message={errors.password_confirmation} className='mt-2' />
                </div>

                <div className="flex items-center gap-4 my-3">
                  <PrimaryButton disabled={processing}>Update</PrimaryButton>
                </div>
            </form>
          </div>
        </div>
      </div>
      </Authenticated>
  )
}
