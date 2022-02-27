from django.db import models


# Create your models here.
class ChessBoard(models.Model):
    board = models.CharField(max_length=64, default='bRbNbBbQbKbBbNbR/bPbPbPbPbPbPbPbP/8/8/8/8/wPwPwPwPwPwPwPwP'
                                                    '/wRwNwBwQwKwBwNwR')
    personToMove = models.CharField(max_length=8, default='white')

    def nextToMove(self):
        if self.personToMove == 'white':
            self.personToMove = 'black'
        elif self.personToMove == 'black':
            self.personToMove = 'white'
