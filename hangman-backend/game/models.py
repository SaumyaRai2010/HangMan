from django.db import models

# this contains all the game fields in the table

class Game(models.Model):
    word = models.CharField(max_length=100) #the word to be guessed
    state = models.CharField(max_length=10, default='InProgress') #current state of the game (InProgress, Won, Lost, Quit)
    revealed_word = models.CharField(max_length=100, default="") #partially revealed word with underscores
    incorrect_guesses = models.IntegerField(default=0) #no. of incorrect guesses user made
    correct_guesses = models.CharField(max_length=100, default='') #no. of correct guesses user made
    max_incorrect_guesses = models.IntegerField() #max incorrect guesses user can make, after which he will lose

    #calculates the remaining guesses allowed
    @property
    def remaining_incorrect_guesses(self):
        return self.max_incorrect_guesses - self.incorrect_guesses

    #initializes revealed_word with underscores 
    def save(self, *args, **kwargs):
        if not self.revealed_word:
            self.revealed_word = " _ " * len(self.word)
        super(Game, self).save(*args, **kwargs)
