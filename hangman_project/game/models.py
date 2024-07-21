from django.db import models

class Game(models.Model):
    word = models.CharField(max_length=100)
    state = models.CharField(max_length=10, default='InProgress')
    revealed_word = models.CharField(max_length=100, default="")
    incorrect_guesses = models.IntegerField(default=0)
    correct_guesses = models.CharField(max_length=100, default='')
    max_incorrect_guesses = models.IntegerField()

    @property
    def current_state(self):
        return ''.join([c if c in self.correct_guesses else '_' for c in self.word])

    @property
    def remaining_incorrect_guesses(self):
        return self.max_incorrect_guesses - self.incorrect_guesses

    def save(self, *args, **kwargs):
        if not self.revealed_word:
            self.revealed_word = " _ " * len(self.word)
        super(Game, self).save(*args, **kwargs)
