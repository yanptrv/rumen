from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .serializers import ChessBoardSerializer, CreateBoardSerializer
from .models import ChessBoard


# Create your views here.

class BoardView(generics.ListAPIView):
    queryset = ChessBoard.objects.all()
    serializer_class = ChessBoardSerializer


class GetBoard(APIView):
    serializer_class = ChessBoardSerializer
    lookup_url_kwarg = 'code'

    def get(self, request):
        code = request.GET.get(self.lookup_url_kwarg)
        if ChessBoard.objects.filter(code=code).exists():
            return Response(ChessBoardSerializer(ChessBoard.objects.filter(code=code)[0]).data,
                            status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class CreateBoardView(APIView):
    serializer_class = CreateBoardSerializer

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            host = self.request.session.session_key
            board = 'bRbNbBbQbKbBbNbR/bPbPbPbPbPbPbPbP/8/8/8/8/wPwPwPwPwPwPwPwP/wRwNwBwQwKwBwNwR'
            personToMove = 'black'
            queryset = ChessBoard.objects.filter(host=host)
            if queryset.exists():
                chessBoard = queryset[0]
                chessBoard.board = serializer.data.get('board')
                chessBoard.personToMove = serializer.data.get('personToMove')
                chessBoard.save(update_fields=['board', 'personToMove'])
                return Response(ChessBoardSerializer(chessBoard).data, status=status.HTTP_200_OK)
            else:
                chessBoard = ChessBoard(host=host, board=board, personToMove=personToMove)
                chessBoard.save()
                return Response(ChessBoardSerializer(chessBoard).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
