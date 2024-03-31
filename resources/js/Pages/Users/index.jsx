import { useState,useEffect } from 'react';
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link , router } from '@inertiajs/react';
import TableHeading from '@/Components/TableHeading';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';

export default function Index({ auth, users , queryParams = null, message = null  }) {

  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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
    router.get(route('user.index'),queryParams);
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

    router.get(route('user.index'),queryParams);
  }

  const confirmDeletion = (e,user) => {
    setUserToDelete(user); // Set the user to delete
    setConfirmingUserDeletion(true);
  };

    const closeModal = () => {
      setConfirmingUserDeletion(false);
    };

    const handleDelete = (e) => {
      e.preventDefault();
      if (userToDelete) {
          destroy(route('user.destroy', userToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
              closeModal();
              setUserToDelete(null);
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
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">All Users</h2>
          <Link href={route("user.create")} className="bg-emerald-500 py-1 px-3 text-white
          rounded shadow transition-all hover:bg-emerald-300">Add New</Link>
        </div>
      }
    >
      <Head title="Users" />
      <div className="py-5">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-9">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className='overflow-auto'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700
                  dark:text-gray-400 border-b-2 border-gray-200">
                    <tr className="text-nowrap">
                      <th className="px-3 py-2" colSpan="1">
                        <TextInput type="text"
                          placeholder="Search here.."
                          className="w-full"
                          defaultValue={queryParams.name}
                          onKeyPress = {(e) => onKeyPress("name",e)}
                          onBlur={(e) => searchFieldChanged('name',e.target.value)}  />
                      </th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700
                  dark:text-gray-400 border-b-2 border-gray-200">
                    <tr className="text-nowrap">
                      <TableHeading name={"id"} sortable={true} sortField={sortField}>
                        ID
                      </TableHeading>
                      <TableHeading name={"name"} sortable={true} sortField={sortField}>
                        Name
                      </TableHeading>
                      <TableHeading name={"email"} sortable={true} sortField={sortField}>
                        Email
                      </TableHeading>
                      <TableHeading name={"created_at"} sortable={true} sortField={sortField}>
                        Create Date
                      </TableHeading>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      users.data.length > 0 ? (
                      users.data.map(user => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                          <th className="px-3 py-3">{user?.id}</th>
                          <th className="px-3 py-3">{user?.name}</th>
                          <th className="px-3 py-3">{user?.email}</th>
                          <th className="px-3 py-3 text-nowrap">{user?.created_at}</th>
                          <th className="px-3 py-3">
                            <Link href={route('user.edit', user.id)}
                              className="font-medium text-blue-600
                            dark:text-blue-500 hover:underline mx-1">Edit</Link>
                            <button
                              onClick={(e)=> confirmDeletion(e,user)}
                              className="font-medium text-red-600
                            dark:text-red-500 hover:underline mx-1">Delete</button>
                          </th>
                        </tr>
                      ))
                      ) : (<tr>
                          <td colSpan="4">
                            <h5 className='text-center my-4 text-lg'>Record Not Found!!</h5>
                          </td>
                        </tr>)
                    }
                  </tbody>
                </table>
              </div>
              <Pagination links={users.meta.links} />
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">
              Are you sure you want to delete this user?
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
