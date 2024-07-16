from django.urls import path
from .views import PostListCreateView, PostRetrieveUpdateDestroyView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<uuid:pid>/', PostRetrieveUpdateDestroyView.as_view(), name='post-detail'),
]
