from fastapi import APIRouter

from app import schema
from app.api.dependencies import SessionDatabase
from app.services import courses_service

courses_router = APIRouter(
	prefix='/courses',
	tags=['Курсы'],
)


@courses_router.get(
	'/',
	summary='Список курсов',
	response_model=list[schema.Course],
)
def get_courses_list(
	session: SessionDatabase,
):
	return [
		schema.Course.model_validate(course).model_copy(update={'records_count': count})
		for course, count in courses_service.get_list(session=session)
	]
