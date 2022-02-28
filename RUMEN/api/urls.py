from django.urls import path
from .views import BoardView, CreateBoardView

urlpatterns = [
    path('chessboard', BoardView.as_view()),
    path('create', CreateBoardView.as_view()),
]