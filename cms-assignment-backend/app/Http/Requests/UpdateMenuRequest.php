<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'parent_id' => 'nullable|exists:menus,id',

            'title' => 'required|string|max:255',

            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('menus')->ignore($this->menu)
            ],

            'sort_order' => 'nullable|integer|min:0',

            'is_active' => 'nullable|boolean',
        ];
    }
}