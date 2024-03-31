<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Project::query();

        $sort_field = $request->query('sort_filed','created_at');
        $sort_direction = $request->query('sort_direction','desc');

        if ($request->query('name')) {
            $name = $request->query('name');
            $query->where('name', 'like', "%$name%");
        }

        if ($request->query('status')) {
            $query->where('status', $request->query('status'));
        }

        $projects = $query->orderBy($sort_field,$sort_direction)
        ->latest()->paginate(10)->onEachSide(1);

        return Inertia::render('Projects/index', [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => $request->query() ?: null,
            'message' => session('success') ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Projects/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
       $allInput = $request->except('image');
       $allInput['created_by'] = Auth::id();
       $allInput['updated_by'] = Auth::id();
       $allInput['image_path'] = (!empty($request->image))
        ? $request->file('image')->store('projects','public')
        : null;
       Project::create($allInput);
       return to_route('project.index')->with('success','Record is created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project,Request $request)
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

        $tasks = $query->where('project_id',$project?->id)
                ->orderBy($sort_field,$sort_direction)
                ->latest()->paginate(10)->onEachSide(1);

        return Inertia::render('Projects/show',[
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => $request->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('Projects/edit',[
            'project' => new ProjectResource($project)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $allInput = $request->except('image');
        $allInput['updated_by'] = Auth::id();

        if(!empty($request->image)) {
            if($project->image_path) {
                Storage::disk('public')->delete($project->image_path);
            }
            $allInput['image_path'] = $request->file('image')->store('projects','public');
        }else{
            $allInput['image_path'] = $project?->image_path;
        }
        Project::where('id',$project->id)->update($allInput);
        return to_route('project.index')->with('success','Record is updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if($project->image_path) Storage::disk('public')->delete($project->image_path);
        $project->delete();
        return to_route('project.index')->with('success','Record is deleted successfully!');
    }
}
