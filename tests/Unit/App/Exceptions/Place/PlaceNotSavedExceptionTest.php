<?php

namespace Tests\Unit\App\Exceptions\Place;

use App\Exceptions\Place\PlaceException;
use App\Exceptions\Place\PlaceNotSavedException;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PlaceNotSavedExceptionTest extends TestCase
{
    #[Test]
    public function it_extends_place_exception(): void
    {
        $exception = new PlaceNotSavedException();
        $this->assertInstanceOf(PlaceException::class, $exception);
    }

    #[Test]
    public function it_has_correct_default_message(): void
    {
        $exception = new PlaceNotSavedException();
        $this->assertEquals('Failed to save place', $exception->getMessage());
    }

    #[Test]
    public function it_accepts_custom_message(): void
    {
        $message = 'Custom error message';
        $exception = new PlaceNotSavedException($message);
        $this->assertEquals($message, $exception->getMessage());
    }

    #[Test]
    public function it_can_be_thrown_and_caught(): void
    {
        $this->expectException(PlaceNotSavedException::class);
        $this->expectExceptionMessage('Failed to save place');

        throw new PlaceNotSavedException();
    }

    #[Test]
    public function it_is_caught_by_place_exception(): void
    {
        $this->expectException(PlaceException::class);
        throw new PlaceNotSavedException();
    }

    #[Test]
    public function it_has_zero_default_code(): void
    {
        $exception = new PlaceNotSavedException();
        $this->assertEquals(0, $exception->getCode());
    }

    #[Test]
    public function it_preserves_previous_exception(): void
    {
        $previous = new \Exception('Previous error');
        $exception = new PlaceNotSavedException('Custom message', 0, $previous);
        $this->assertSame($previous, $exception->getPrevious());
    }

    #[Test]
    public function it_handles_empty_message(): void
    {
        $exception = new PlaceNotSavedException('');
        $this->assertEquals('Failed to save place', $exception->getMessage());
    }

    #[Test]
    public function it_handles_null_message(): void
    {
        $exception = new PlaceNotSavedException(null);
        $this->assertEquals('Failed to save place', $exception->getMessage());
    }
}
