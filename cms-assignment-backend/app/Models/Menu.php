<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'parent_id',
        'title',
        'title_ar',
        'slug',
        'sort_order',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Menu $menu): void {
            if (!auth()->check()) {
                return;
            }

            $userId = auth()->id();

            $menu->created_by ??= $userId;
            $menu->updated_by = $userId;
        });

        static::updating(function (Menu $menu): void {
            if (!auth()->check()) {
                return;
            }

            if ($menu->isDirty('deleted_by') && count($menu->getDirty()) === 1) {
                return;
            }

            $menu->updated_by = auth()->id();
        });

        static::deleting(function (Menu $menu): void {
            if (
                !auth()->check() ||
                $menu->isForceDeleting()
            ) {
                return;
            }

            $menu->deleted_by = auth()->id();
            $menu->saveQuietly();
        });

        static::restoring(function (Menu $menu): void {
            $menu->deleted_by = null;

            if (auth()->check()) {
                $menu->updated_by = auth()->id();
            }
        });
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')
            ->orderBy('sort_order');
    }

    public function pages()
    {
        return $this->hasMany(Page::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deleter()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}