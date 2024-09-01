from django.urls import path
from .views import PostListCreateView, PostRetrieveUpdateDestroyView, UserPostListView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<uuid:pid>/', PostRetrieveUpdateDestroyView.as_view(), name='post-detail'),
    path('<slug:username>/', UserPostListView.as_view(), name='user_post')
]
