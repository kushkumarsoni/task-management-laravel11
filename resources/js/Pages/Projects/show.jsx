import { useState,useEffect } from 'react';
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import { PROJECT_STATUS_TEXT_MAP, PROJECT_STATUS_CLASS_MAP } from "@/constants";
import { TASK_STATUS_TEXT_MAP, TASK_STATUS_CLASS_MAP } from "@/constants";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link ,router} from '@inertiajs/react';
import TableHeading from '@/Components/TableHeading';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';

export default function Index({ auth, project, tasks, queryParams = null, message = null}) {

  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
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
    router.get(route('project.show',project.data.id),queryParams);
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

    router.get(route('project.show',project.data.id),queryParams);
  }

  const confirmDeletion = (e,project) => {
    setProjectToDelete(project); // Set the project to delete
    setConfirmingUserDeletion(true);
  };

    const closeModal = () => {
      setConfirmingUserDeletion(false);
    };

    const handleDelete = (e) => {
      e.preventDefault();
      if (projectToDelete) {
          destroy(route('project.destroy', projectToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
              closeModal();
              setProjectToDelete(null);
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
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Project  "{project.data.name} "</h2>
          <Link href={route("project.index")} className="bg-emerald-500 py-1 px-3 text-white
          rounded shadow transition-all hover:bg-emerald-100">Back</Link>
      </div>
    }
    >
      <Head title={ project.data.name } />

      <div className="py-6 px-4">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-9">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600">Name:</label>
                  <p className="text-gray-800 font-medium">{project?.data?.name}</p>
                </div>
                <div>
                  <label className="text-gray-600">Due Date:</label>
                  <p className="text-gray-800 font-medium">{project?.data?.due_date}</p>
                </div>
                <div>
                  <label className="text-gray-600">Description:</label>
                  <p className="text-gray-800 font-medium">{project?.data?.description}</p>
                </div>
                <div>
                  <label className="text-gray-600">Status:</label>
                  <p className="text-gray-800 font-medium">{PROJECT_STATUS_TEXT_MAP[project?.data?.status]}</p>
                </div>
                <div>
                  <label className="text-gray-600">Created By:</label>
                  <p className="text-gray-800 font-medium">{project?.data?.createdBy?.name}</p>
                </div>
                <div>
                  <label className="text-gray-600">Updated By:</label>
                  <p className="text-gray-800 font-medium">{project?.data?.updatedBy?.name}</p>
                </div>
                <div>
                  <label className="text-gray-600">Image:</label>
                  <img src={project?.data?.image_path} alt="Task Image" className="max-w-48 w-full max-h-48 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-9">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-4 py-6 text-gray-900">
              <h2 className="text-2xl font-semibold mb-2">All Tasks</h2>
              <div className='overflow-auto'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tasks.data.length > 0 ? (
                      tasks.data.map(task => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                          <th className="px-3 py-3">{task?.id}</th>
                          <th className="px-3 py-3"><img src={task?.image_path} className="h-10 w-10" /></th>
                          <th className="px-3 py-3">{task?.name}</th>
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
              Are you sure you want to delete this project?
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
