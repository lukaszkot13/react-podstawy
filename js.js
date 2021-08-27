function mainWrapper() {
  const stanAplikacji = {
    page: 1,
    info: null,
    $listaPostaci: document.getElementById("lista"),
    $lista: document.getElementById("lista"),
    $liczbaPostaci: document.getElementById("liczba-postaci"),
    $aktualnaStrona: document.getElementById("aktualna-strona"),
    $iloscStron: document.getElementById("ilosc-stron"),
    fiilters: {
      name: "",
      status: "",
    },
  };

  const $buttonPrev = document.getElementById("prev");
  const $buttonNext = document.getElementById("next");
  const $inputFilter = document.getElementById("filter");
  const $selectStatus = document.getElementById("status");
  const $buttonClear = document.getElementById("clear");
  const $inputPage = document.getElementById("page");

  $buttonPrev.addEventListener("click", handlePageChangeClick);
  $buttonNext.addEventListener("click", handlePageChangeClick);
  $inputFilter.addEventListener("keyup", handelFilterBackend);
  $selectStatus.addEventListener("change", handelFilterStatus);
  $buttonClear.addEventListener("click", handelClearFilters);
  $inputPage.addEventListener("keyup", handelPageChange);

  async function handelPageChange(event) {
    const { value } = event.target;
    if (value < 1 || value > stanAplikacji.info.pages) {
      alert(`Podana strona nie istnieje`);
      return;
    }

    stanAplikacji.page = value;

    const data = await pobierzPostaci();

    if (data.error) {
      alert(error);
    } else {
      stanAplikacji.info = data.info;
      stanAplikacji.$listaPostaci.innerHTML = "";
      data.results.forEach(stworzKartePostaci);
      updateUI();
    }
  }

  function handelClearFilters() {
    stanAplikacji.fiilters = {
      name: "",
      status: "",
    };
    stanAplikacji.page = 1;
  }

  //   function handelFilter(event) {
  //     const { value } = event.target;

  //     const cards = document.getElementsByClassName("card");
  //     Array.from(cards).forEach((card) => {
  //       card.classList = "card";
  //       if (!card.dataset.name.toLowerCase().includes(value.toLowerCase())) {
  //         card.classList += " hidden";
  //       }
  //     });
  //   }

  async function handelFilterStatus(event) {
    const { value } = event.target;
    console.log("value", value);
    stanAplikacji.fiilters.status = value;
    const characters = await pobierzPostaci();
    stanAplikacji.info = characters.info;
    stanAplikacji.$listaPostaci.innerHTML = "";
    characters.results.forEach(stworzKartePostaci);
    stanAplikacji.$liczbaPostaci.innerHTML = characters.info.count;
  }

  async function handelFilterBackend(event) {
    const { value } = event.target;
    stanAplikacji.fiilters.name = value;
    const characters = await pobierzPostaci();
    stanAplikacji.info = characters.info;
    stanAplikacji.$listaPostaci.innerHTML = "";
    characters.results.forEach(stworzKartePostaci);
    stanAplikacji.$liczbaPostaci.innerHTML = characters.info.count;
  }

  async function handlePageChangeClick(event) {
    const direction = event.target.id;

    if (direction === "prev" && stanAplikacji.info.prev === null) {
      alert("Jesteś na 1 stronie!");
      return;
    } else if (direction === "next" && stanAplikacji.info.next === null) {
      alert("Jesteś na ostatniej stronie!");
      return;
    }

    direction === "prev" ? stanAplikacji.page-- : stanAplikacji.page++;

    const characters = await pobierzPostaci();
    stanAplikacji.info = characters.info;
    stanAplikacji.$listaPostaci.innerHTML = "";
    characters.results.forEach(stworzKartePostaci);
    updateUI();
  }

  function updateUI() {
    stanAplikacji.$aktualnaStrona.innerHTML = stanAplikacji.page;
  }

  async function pobierzPostaci() {
    // let params = `?page=${stanAplikacji.page}`;
    // if (stanAplikacji.fiilters.name) {
    //   params += `&name=${stanAplikacji.fiilters.name}`;
    // }

    // if (stanAplikacji.fiilters.status) {
    //   params += `&status=${stanAplikacji.fiilters.status}`;
    // }
    const data = await fetch(
      "https://rickandmortyapi.com/api/character" +
        "/?page=" +
        stanAplikacji.page
    );
    const response = await data.json();
    return response;
  }

  function stworzKartePostaci(data) {
    const $card = document.createElement("div");
    $card.classList = "card";

    const $img = document.createElement("img");
    $img.src = data.image;
    $img.alt = data.name;
    $card.appendChild($img);

    const $container = document.createElement("div");
    $container.classList = "container";
    const $name = document.createElement("h4");
    $name.innerHTML = data.name;
    const $species = document.createElement("p");
    $species.innerHTML = data.species;

    $container.appendChild($name);
    $container.appendChild($species);
    $card.appendChild($container);
    $card.dataset.name = data.name;

    stanAplikacji.$lista.appendChild($card);
  }

  async function main() {
    const characters = await pobierzPostaci();
    stanAplikacji.info = characters.info;
    stanAplikacji.$liczbaPostaci.innerHTML = characters.info.count;
    updateUI();
    stanAplikacji.$iloscStron.innerHTML = characters.info.pages;
    characters.results.forEach(stworzKartePostaci);
  }

  main();
}

setTimeout(mainWrapper, 100);
