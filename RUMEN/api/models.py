from django.db import models
import uuid


# Create your models here.


def codeGenerator():
    code = uuid.uuid4()
    if ChessBoard.objects.filter(code=code).exists():
        codeGenerator()

    return code


class ChessBoard(models.Model):
    code = models.CharField(max_length=36, default=codeGenerator, unique=True)
    host = models.CharField(max_length=64, unique=True, default='')
    board = models.CharField(max_length=128, default='bRbNbBbQbKbBbNbR/bPbPbPbPbPbPbPbP/8/8/8/8/wPwPwPwPwPwPwPwP'
                                                     '/wRwNwBwQwKwBwNwR')
    personToMove = models.CharField(max_length=8, default='white')

    def nextToMove(self):
        if self.personToMove == 'white':
            self.personToMove = 'black'
        elif self.personToMove == 'black':
            self.personToMove = 'white'
