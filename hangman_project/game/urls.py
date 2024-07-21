from django.urls import path
from .views import new_game, game_state, make_guess, delete_game, reset_game

urlpatterns = [
    path('game/new', new_game, name='new_game'),
    path('game/<int:id>', game_state, name='game_state'),
    path('game/<int:id>/guess', make_guess, name='make_guess'),
     path('game/<int:id>/delete', delete_game, name='delete_game'),
     path('game/<int:id>/reset', reset_game, name='reset_game'),
]
