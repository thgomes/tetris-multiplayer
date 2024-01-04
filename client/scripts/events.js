function createKeyboardListener() {
  const observers = [];
  function subscribe(observerHandler) {
    observers.push(observerHandler);
  }
  function notifyAll(command) {
    for (observerHandle of observers) {
      observerHandle(command);
    }
  }
  function handleKeyboard(event) {
    const command = {
      keyPressed: event.code,
    };
    notifyAll(command);
  }
  document.addEventListener("keydown", handleKeyboard);
  return {
    subscribe,
  };
}

function createSingleplayerButtonListener() {
  const observers = [];
  function subscribe(observerHandler) {
    observers.push(observerHandler);
  }
  function notifyAll() {
    for (observerHandle of observers) {
      observerHandle();
    }
  }
  function handleSingleplayerButton() {
    notifyAll();
  }
  for (button of document.getElementsByClassName("singleplayer-button")) {
    button.onclick = handleSingleplayerButton;
  }
  return {
    subscribe,
  };
}
