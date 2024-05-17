import random
import sys
import json

player_1 = 'X'
player_2 = 'O'

#Функция, проверяющая условия победы
def victory(player, board, previous_move):
    if (board[previous_move][0]==player and board[previous_move][1]==player and board[previous_move][2]==player) or \
        (board[previous_move][3] == player and board[previous_move][4] == player and board[previous_move][5] == player) or \
        (board[previous_move][6] == player and board[previous_move][7] == player and board[previous_move][8] == player) or \
        (board[previous_move][0] == player and board[previous_move][3] == player and board[previous_move][6] == player) or \
        (board[previous_move][1] == player and board[previous_move][4] == player and board[previous_move][7] == player) or \
        (board[previous_move][2] == player and board[previous_move][5] == player and board[previous_move][8] == player) or \
        (board[previous_move][0] == player and board[previous_move][4] == player and board[previous_move][8] == player) or \
        (board[previous_move][2] == player and board[previous_move][4] == player and board[previous_move][6] == player):
        return True
    else:
        return False

#Функция минимакса для хода игрока 2, возвращающая рейтинг возможных ходов
def minimax(board, is_maximizing, depth, prev):
    #Если выигрывает противник(т.е. игрок 1), то рейтинг равен -10
    #Если выигрывает робот, то рейтинг равен 10
    #Если выбранная глубина не позволяет застать победу одного из игроков, то рейтинг равен 0(нейтральная позиция)
    if victory(player_1, board, prev):
        return -10
    elif victory(player_2, board, prev):
        return 10
    elif depth == 0:
        return 0
    #Если рассматриваем игру со стороны робота(игрока 2),
    # то выбираем наилучший ход для игрока 2
    if is_maximizing:
        best_score = -10000
        for i in range(9):
            if board[prev][i] != 'X' and board[prev][i] != 'O':
                board[prev][i] = player_2
                score = minimax(board, False, depth - 1, prev)
                board[prev][i] = i
                best_score = max(score, best_score)
        return best_score
    #Если рассматриваем игру со стороны человека(игрока 1)
    # то выбираем наихудший ход для игрока 1
    else:
        best_score = 10000
        for i in range(9):
            if board[prev][i] != 'X' and board[prev][i] != 'O':
                board[prev][i] = player_1
                score = minimax(board, True, depth - 1, prev)
                board[prev][i] = i
                best_score = min(score, best_score)
        return best_score

#Функция для выбора наиболее подходящего хода
def optimal_move(board, depth, prev):
    best_score = -10000
    best_move = None
    #Рассматриваем игровой момент в маленькой ячейке
    for i in range(9):
        if board[prev][i] != 'X' and board[prev][i] != 'O':
            board[prev][i] = player_2
            #Если этот ход именно в эту клетку ячейки приносит победу
            #То это и есть лучший ход, заканчиваем работу функции
            if victory(player_2, board, prev):
                best_move = i
                break
            #Подсчитываем рейтинг клетки, с помощью функции минимакс
            score = minimax(board, False, depth, prev)
            board[prev][i] = i
            counter = 0
            #Если ход в эту клетку не приносит победы противника в следующей большой ячейке
            #То выбираем клетку с наибольшим рейтингом
            for b in range(9):
                if board[i][b]!='X' and board[i][b]!='O':
                    board[i][b]='X'
                    exp_flag = victory('X', board, i)
                    board[i][b] = b
                    if exp_flag==True:
                        counter+=1
            if counter==0:
                if score >= best_score:
                    best_score = score
                    best_move = i
    #При условии, когда нельзя определить наилучший ход(все ходы ведут к поражению),
    # то делаем ход в любую свободную клетку
    if best_move == None:
        best_move = random.randint(0,8)
        if board[prev][best_move]!='O' and board[prev][best_move]!='X':
            return best_move
    return best_move

matrix = json.loads(sys.argv[2])
lastMove = int(sys.argv[1])
print(optimal_move(matrix, 2, lastMove))