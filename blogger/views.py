from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(poster=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({'content': serializer.instance.content})

class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure proper authentication
    lookup_field = 'pid'  # Specify the lookup field

    def perform_update(self, serializer):
        serializer.save()  # Confirm perform_update correctly saves the serializer data

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'content': serializer.instance.content}) 