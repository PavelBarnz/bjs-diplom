"use strict"

//Выхода из ЛК.
let logOut = new LogoutButton();
logOut.action = () => {
    ApiConnector.logout((response) => {
        if(response.success === true){
            location.reload();
        } else {
            user.setLoginErrorMessage(response.error);
        };
    });
};


//Получение и отображение текущего пользователя в ЛК.
ApiConnector.current(response => {
    if(response.success === true){
        ProfileWidget.showProfile(response.data);
    };
});


//Получение курсов валют.
let exchangeRates = new RatesBoard();

let getExchangeRates = () => {//Функция для получения курсов валют.
    ApiConnector.getStocks(response => {
        if(response.success === true){
            exchangeRates.clearTable();
            exchangeRates.fillTable(response.data);
        };
    });
    console.log(1234);
};

getExchangeRates()//Однократный вызов функции для получения курсов валют.

setInterval(getExchangeRates, 60000);//Интервал для вызова функции получения курсов валют.


//Операции с деньгами
let MM = new MoneyManager();

//Пополнение баланса
MM.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if(response.success === true){
            ProfileWidget.showProfile(response.data)
        };
        let answer = new FavoritesWidget();
        answer.setMessage(response.success, response.error || "Счет пополнен");
    });
};

//Конвертация валюты
MM.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if(response.success === true){
            ProfileWidget.showProfile(response.data);
        };
        let answer = new FavoritesWidget();
        answer.setMessage(response.success, response.error || "Конвертация успешна");
    })
};

//Перевод денег.
MM.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if(response.success === true){
            ProfileWidget.showProfile(response.data);
        };
        let answer = new FavoritesWidget();
        answer.setMessage(response.success, response.error || "Перевод выполнен");
    });
};


//Список избранного.

//Отрисовка Адресной книги и заполнение списка передачи денег.
let userFavorites = new FavoritesWidget();
ApiConnector.getFavorites(data => {
    if(data.success === true){
        userFavorites.clearTable(data.data);
    };
    userFavorites.fillTable(data.data);
    let x = new MoneyManager();
    x.updateUsersList(data.data);
});

//Удаление пользователя из списка избранного.
let x = new FavoritesWidget();
x.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if(response.success === true){
            ProfileWidget.showProfile(response.data);
        };
        let answer = new FavoritesWidget();
        answer.setMessage(response.success, response.error || "Перевод выполнен");
    })
};