"""Model evaluation invariants and denominator-safe comparisons."""

from dataclasses import dataclass
from numbers import Integral


@dataclass(frozen=True)
class Confusion:
    true_positive: int
    false_positive: int
    false_negative: int
    true_negative: int

    def __post_init__(self):
        if any(not isinstance(value, Integral) or isinstance(value, bool)
               for value in (self.true_positive, self.false_positive,
                             self.false_negative, self.true_negative)):
            raise ValueError("Confusion counts must be integers")
        if min(self.true_positive, self.false_positive,
               self.false_negative, self.true_negative) < 0:
            raise ValueError("Confusion counts must be nonnegative")

    @property
    def recall(self) -> float | None:
        denominator = self.true_positive + self.false_negative
        return self.true_positive / denominator if denominator else None

    @property
    def false_positive_rate(self) -> float | None:
        denominator = self.false_positive + self.true_negative
        return self.false_positive / denominator if denominator else None


def false_alarm_reduction(candidate: Confusion, baseline: Confusion) -> float | None:
    if baseline.false_positive == 0:
        return None
    return 100 * (1 - candidate.false_positive / baseline.false_positive)
