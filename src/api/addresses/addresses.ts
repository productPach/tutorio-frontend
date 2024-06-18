// const url =
//   "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
// const query = "москва хабар";

// const options = {
//   method: "POST",
//   mode: "cors",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization: "Token " + token,
//   },
//   body: JSON.stringify({ query: query }),
// };

// fetch(url, options)
// .then(response => response.text())
// .then(result => console.log(result))
// .catch(error => console.log("error", error));

const token = "59e590bc5ae2c3975912f9ace2aedfe5f36014c4";

export const getAdressDadata = async (query: string) => {
  const response = await fetch(
    "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        query: query,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Не удалось отправить адрес");
  }
  const data = await response.json();
  return data;
};
