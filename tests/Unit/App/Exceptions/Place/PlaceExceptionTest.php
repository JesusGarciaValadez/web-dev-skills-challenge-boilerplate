<?php

namespace Tests\Unit\App\Exceptions\Place;

use App\Exceptions\Place\PlaceException;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use RuntimeException;

class PlaceExceptionTest extends TestCase
{
    #[Test]
    public function it_extends_runtime_exception(): void
    {
        $exception = new class extends PlaceException {
        };
        $this->assertInstanceOf(RuntimeException::class, $exception);
    }

    #[Test]
    public function it_can_be_thrown_and_caught(): void
    {
        $this->expectException(PlaceException::class);

        throw new class extends PlaceException {
            public function __construct()
            {
                parent::__construct('Test exception');
            }
        };
    }

    #[Test]
    public function it_preserves_custom_message(): void
    {
        $message = 'Custom error message';
        $exception = new class($message) extends PlaceException {
            public function __construct(string $message)
            {
                parent::__construct($message);
            }
        };

        $this->assertEquals($message, $exception->getMessage());
    }

    #[Test]
    public function it_preserves_custom_code(): void
    {
        $code = 123;
        $exception = new class($code) extends PlaceException {
            public function __construct(int $code)
            {
                parent::__construct('Test', $code);
            }
        };

        $this->assertEquals($code, $exception->getCode());
    }
}
