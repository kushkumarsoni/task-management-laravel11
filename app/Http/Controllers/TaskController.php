<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::query();
        $sort_field = $request->query('sort_filed','created_at');
        $sort_direction = $request->query('sort_direction','desc');

        if ($request->query('name')) {
            $name = $request->query('name');
            $query->where('name', 'like', "%$name%");
        }

        if ($request->query('status')) {
            $query->where('status', $request->query('status'));
        }

        $tasks = $query->orderBy($sort_field,$sort_direction)
        ->latest()->paginate(10)->onEachSide(1);

        return Inertia::render('Tasks/index',[
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => $request->query() ?: null,
            'message' => session('success') ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::latest()->limit(100)->get();
        $projects = Project::latest()->limit(100)->get();
        return Inertia::render('Tasks/create',[
            'users' => UserResource::collection($users),
            'projects' => ProjectResource::collection($projects),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
       $allInput = $request->except('image');
       $allInput['created_by'] = Auth::id();
       $allInput['updated_by'] = Auth::id();
       $allInput['image_path'] = (!empty($request->image))
        ? $request->file('image')->store('projects','public')
        : null;
       Task::create($allInput);
       return to_route('task.index')->with('success','Record is created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return Inertia::render('Tasks/show',[
            'task' => new TaskResource($task)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $users = User::latest()->limit(100)->get();
        $projects = Project::latest()->limit(100)->get();
        return Inertia::render('Tasks/edit',[
            'task' => new TaskResource($task),
            'users' => UserResource::collection($users),
            'projects' => ProjectResource::collection($projects),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $allInput = $request->except('image');
        $allInput['updated_by'] = Auth::id();

        if(!empty($request->image)) {
            if($task->image_path) Storage::disk('public')->delete($task->image_path);
            $allInput['image_path'] = $request->file('image')->store('tasks','public');
        }else{
            $allInput['image_path'] = $task?->image_path;
        }
        Task::where('id',$task->id)->update($allInput);
        return to_route('task.index')->with('success','Record is updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if($task->image_path) Storage::disk('public')->delete($task->image_path);
        $task->delete();
        return to_route('task.index')->with('success','Record is deleted successfully!');
    }
}
