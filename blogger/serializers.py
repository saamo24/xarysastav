# from rest_framework import serializers
# from .models import Post

# class PostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = ['pid', 'content', 'poster', 'date']
    
#     def create(self, validated_data):
#         validated_data['poster'] = self.context['request'].user
#         return super().create(validated_data)


from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['pid', 'content', 'poster', 'date']
        read_only_fields = ['pid', 'poster', 'date'] 

    def create(self, validated_data):
        validated_data['poster'] = self.context['request'].user
        post = Post.objects.create(**validated_data)
        return post

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance
