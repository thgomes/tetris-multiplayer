"use strict";

function createKeyboardListener() {
  let observers = [];
  function subscribe(observerHandler) {
    observers.push(observerHandler);
  }
  function clearSubscribes() {
    observers = [];
  }
  function notifyAll(command) {
    for (const observerHandle of observers) {
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
    clearSubscribes,
  };
}

function createSingleplayerButtonListener() {
  const observers = [];
  function subscribe(observerHandler) {
    observers.push(observerHandler);
  }
  function notifyAll() {
    for (const observerHandle of observers) {
      observerHandle();
    }
  }
  function handleSingleplayerButton() {
    notifyAll();
  }
  for (const button of document.getElementsByClassName("singleplayer-button")) {
    button.onclick = handleSingleplayerButton;
  }
  return {
    subscribe,
  };
}

function createMultiplayerButtonListener() {
  const observers = [];
  function subscribe(observerHandler) {
    observers.push(observerHandler);
  }
  function notifyAll() {
    for (const observerHandle of observers) {
      observerHandle();
    }
  }
  function handleMultiplayerButton() {
    notifyAll();
  }
  for (const button of document.getElementsByClassName("multiplayer-button")) {
    button.onclick = handleMultiplayerButton;
  }
  return {
    subscribe,
  };
}
