<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();
        $sort_field = $request->query('sort_filed','created_at');
        $sort_direction = $request->query('sort_direction','desc');

        if ($request->query('name')) {
            $name = $request->query('name');
            $query->where('name', 'like', "%$name%");
        }

        $users = $query->orderBy($sort_field,$sort_direction)
        ->latest()->paginate(10)->onEachSide(1);

        return Inertia::render('Users/index',[
            'users' => UserResource::collection($users),
            'queryParams' => $request->query() ?: null,
            'message' => session('success') ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
       $allInput = $request->except('password_confirmation');
       $allInput['password'] = Hash::make($request->password);
       User::create($allInput);
       return to_route('user.index')->with('success','Record is created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
       return Inertia::render('Users/edit',['user'=>$user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = !empty($request->password) ? Hash::make($request->password) : $user?->password;
        $user->save();
        return to_route('user.index')->with('success','Record is updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return to_route('user.index')
        ->with('success','Record is deleted successfully!');
    }
}
