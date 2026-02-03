from django.urls import path
from .views import (
    EmployeeListCreateAPI,
    EmployeeDeleteAPI,
    AttendanceCreateAPI,
    AttendanceByEmployeeAPI,
    AttendanceSummaryAPI,AttendanceListCreateApi
)




urlpatterns = [
    path("api/employees/", EmployeeListCreateAPI.as_view()),
    path("api/employees/<int:pk>/", EmployeeDeleteAPI.as_view()),

    path("api/attendance/", AttendanceCreateAPI.as_view()),
    path("attendance/", AttendanceListCreateApi.as_view(), name="attendance"),
    path("api/employees/<int:employee_id>/attendance/", AttendanceByEmployeeAPI.as_view()),
    path("api/employees/<int:employee_id>/attendance/summary/", AttendanceSummaryAPI.as_view()),
]
