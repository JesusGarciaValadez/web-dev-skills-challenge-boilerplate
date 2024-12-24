<?php

namespace App\Exceptions\Place;

use Throwable;

class PlaceNotFoundException extends PlaceException
{
    public function __construct(string $message = '', int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message ?: 'Place does not exist', $code, $previous);
    }
}
