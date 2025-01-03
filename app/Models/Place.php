<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $columns = ['id', 'name', 'location_name', 'category', 'points'];
    public $casts = ['points' => 'array'];
    protected $table = 'places';
    protected $fillable = ['name', 'location_name', 'category', 'points'];

    /**
     * Scope a query to select columns.
     */
    public function scopeSelectColumns(Builder $query): void
    {
        $query->select($this->columns);
    }

    /**
     * Scope a query to order by id.
     */
    public function scopeOrderById(Builder $query): void
    {
        $query->orderBy('id');
    }
}
