<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Place extends Model
{
    use HasFactory;

    protected $table = 'places';

    protected $fillable = ['name', 'location_name', 'category', 'point'];

    public $timestamps = false;

    public $casts = ['point' => 'array'];

    /**
     * Scope a query to select columns.
     */
    public function scopeSelectColumns(Builder $query): void
    {
        $query->select(['id', 'name', 'location_name', 'category', 'point']);
    }

    /**
     * Scope a query to order by id.
     */
    public function scopeOrderById(Builder $query): void
    {
        $query->orderBy('id', 'asc');
    }
}
