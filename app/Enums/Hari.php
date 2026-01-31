<?php

namespace App\Enums;

enum Hari: int
{
    case Senin = 1;
    case Selasa = 2;
    case Rabu = 3;
    case Kamis = 4;
    case Jumat = 5;
    case Sabtu = 6;
    case Minggu = 7;

    public function label(): string
    {
        return $this->name;
    }

    public static function toArray(): array
    {
        $result = [];
        foreach (self::cases() as $case) {
            $result[$case->value] = $case->label();
        }

        return $result;
    }

    public static function fromDate(\DateTimeInterface $date): self
    {
        $dayOfWeek = (int) $date->format('N'); // 1=Mon ... 7=Sun

        return self::from($dayOfWeek);
    }
}
