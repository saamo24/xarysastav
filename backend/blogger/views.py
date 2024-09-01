from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse, HttpResponseNotFound


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
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pid'

    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'content': serializer.instance.content}) 
    
class UserPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        return Post.objects.filter(poster__username=username)


class DeletePostView(APIView):
    def delete(self, request, *args, **kwargs):
        pid = kwargs.get('pid')  # Extract the post ID from URL
        try:
            # Retrieve and delete the post
            post = Post.objects.get(pid=pid)
            post.delete()
            return JsonResponse({'detail': 'Post successfully deleted.'}, status=204)
        except Post.DoesNotExist:
            return HttpResponseNotFound(JsonResponse({'detail': 'Post not found.'}, status=404))
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=400)
