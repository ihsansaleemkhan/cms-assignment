<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "CMS Assignment API",
    description: "CMS Backend API Documentation"
)]
#[OA\Server(
    url: "http://127.0.0.1:8000/api",
    description: "Local Server"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "apiKey",
    in: "header",
    name: "Authorization",
    description: "Bearer Token"
)]
class OpenApi
{
}