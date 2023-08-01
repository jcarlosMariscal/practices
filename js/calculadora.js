document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("history")) {
    localStorage.setItem("history", "[]");
  }
});
const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (operator === "add") return firstNum + secondNum;
  if (operator === "subtract") return firstNum - secondNum;
  if (operator === "multiply") return firstNum * secondNum;
  if (operator === "divide") return firstNum / secondNum;
  if (operator === "porcent") return (firstNum * secondNum) / 100;
};

const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return "number";
  if (
    action === "add" ||
    action === "subtract" ||
    action === "multiply" ||
    action === "divide" ||
    action === "porcent"
  )
    return "operator";
  // For everything else, return the action
  return action;
};

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent;
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } = state;

  if (keyType === "number") {
    return displayedNum === "0" ||
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
      ? keyContent
      : displayedNum + keyContent;
  }

  if (keyType === "decimal") {
    if (!displayedNum.includes(".")) return displayedNum + ".";
    if (previousKeyType === "operator" || previousKeyType === "calculate")
      return "0.";
    return displayedNum;
  }
  if (keyType === "negative") {
    displayedNum = displayedNum >= 0 ? -displayedNum : Math.abs(displayedNum);
    return displayedNum;
  }

  if (keyType === "operator") {
    return firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  if (keyType === "clear") return 0;
  if (keyType === "calculate") {
    return firstValue
      ? previousKeyType === "calculate"
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }
};

const updateCalculatorState = (
  key,
  calculator,
  calculatedValue,
  displayedNum
) => {
  let resume = document.querySelector(".calculator__resume");
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } =
    calculator.dataset;

  calculator.dataset.previousKeyType = keyType;

  if (keyType === "operator") {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue =
      firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
        ? calculatedValue
        : displayedNum;
  }

  if (keyType === "calculate") {
    let history = localStorage.getItem("history");
    history = JSON.parse(history);
    history.push((resume.textContent += display.textContent));
    localStorage.setItem("history", JSON.stringify(history));
    resume.textContent = display.textContent;
    calculator.dataset.modValue =
      firstValue && previousKeyType === "calculate" ? modValue : displayedNum;
  }

  if (keyType === "clear" && key.textContent === "C") {
    calculator.dataset.firstValue = "";
    calculator.dataset.modValue = "";
    calculator.dataset.operator = "";
    calculator.dataset.previousKeyType = "";
    resume.textContent = "";
  }
};

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);
  Array.from(key.parentNode.children).forEach((k) =>
    k.classList.remove("is-depressed")
  );

  if (keyType === "operator") key.classList.add("is-depressed");
  if (keyType === "clear" && key.textContent !== "AC") key.textContent = "C";
  if (keyType !== "clear") {
    const clearButton = calculator.querySelector("[data-action=clear]");
    clearButton.textContent = "C";
  }
};

const calculator = document.querySelector(".calculator");
const display = calculator.querySelector(".calculator__display");
const keys = calculator.querySelector(".calculator__keys");
const resume = document.querySelector(".calculator__resume");

keys.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;
  const key = e.target;
  const displayedNum = display.textContent;
  resume.textContent += key.textContent;
  // const keyType = getKeyType(key);
  // if (keyType === "calculate") resume.textContent += display.textContent;
  const resultString = createResultString(
    key,
    displayedNum,
    calculator.dataset
  );

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});

const theme = document.getElementById("theme");
const main = document.querySelector(".main");
theme.addEventListener("click", (e) => {
  console.log(theme.children[0]);
  main.classList.toggle("dark-mode");
  let etiquetaI = theme.children[0].classList;
  if (main.classList.contains("dark-mode")) {
    if (etiquetaI.contains("fa-moon")) {
      etiquetaI.remove("fa-moon");
      etiquetaI.add("fa-sun");
    } else {
      etiquetaI.add("fa-moon");
      etiquetaI.remove("fa-sun");
    }
    document.documentElement.style.setProperty(
      "--bg-body-light",
      "linear-gradient(to bottom right, #140224, #000000)"
    );
    document.documentElement.style.setProperty("--color-white", "#161818");
    document.documentElement.style.setProperty(
      "--color-white-hover",
      "#191b1b"
    );
    document.documentElement.style.setProperty("--btn-light", "#222525");
    document.documentElement.style.setProperty("--btn-light-hover", "#1f2424");
    document.documentElement.style.setProperty("--color-dark", "#e5f4f5");
  } else {
    if (etiquetaI.contains("fa-moon")) {
      etiquetaI.remove("fa-moon");
      etiquetaI.add("fa-sun");
    } else {
      etiquetaI.add("fa-moon");
      etiquetaI.remove("fa-sun");
    }
    document.documentElement.style.setProperty(
      "--bg-body-light",
      "linear-gradient(to bottom right, #9936f5, #6ac059)"
    );
    document.documentElement.style.setProperty("--color-white", "#eff8f8");
    document.documentElement.style.setProperty(
      "--color-white-hover",
      "#e5f4f5"
    );
    document.documentElement.style.setProperty("--btn-light", "#e0ecec");
    document.documentElement.style.setProperty("--btn-light-hover", "#d3dfdf");
    document.documentElement.style.setProperty("--color-dark", "#222525");
  }
});

const btn_history = document.querySelector(".btn-history");
const history = document.querySelector(".history");
const history_list = document.getElementById("history-list");
const reset = document.getElementById("reset-history");

btn_history.addEventListener("click", (e) => {
  history.classList.toggle("show");
  let his = localStorage.getItem("history");
  his = JSON.parse(his);

  if (his.length == 0) {
    history.textContent = "Sin Operaciones";
    return;
  } else {
    while (history_list.firstChild) {
      history_list.removeChild(history_list.firstChild);
    }
    his.forEach((el) => {
      let ul = document.createElement("ul");
      ul.textContent = el;
      history_list.appendChild(ul);
    });
  }
});
reset.addEventListener("click", () => {
  localStorage.setItem("history", "[]");
  history.textContent = "Sin Operaciones";
});
