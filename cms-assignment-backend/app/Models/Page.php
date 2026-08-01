<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'deleted_by',
    ];

    protected $casts = [
        'publish_date' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Page $page): void {
            if (!auth()->check()) {
                return;
            }

            $userId = auth()->id();

            $page->created_by ??= $userId;
            $page->updated_by = $userId;
        });

        static::updating(function (Page $page): void {
            if (!auth()->check()) {
                return;
            }

            /*
             * Avoid changing updated_by while only recording deleted_by
             * during the soft-delete event.
             */
            if ($page->isDirty('deleted_by') && count($page->getDirty()) === 1) {
                return;
            }

            $page->updated_by = auth()->id();
        });

        static::deleting(function (Page $page): void {
            if (
                !auth()->check() ||
                $page->isForceDeleting()
            ) {
                return;
            }

            $page->deleted_by = auth()->id();
            $page->saveQuietly();
        });

        static::restoring(function (Page $page): void {
            /*
             * Once restored, it is no longer considered deleted by anyone.
             */
            $page->deleted_by = null;

            if (auth()->check()) {
                $page->updated_by = auth()->id();
            }
        });
    }

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

    public function deleter()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}