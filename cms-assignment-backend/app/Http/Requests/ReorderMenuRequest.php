<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'menus' => ['required', 'array'],

            'menus.*.id' => ['required', 'exists:menus,id'],

            'menus.*.parent_id' => ['nullable', 'exists:menus,id'],

            'menus.*.sort_order' => ['required', 'integer', 'min:1'],
        ];
    }
}