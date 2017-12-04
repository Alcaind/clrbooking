<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitad56d39bfcea1ec182d3e264cf4c6564
{
    public static $files = array (
        '253c157292f75eb38082b5acb06f3f01' => __DIR__ . '/..' . '/nikic/fast-route/src/functions.php',
    );

    public static $prefixLengthsPsr4 = array (
        'U' => 
        array (
            'Utils\\' => 6,
        ),
        'T' => 
        array (
            'Tuupola\\Middleware\\' => 19,
            'Tuupola\\' => 8,
        ),
        'S' => 
        array (
            'Slim\\Middleware\\' => 16,
            'Slim\\Handlers\\' => 14,
            'Slim\\' => 5,
        ),
        'R' => 
        array (
            'Response\\' => 9,
        ),
        'P' => 
        array (
            'Psr\\Log\\' => 8,
            'Psr\\Http\\Message\\' => 17,
            'Psr\\Container\\' => 14,
        ),
        'N' => 
        array (
            'Neomerx\\Cors\\' => 13,
            'Negotiation\\' => 12,
        ),
        'M' => 
        array (
            'Monolog\\' => 8,
            'Micheh\\Cache\\' => 13,
        ),
        'I' => 
        array (
            'Interop\\Container\\' => 18,
        ),
        'G' => 
        array (
            'Gofabian\\Negotiation\\' => 21,
        ),
        'F' => 
        array (
            'Firebase\\JWT\\' => 13,
            'FastRoute\\' => 10,
        ),
        'E' => 
        array (
            'Exception\\' => 10,
        ),
        'D' => 
        array (
            'Dotenv\\' => 7,
        ),
        'C' => 
        array (
            'Crell\\ApiProblem\\' => 17,
        ),
        'A' => 
        array (
            'App\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Utils\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src/Utils',
        ),
        'Tuupola\\Middleware\\' => 
        array (
            0 => __DIR__ . '/..' . '/tuupola/cors-middleware/src',
        ),
        'Tuupola\\' => 
        array (
            0 => __DIR__ . '/..' . '/tuupola/base62/src',
        ),
        'Slim\\Middleware\\' => 
        array (
            0 => __DIR__ . '/..' . '/tuupola/slim-jwt-auth/src',
            1 => __DIR__ . '/..' . '/tuupola/slim-basic-auth/src',
        ),
        'Slim\\Handlers\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src/Slim/Handlers',
        ),
        'Slim\\' => 
        array (
            0 => __DIR__ . '/..' . '/slim/slim/Slim',
        ),
        'Response\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src/Response',
        ),
        'Psr\\Log\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/log/Psr/Log',
        ),
        'Psr\\Http\\Message\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/http-message/src',
        ),
        'Psr\\Container\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/container/src',
        ),
        'Neomerx\\Cors\\' => 
        array (
            0 => __DIR__ . '/..' . '/neomerx/cors-psr7/src',
        ),
        'Negotiation\\' => 
        array (
            0 => __DIR__ . '/..' . '/willdurand/negotiation/src/Negotiation',
        ),
        'Monolog\\' => 
        array (
            0 => __DIR__ . '/..' . '/monolog/monolog/src/Monolog',
        ),
        'Micheh\\Cache\\' => 
        array (
            0 => __DIR__ . '/..' . '/micheh/psr7-cache/src',
        ),
        'Interop\\Container\\' => 
        array (
            0 => __DIR__ . '/..' . '/container-interop/container-interop/src/Interop/Container',
        ),
        'Gofabian\\Negotiation\\' => 
        array (
            0 => __DIR__ . '/..' . '/gofabian/negotiation-middleware/src',
        ),
        'Firebase\\JWT\\' => 
        array (
            0 => __DIR__ . '/..' . '/firebase/php-jwt/src',
        ),
        'FastRoute\\' => 
        array (
            0 => __DIR__ . '/..' . '/nikic/fast-route/src',
        ),
        'Exception\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src/Exception',
        ),
        'Dotenv\\' => 
        array (
            0 => __DIR__ . '/..' . '/vlucas/phpdotenv/src',
        ),
        'Crell\\ApiProblem\\' => 
        array (
            0 => __DIR__ . '/..' . '/crell/api-problem/src',
        ),
        'App\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src/App',
        ),
    );

    public static $prefixesPsr0 = array (
        'P' => 
        array (
            'Pimple' => 
            array (
                0 => __DIR__ . '/..' . '/pimple/pimple/src',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitad56d39bfcea1ec182d3e264cf4c6564::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitad56d39bfcea1ec182d3e264cf4c6564::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInitad56d39bfcea1ec182d3e264cf4c6564::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}
