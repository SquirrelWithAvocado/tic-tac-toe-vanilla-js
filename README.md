Задача дописать игру в крестики-нолики.

Сейчас в коде описаны функции для рисования поля любого размера и рисования любого символа в клетке этого поля.
Твоя задача дописать код, чтобы это стало полноценной игрой в Крестики-нолики.

- [x] Реши, как будешь хранить поле. Тебе нужна будет такая структура, в которой удобно понимать есть ли победитель: три клетки по горизонтали, вертикали или диагонали, заполненные одинаковыми символами.
- [x] Допиши функцию cellClickHandler, чтобы после клика ставился крестик или нолик в соответствующее поле.
- [x] Если поле, по которому кликнули, не пустое, символ ставиться не должен.
- [x] Если кончились ходы, выведи alert с текстом "Победила дружба".
- [x] Напиши функцию, которая считает: есть ли уже победитель. Если есть победитель, выведи alert с названием победителя
- [x] Если есть победитель, покрась победные значения в клетках в красный.
- [x] После победы, клик по полю больше не должен ставить крестик или нолик.
- [x] Обрабатывай клик по кнопке "Сначала": допиши метод resetClickHandler, чтобы поле очищалось.
- [x] \* Сделай так, чтобы можно было в начале игры задавать поле произвольного размера.
- [x] \* Напиши "искусственный интеллект" — функцию, которая будет ставить нолики с случайное пустое поле.
- [x] \* Напиши чуть более умный искусственный интеллект — функция, ставящая нолики в случайном месте обязана поставить нолик в такое поле, нолик в котором приведет к выигрышу "ИИ".
- [x] \* Сделай так, чтобы при заполнении больше половины клеток на поле, оно бы расширялось: добавлялось бы по одному ряду с каждой стороны.
