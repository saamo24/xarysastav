# from django.shortcuts import render
# from rest_framework.views import APIView
# from .serializers import UserSerializer
# from rest_framework.response import Response
# from rest_framework import status

# # view for registering users
# class RegisterView(APIView):
    
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

from rest_framework import status
from rest_framework.exceptions import ValidationError

# view for registering users
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# # view for logging out users
# class LogoutView(APIView):
#     permission_classes = (IsAuthenticated,)

#     def post(self, request):
#         try:
#             # Check if 'refresh' token is present in the request data
#             refresh_token = request.data.get("refresh")
#             if refresh_token is None:
#                 raise ValidationError("Refresh token is required")

#             # Create a RefreshToken object and blacklist it
#             token = RefreshToken(refresh_token)
#             token.blacklist()
            
#             return Response(status=status.HTTP_205_RESET_CONTENT)
#         except ValidationError as ve:
#             # Handle missing refresh token case
#             return Response({"detail": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             # Handle other exceptions
#             return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


#TODO

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=205)
        except Exception as e:
            return Response(status=400)
