import unittest

from validation import Confusion, false_alarm_reduction


class EvaluationTests(unittest.TestCase):
    def test_recall(self):
        assert Confusion(8, 2, 2, 88).recall == 0.8

    def test_zero_denominator_is_unavailable(self):
        assert Confusion(0, 0, 0, 0).recall is None
        assert false_alarm_reduction(Confusion(1, 0, 1, 1), Confusion(1, 0, 1, 1)) is None

    def test_false_alarm_reduction(self):
        assert false_alarm_reduction(Confusion(1, 3, 1, 1), Confusion(1, 10, 1, 1)) == 70
