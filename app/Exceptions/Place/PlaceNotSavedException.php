<?php

namespace App\Exceptions\Place;

use Throwable;

class PlaceNotSavedException extends PlaceException
{
    public function __construct(?string $message = null, int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message ?: 'Failed to save place', $code, $previous);
    }
}
