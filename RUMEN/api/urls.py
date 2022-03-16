from django.urls import path
from .views import GetBoard, CreateBoardView, UpdateBoardView, BoardView

urlpatterns = [
    path('chessboard', GetBoard.as_view()),
    path('create', CreateBoardView.as_view()),
    path('update', UpdateBoardView.as_view()),
]