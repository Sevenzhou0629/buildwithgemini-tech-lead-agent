from abc import ABC, abstractmethod
from typing import List
from app.visualization.models import VisualizationSpec, VisualType
from app.models.evidence import Evidence


class BaseVisualBuilder(ABC):
    @property
    @abstractmethod
    def visual_type(self) -> VisualType:
        pass

    @abstractmethod
    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        """Constructs a validated VisualizationSpec strictly grounded in the provided Evidence."""
        pass
