<?php

namespace Tests\Unit\App\Exceptions\Place;

use App\Exceptions\Place\PlaceException;
use App\Exceptions\Place\PlaceNotFoundException;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PlaceNotFoundExceptionTest extends TestCase
{
    #[Test]
    public function it_extends_place_exception(): void
    {
        $exception = new PlaceNotFoundException();
        $this->assertInstanceOf(PlaceException::class, $exception);
    }

    #[Test]
    public function it_has_correct_default_message(): void
    {
        $exception = new PlaceNotFoundException();
        $this->assertEquals('Place does not exist', $exception->getMessage());
    }

    #[Test]
    public function it_can_be_thrown_and_caught(): void
    {
        $this->expectException(PlaceNotFoundException::class);
        $this->expectExceptionMessage('Place does not exist');

        throw new PlaceNotFoundException();
    }

    #[Test]
    public function it_is_caught_by_place_exception(): void
    {
        $this->expectException(PlaceException::class);
        throw new PlaceNotFoundException();
    }

    #[Test]
    public function it_has_zero_default_code(): void
    {
        $exception = new PlaceNotFoundException();
        $this->assertEquals(0, $exception->getCode());
    }

    #[Test]
    public function it_preserves_previous_exception(): void
    {
        $previous = new \Exception('Previous error');
        $exception = new PlaceNotFoundException('', 0, $previous);
        $this->assertSame($previous, $exception->getPrevious());
    }
}
