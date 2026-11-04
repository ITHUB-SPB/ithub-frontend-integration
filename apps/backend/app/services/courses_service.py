from collections.abc import Sequence

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import models


def get_list(
	*,
	session: Session,
) -> Sequence[models.Course]:
	return session.execute(
		select(models.Course, func.count(models.Record.id))
		.outerjoin(models.Record, models.Course.id == models.Record.course_id)
		.group_by(models.Course.id)
	).unique().all()
