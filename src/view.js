import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import * as R from "ramda";
import { showFormMsg, weatherInputMsg, loadData, updateTime, saveweatherMsg, deleteweatherMsg } from "./update";

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const cellStyle = "px-1 py-2 min-w-[100px] bg-zinc-200";

const { div, button, form, label, input, table, thead, tbody, tr, th, td } = hh(h);

const cell = (tag, className, value, id = 0) => 
  tag({ className, id}, value);

const tableHeader = thead([tr([cell(th, "text-left", "Weather"), cell(th, "text-left", "Temp"), cell(th, "text-left", "Low"), cell(th, "text-left", "High"), cell(th, "", "")])]);

const weatherRow = (dispatch, className, weathers) =>
  tr({ className }, [
    cell(td, cellStyle, weathers.description),
    cell(td, cellStyle, weathers.temp),
    cell(td, cellStyle, weathers.low),
    cell(td, cellStyle, weathers.high),
    cell(td, cellStyle + "text-right", [
      button(
        {
          className: `${btnStyle} bg-red-500 hover:bg-red-700`,
          onclick: () => dispatch(deleteweatherMsg(weathers.id)),
        },
        "Delete"
      ),
    ]),
  ]);

const totalRow = (weathers) => {
  const total = R.pipe(
    R.map((weather) => weather.calories),
    R.sum
)};

const weathersBody = (dispatch, className, weathers) => {
  const rows = R.map(R.partial(weatherRow, [dispatch, "odd:bg-white even:bg-gray-100"]), weathers);
  const rowsWithTotal = [...rows, totalRow(weathers)];
  return tbody({ className }, rowsWithTotal);
};

const tableView = (dispatch, weathers) => {
  if (weathers.length === 0) {
    return div({ className: "pt-8 text-center" }, "Keine Wetterdaten vorhanden...");
  }
  return table({ className: "mt-4" }, [tableHeader, weathersBody(dispatch, "", weathers)]);
};

const fieldSet = (labelText, inputValue, placeholder, oninput) => 
  div({ className: "grow flex flex-col" }, [
    label({ className: "text-gray-700 text-sm font-bold mb-2" }, labelText),
    input({
      className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700",
      placeholder,
      type: "text",
      value: inputValue,
      oninput,
    }),
  ]);

const buttonSet = (dispatch) => 
  div({ className: "flex gap-4 justify-center" }, [
    button({className: `${btnStyle} bg-green-500 hover:bg-green-700`, type: "submit", onclick: () => dispatch(loadData)}, "Save"),
    button({className: `${btnStyle} bg-red-500 hover:bg-red-700`, type: "button", onclick: () => dispatch(showFormMsg(false))},  "Cancel")
  ]);

const formView = (dispatch, model) => {
  const { description, showForm } = model;
  if (showForm) {
    return form({className: "flex flex-col gap-4", onsubmit: (e) => e.preventDefault()}, [ 
        div({ className: "flex gap-4" }, [
          fieldSet("City or Country:", description, "Enter a city or Country...", (e) => dispatch(weatherInputMsg(e.target.value))),
        ]),
        buttonSet(dispatch),
    ]);
  }
  return button(
    {
      className: `${btnStyle}`,
      onclick: () => dispatch(showFormMsg(true)),
    },
    "➕ weather"
  );
};

const view = (dispatch, model) => 
  div({ className: "flex flex-col" }, [formView(dispatch, model), tableView(dispatch, model.weathers)]);

export default view;