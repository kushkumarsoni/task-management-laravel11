import { useState,useEffect } from 'react';
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextareaInput from "@/Components/TextareaInput";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link ,useForm} from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';

export default function Index({ auth }) {
  const {data, setData, post, errors , reset, processing} = useForm({
    name:"",
    description:"",
    due_date:"",
    status:"",
    image:""
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('project.store'));
  }

  return (
    <Authenticated
      user={auth.user}
      header={
        <div className='flex justify-between items-center'>
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Project</h2>
          <Link href={route("project.index")} className="bg-emerald-500 py-1 px-3 text-white
          rounded shadow transition-all hover:bg-emerald-300">Back</Link>
        </div>
      }
    >
      <Head title="Create User" />
      <div className="py-5">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-9">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className='p-4 sm:p-8 bg-white
             dark:bg-gray-800 shadow sm:rounded-lg' enctype ="multipart/form-data">
               <div className='grid grid-cols-2 gap-4'>
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
                    <InputLabel htmlFor="due_date" value="Due Date" />
                    <TextInput type="date" id="due_date" name="due_date"
                    onChange={(e) => setData("due_date",e.target.value)} value={data?.due_date}
                    className="mt-1 block w-full"
                    isFocused={true}
                    placeholder="Enter your due date" />
                    <InputError message={errors.due_date} className='mt-2' />
                  </div>

                  <div className='mt-4'>
                    <InputLabel htmlFor="status" value="Status" />
                    <SelectInput
                        onChange={(e) => setData("status",e.target.value)} defaultValue={data?.status}
                        className="mt-1 block w-full"
                        isFocused={true}
                        placeholder="Enter password">
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed status</option>
                    </SelectInput>
                    <InputError message={errors.status} className='mt-2' />
                  </div>
                  <div className='mt-4'>
                    <InputLabel htmlFor="image" value="Image" />
                    <TextInput type="file" id="image" name="image"
                      className="mt-1 block w-full"
                      onChange={(e) => setData("image",e.target.files[0])}
                      isFocused={true} />
                    <InputError message={errors.image} className='mt-2' />
                  </div>
               </div>

                <div className='mt-4'>
                  <InputLabel htmlFor="description" value="Description" />
                  <TextareaInput id="description" name="description"
                    onChange={(e) => setData("description",e.target.value)}
                    className="mt-1 block w-full"
                    isFocused={true}
                    placeholder="Enter description..">{data?.description}</TextareaInput>
                  <InputError message={errors.description} className='mt-2' />
                </div>

                <div className="flex items-center gap-4 my-3">
                  <Link href={route('project.index')}
                  className="bg-emerald-500 py-1 px-3 text-white
                  rounded">Cancel</Link>
                  <PrimaryButton disabled={processing}>Save</PrimaryButton>
                </div>
            </form>
          </div>
        </div>
      </div>
      </Authenticated>
  )
}
