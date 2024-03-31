<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DashboardController;


// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::redirect('/','dashboard');

Route::middleware(['auth', 'verified'])->group(function(){
    Route::get('dashboard',[DashboardController::class,'dashboard'])->name('dashboard');
    Route::post('project/{project}',[ProjectController::class,'update'])->name('project.update');
    Route::resource('project', ProjectController::class)->except('update');
    Route::post('task/{task}',[TaskController::class,'update'])->name('task.update');
    Route::resource('task', TaskController::class)->except('update');
    Route::resource('user', UserController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/show-generate-pdf', [ProfileController::class, 'showGeneratePdfView'])->name('pdf.generate');
    Route::get('/generate-pdf', [ProfileController::class, 'generatePdf'])->name('generatePdf');
});

require __DIR__.'/auth.php';
