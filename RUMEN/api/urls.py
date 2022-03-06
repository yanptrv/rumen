from django.urls import path
from .views import GetBoard, CreateBoardView

urlpatterns = [
    path('chessboard', GetBoard.as_view()),
    path('create', CreateBoardView.as_view()),
]