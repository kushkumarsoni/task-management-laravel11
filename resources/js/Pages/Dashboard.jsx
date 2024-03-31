import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head , Link } from '@inertiajs/react';
import { TASK_STATUS_TEXT_MAP, TASK_STATUS_CLASS_MAP } from "@/constants";

export default function Dashboard({ auth,
   totalPendingTasks,
   myPendingTasks,
   totalInprogressTasks,
   myInprogressTasks,
   totalCompletedTasks,
   myCompletedTasks,
   myTasks
   }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex gap-2 grid grid-cols-3">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                      <div className="p-6 text-gray-900">
                          <h3 className="text-amber-600 font-semibold text-2xl">Pending Tasks</h3>
                          <p className="text-xl mt-4">
                            <span className="mr-2">{myPendingTasks}</span>/
                            <span className="ml-2">{totalPendingTasks}</span>
                          </p>
                      </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                      <div className="p-6 text-gray-900">
                          <h3 className="text-green-600 font-semibold text-2xl">In Progress Tasks</h3>
                          <p className="text-xl mt-4">
                            <span className="mr-2">{myInprogressTasks}</span>/
                            <span className="ml-2">{totalInprogressTasks}</span>
                          </p>
                      </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                      <div className="p-6 text-gray-900">
                          <h3 className="text-blue-600 font-semibold text-2xl">Complated Tasks</h3>
                          <p className="text-xl mt-4">
                            <span className="mr-2">{myCompletedTasks}</span>/
                            <span className="ml-2">{totalCompletedTasks}</span>
                          </p>
                      </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                      <div className="p-6 text-gray-900">
                        <h3 className="text-gray-400 font-semibold text-xl mb-4">My Active Tasks</h3>
                        <div className='overflow-auto'>
                          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700
                            dark:text-gray-400 border-b-2 border-gray-200">
                              <tr className="text-nowrap">
                                <TableHeading name={"id"} sortable={false}>
                                  ID
                                </TableHeading>
                                <th className="px-3 py-2">Image</th>
                                <TableHeading name={"name"} sortable={false}>
                                  Project Name
                                </TableHeading>
                                <TableHeading name={"name"} sortable={false}>
                                  Name
                                </TableHeading>
                                <TableHeading name={"status"} sortable={false}>
                                  Status
                                </TableHeading>
                                <TableHeading name={"created_at"} sortable={false}>
                                  Create Date
                                </TableHeading>
                                <TableHeading name={"due_date"} sortable={false}>
                                  Due Date
                                </TableHeading>
                                <th className="px-3 py-2">Created By</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                myTasks.data.length > 0 ? (
                                myTasks.data.map(task => (
                                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                                    <th className="px-3 py-3">{task?.id}</th>
                                    <th className="px-3 py-3"><Link className='hover:underline' href={route('project.show',task.project.id)}>{task?.project?.name} </Link></th>
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
                      </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
