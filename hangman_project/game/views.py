from django.shortcuts import get_object_or_404
from rest_framework.response import Response
import math
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import HttpResponse
from .models import Game
from .serializers import GameStateSerializer
import random

words = ["Hangman", "Python", "Audacix", "Bottle", "Pen"]

def exclude_word_if_in_progress(game_state):
    """Helper function to exclude the word from game state if the game is in progress."""
    if game_state.get("state") == "InProgress":
        game_state.pop("word", None)

@api_view(['POST'])
def new_game(request):
    word = random.choice(words).upper()
    max_incorrect_guesses = math.ceil(len(word) / 2)
    game = Game.objects.create(word=word, max_incorrect_guesses=max_incorrect_guesses)
    return Response({'id': game.id}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def game_state(request, id):
    game = get_object_or_404(Game, id=id)
    serializer = GameStateSerializer(game)
    game_state = serializer.data
    exclude_word_if_in_progress(game_state)
    return Response(game_state)

@api_view(['POST'])
def make_guess(request, id):
    game = get_object_or_404(Game, id=id)
    guess = request.data.get('guess', '').upper()
    game_state = GameStateSerializer(game).data

    if len(guess) != 1 or not guess.isalpha():
        game_state['message'] = 'Invalid guess. Please enter a single alphabet.'
        exclude_word_if_in_progress(game_state)
        return Response(game_state, status=status.HTTP_200_OK)
    
    if guess in game.correct_guesses:
        game_state['message'] = 'Letter has been already guessed'
        exclude_word_if_in_progress(game_state)
        return Response(game_state, status=status.HTTP_200_OK)

    if guess in game.word:
        game.correct_guesses += guess
        game.revealed_word = ''.join([char if char in game.correct_guesses else ' _ ' for char in game.word])
    else:
        game.incorrect_guesses += 1

    if all(c in game.correct_guesses for c in game.word):
        game.state = 'Won'
    elif game.incorrect_guesses >= game.max_incorrect_guesses:
        game.state = 'Lost'
    
    game.save()
    serializer = GameStateSerializer(game)
    game_state = serializer.data
    exclude_word_if_in_progress(game_state)
    return Response(game_state)

@api_view(['DELETE'])
def delete_game(request, id):
    game = get_object_or_404(Game, id=id)
    game.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def reset_game(request, id):
    game = get_object_or_404(Game, id=id)

    if game.state == 'InProgress':
        game.state = 'Quit'
    
    # so that the game state does not change to "Quit" after players wins or loses
 
    game.save()
    serializer = GameStateSerializer(game)
    return Response(serializer.data, status=status.HTTP_200_OK)

def home(request):
    return HttpResponse("Welcome to the Hangman Game!")