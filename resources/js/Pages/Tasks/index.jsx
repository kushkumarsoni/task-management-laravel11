import { useState,useEffect } from 'react';
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import { TASK_STATUS_TEXT_MAP, TASK_STATUS_CLASS_MAP } from "@/constants";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link , router } from '@inertiajs/react';
import TableHeading from '@/Components/TableHeading';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';

export default function Index({ auth, tasks, queryParams = null, message = null }) {

  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  queryParams = queryParams || {}

  const {delete: destroy,processing,reset,errors} = useForm({});

  useEffect(() => {
    if (message && message != null) {
      alert(message);
    }
}, [message]);


  const searchFieldChanged = (name,value) => {

    if(value) {
      queryParams[name] = value;
    }else{
      delete queryParams[name];
    }
    router.get(route('task.index'),queryParams);
  }

  const onKeyPress = (name,e) => {
    if(e.key != 'Enter') return;
    searchFieldChanged(name,e.target.value);
  }

  const sortField = (name) => {
    if(name === queryParams.sort_field) {
      if(queryParams.sort_direction === 'asc') {
        queryParams.sort_direction = 'desc';
      }else{
        queryParams.sort_direction = 'asc';
      }
    }else{
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }

    router.get(route('task.index'),queryParams);
  }

  const confirmDeletion = (e,task) => {
    setTaskToDelete(task); // Set the task to delete
    setConfirmingUserDeletion(true);
  };

    const closeModal = () => {
      setConfirmingUserDeletion(false);
    };

    const handleDelete = (e) => {
      e.preventDefault();
      if (taskToDelete) {
          destroy(route('task.destroy', taskToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
              closeModal();
              setTaskToDelete(null);
            },
            onError: (errors) => {
              console.error(errors);
            }
        });
      }
    };

  return (
    <Authenticated
      user={auth.user}
      header={
        <div className='flex justify-between items-center'>
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">All Tasks</h2>
          <Link href={route("task.create")} className="bg-emerald-500 py-1 px-3 text-white
          rounded shadow transition-all hover:bg-emerald-100">Add New</Link>
      </div>
    }
    >
      <Head title="Projects" />

      <div className="py-5">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-9">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className='overflow-auto'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700
                  dark:text-gray-400 border-b-2 border-gray-200">
                    <tr className="text-nowrap">
                      <th className="px-3 py-2" colSpan="3">
                        <TextInput type="text"
                          placeholder="Search here.."
                          className="w-full"
                          defaultValue={queryParams.name}
                          onKeyPress = {(e) => onKeyPress("name",e)}
                          onBlur={(e) => searchFieldChanged('name',e.target.value)}  />
                      </th>
                      <th className="px-3 py-2" colSpan="2">
                        <SelectInput name="status"
                          defaultValue={queryParams.status}
                          onChange={(e) => searchFieldChanged('status',e.target.value)}
                          className="text-nowrap bg-gray-50 border
                          border-gray-300 text-gray-900 text-sm rounded-lg
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="">Select status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In progress</option>
                            <option value="completed">Completed status</option>
                        </SelectInput>
                      </th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700
                  dark:text-gray-400 border-b-2 border-gray-200">
                    <tr className="text-nowrap">
                      <TableHeading name={"id"} sortable={true} sortField={sortField}>
                        ID
                      </TableHeading>
                      <th className="px-3 py-2">Image</th>
                      <TableHeading name={"name"} sortable={true} sortField={sortField}>
                        Name
                      </TableHeading>
                      <TableHeading name={"status"} sortable={true} sortField={sortField}>
                        Status
                      </TableHeading>
                      <TableHeading name={"created_at"} sortable={true} sortField={sortField}>
                        Create Date
                      </TableHeading>
                      <TableHeading name={"due_date"} sortable={true} sortField={sortField}>
                        Due Date
                      </TableHeading>
                      <th className="px-3 py-2">Created By</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tasks.data.length > 0 ? (
                      tasks.data.map(task => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                          <th className="px-3 py-3">{task?.id}</th>
                          <th className="px-3 py-3"><img src={task?.image_path} className="h-10 w-10" /></th>
                          <th className="px-3 py-3"><Link className='hover:underline' href={route('task.show',task)}>{task?.name}</Link></th>
                          <th className="px-3 py-3">
                            <span className={"px-2 py-1 rounded text-white " + TASK_STATUS_CLASS_MAP[task?.status]}>
                              {TASK_STATUS_TEXT_MAP[task?.status]}
                            </span>
                          </th>
                          <th className="px-3 py-3 text-nowrap">{task?.created_at}</th>
                          <th className="px-3 py-3 text-nowrap">{task?.due_date}</th>
                          <th className="px-3 py-3">{task?.createdBy?.name}</th>
                          <th className="px-3 py-3">
                            <Link href={route('task.edit', task.id)}
                              className="font-medium text-blue-600
                            dark:text-blue-500 hover:underline mx-1">Edit</Link>
                            <button
                              onClick={(e)=> confirmDeletion(e,task)}
                              className="font-medium text-red-600
                            dark:text-red-500 hover:underline mx-1">Delete</button>
                          </th>
                        </tr>
                      ))
                      ) : (<tr>
                          <td colSpan="8">
                            <h5 className='text-center my-4 text-lg'>Record Not Found!!</h5>
                          </td>
                        </tr>)
                    }
                  </tbody>
                </table>
              </div>
              <Pagination links={tasks.meta.links} />
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">
              Are you sure you want to delete this task?
          </h2>
          <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <DangerButton className="ms-3" onClick={handleDelete} disabled={processing}>
                  {processing ? 'Deleting...' : 'Confirm Delete'}
              </DangerButton>
          </div>
        </div>
      </Modal>
    </Authenticated>
  )
}
