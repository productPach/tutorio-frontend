export const securePinGenerator = (): string => {
    let code = '';
    for (let i = 0; i < 4; i++) {
        const randomPin = Math.floor(Math.random() * 10); // Генерация случайного числа от 0 до 9
        code += randomPin.toString();
    }
    // ВНИМАНИЕ!!!
    // Здесь нужно сохранять код подтверждения в БД
    // Временно добавляем код в LocalStorage

    return code;
}