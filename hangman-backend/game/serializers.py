from rest_framework import serializers
from .models import Game

class GameStateSerializer(serializers.ModelSerializer):
    state = serializers.CharField()  # Assuming `state` is a field in your model
    incorrect_guesses = serializers.IntegerField()
    remaining_incorrect_guesses = serializers.IntegerField()  # Assuming this is a custom method or property

    class Meta:
        model = Game
        fields = ['state', 'word', 'incorrect_guesses', 'remaining_incorrect_guesses', 'correct_guesses', 'revealed_word']