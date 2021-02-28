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
let ratesBoard = new RatesBoard();

let getExchangeRates = () => {//Функция для получения курсов валют.
    ApiConnector.getStocks(response => {
        if(response.success === true){
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        };
    });
};

getExchangeRates()//Однократный вызов функции для получения курсов валют.

setInterval(getExchangeRates, 60000);//Интервал для вызова функции получения курсов валют.


//Операции с деньгами
let moneyManager = new MoneyManager();
let favoritesWidget = new FavoritesWidget();

//Пополнение баланса
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if(response.success === true){
            ProfileWidget.showProfile(response.data)
        };
        favoritesWidget.setMessage(response.success, response.error || "Счет пополнен");
    });
};

//Конвертация валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if(response.success === true){
            ProfileWidget.showProfile(response.data);
        };
        favoritesWidget.setMessage(response.success, response.error || "Конвертация успешна");
    })
};

//Перевод денег.
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if(response.success === true){
            ProfileWidget.showProfile(response.data);
        };
        favoritesWidget.setMessage(response.success, response.error || "Перевод выполнен");
    });
};


//Список избранного.

//Отрисовка Адресной книги и заполнение списка передачи денег.
function getUsersList() {
    ApiConnector.getFavorites(response => {
        if(response.success === true){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        };
    });
};

getUsersList();

//Добавление пользователя в список избранного
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if(response.success === true){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            getUsersList();
        };
    })
};

//Удаление пользователя из списка избранного.
favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if(response.success === true){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            getUsersList();
        };
        favoritesWidget.setMessage(response.success, response.error || "Контакт удален");
    })
};