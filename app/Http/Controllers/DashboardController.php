<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $tasks = Task::query();
        $users = User::query();
        $projects = Project::query();

        $totalPendingTasks =  Task::query()->where('status','pending')->count();
        $myPendingTasks =  Task::query()->where('status','pending')
        ->where('assigned_user_id',Auth::id())->count();

        $totalInprogressTasks = Task::query()->where('status','in_progress')->count();
        $myInprogressTasks =  Task::query()->where('status','in_progress')
        ->where('assigned_user_id',Auth::id())->count();

        $totalCompletedTasks =  Task::query()->where('status','completed')->count();
        $myCompletedTasks =  Task::query()->where('status','completed')
        ->where('assigned_user_id',Auth::id())->count();


        $myTasks =  Task::query()->where('assigned_user_id',Auth::id())
                ->whereIn('status',['pending','in_progress'])
                ->limit(10)->get();

        return Inertia::render('Dashboard',[
            'totalPendingTasks' => $totalPendingTasks,
            'myPendingTasks' => $myPendingTasks,
            'totalInprogressTasks' => $totalInprogressTasks,
            'myInprogressTasks' => $myInprogressTasks,
            'totalCompletedTasks' => $totalCompletedTasks,
            'myCompletedTasks' => $myCompletedTasks,
            'myTasks' => TaskResource::collection($myTasks)
        ]);
    }
}
