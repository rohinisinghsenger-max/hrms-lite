from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Employee
from .serializers import EmployeeSerializer, AttendanceSerializer

class EmployeeListCreateAPI(APIView):
    def get(self, request):
        qs = Employee.objects.all().order_by("-created_at")
        return Response(EmployeeSerializer(qs, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            emp = serializer.save()
            return Response(EmployeeSerializer(emp).data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"detail": "Employee ID or Email already exists."}, status=status.HTTP_409_CONFLICT)


class EmployeeDeleteAPI(APIView):
    def delete(self, request, pk):
        try:
            emp = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)

        emp.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AttendanceCreateAPI(APIView):
    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        att = serializer.save()
        return Response(AttendanceSerializer(att).data, status=status.HTTP_201_CREATED)


class AttendanceByEmployeeAPI(APIView):
    def get(self, request, employee_id):
        try:
            emp = Employee.objects.get(pk=employee_id)
        except Employee.DoesNotExist:
            return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)

        qs = emp.attendance_records.all().order_by("-date")

        # Optional filter: ?from=YYYY-MM-DD&to=YYYY-MM-DD
        from_date = request.query_params.get("from")
        to_date = request.query_params.get("to")
        if from_date:
            qs = qs.filter(date__gte=from_date)
        if to_date:
            qs = qs.filter(date__lte=to_date)

        return Response(AttendanceSerializer(qs, many=True).data, status=status.HTTP_200_OK)


class AttendanceSummaryAPI(APIView):
    def get(self, request, employee_id):
        try:
            emp = Employee.objects.get(pk=employee_id)
        except Employee.DoesNotExist:
            return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)

        total_present = emp.attendance_records.filter(status="PRESENT").count()
        total_absent = emp.attendance_records.filter(status="ABSENT").count()

        return Response(
            {"total_present": total_present, "total_absent": total_absent},
            status=status.HTTP_200_OK
        )
