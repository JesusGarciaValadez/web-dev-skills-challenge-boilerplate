<?php

use Illuminate\Support\Facades\Route;

Route::get('/', static fn() => view('home'))->name('home');
