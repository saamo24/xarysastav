from rest_framework import serializers
from .models import Post

# class PostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = ['pid', 'content', 'poster', 'date']
#         read_only_fields = ['pid', 'poster', 'date'] 

#     def create(self, validated_data):
#         validated_data['poster'] = self.context['request'].user
#         post = Post.objects.create(**validated_data)
#         return post

#     def update(self, instance, validated_data):
#         instance.content = validated_data.get('content', instance.content)
#         instance.save()
#         return instance



class PostSerializer(serializers.ModelSerializer):
    poster_username = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['pid', 'content', 'poster_username', 'date']
        read_only_fields = ['pid', 'poster', 'date']

    def get_poster_username(self, obj):
        return obj.poster.username  # Assuming the User model has a 'username' field

    def create(self, validated_data):
        validated_data['poster'] = self.context['request'].user
        post = Post.objects.create(**validated_data)
        return post

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance
