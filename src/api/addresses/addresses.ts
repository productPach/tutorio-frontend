// var url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
// var token = "${API_KEY}";
// var query = "москва хабар";

// var options = {
//     method: "POST",
//     mode: "cors",
//     headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//         "Authorization": "Token " + token
//     },
//     body: JSON.stringify({query: query})
// }

// fetch(url, options)
// .then(response => response.text())
// .then(result => console.log(result))
// .catch(error => console.log("error", error));


// export const getAdressDadata = async (query: string) => {
//     const response = await fetch(
//         "",
//         {
//             method: "POST",
//             mode: "cors",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json",
//                 "Authorization": "Token " + token
//             },
//             body: JSON.stringify({
//                 query: query
//             })}
//     );
//     if (!response.ok) {
//         throw new Error("Не удалось отправить адрес")
//     }
//     const data = await response.json();
//     return data;
// }