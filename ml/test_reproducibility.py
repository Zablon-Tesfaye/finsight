import unittest
from experiment import ExperimentConfig
from reproducibility import fingerprint, metadata


class ReproducibilityTests(unittest.TestCase):
    def test_same_config_same_fingerprint(self):
        assert fingerprint(ExperimentConfig(seed=42)) == fingerprint(ExperimentConfig(seed=42))

    def test_changed_seed_changes_fingerprint(self):
        assert fingerprint(ExperimentConfig(seed=42)) != fingerprint(ExperimentConfig(seed=43))

    def test_metadata_labels_synthetic_dataset(self):
        assert metadata(ExperimentConfig())["dataset"].startswith("synthetic")
