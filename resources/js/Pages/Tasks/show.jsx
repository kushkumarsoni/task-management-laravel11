import { TASK_STATUS_TEXT_MAP } from "@/constants";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, task }) {

  return (
    <Authenticated
      user={auth.user}
      header={
        <div className='flex justify-between items-center'>
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tasks "{task?.data?.name}"</h2>
          <Link href={route("task.index")} className="bg-emerald-500 py-1 px-3 text-white
          rounded shadow transition-all hover:bg-emerald-100">Back</Link>
        </div>
      }
    >
      <Head title={"Task ".task?.data?.name} />
      <div className="py-6 px-4">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-9">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-6 py-4">
              <h2 className="text-2xl font-semibold mb-2">Task Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600">Name:</label>
                  <p className="text-gray-800 font-medium">{task?.data?.name}</p>
                </div>
                <div>
                  <label className="text-gray-600">Due Date:</label>
                  <p className="text-gray-800 font-medium">{task?.data?.due_date}</p>
                </div>
                <div>
                  <label className="text-gray-600">Description:</label>
                  <p className="text-gray-800 font-medium">{task?.data?.description}</p>
                </div>
                <div>
                  <label className="text-gray-600">Status:</label>
                  <p className="text-gray-800 font-medium">{TASK_STATUS_TEXT_MAP[task?.data?.status]}</p>
                </div>
                <div>
                  <label className="text-gray-600">Created By:</label>
                  <p className="text-gray-800 font-medium">{task?.data?.createdBy?.name}</p>
                </div>
                <div>
                  <label className="text-gray-600">Updated By:</label>
                  <p className="text-gray-800 font-medium">{task?.data?.updatedBy?.name}</p>
                </div>
                <div>
                  <label className="text-gray-600">Image:</label>
                  <img src={task?.data?.image_path} alt="Task Image" className="max-w-48 w-full max-h-48 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}
