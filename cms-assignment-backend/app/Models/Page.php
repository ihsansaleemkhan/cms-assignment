<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'menu_id',
        'title',
        'slug',
        'body',
        'cover_image',
        'status',
        'publish_date',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'publish_date' => 'datetime',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}