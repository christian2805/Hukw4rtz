"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
let currentList = [];
let house = "all";

function start() {
  console.log("ready");

  document.querySelector("#sorting").addEventListener("change", selectSorting);

  document.querySelector("#student").addEventListener("click", clickSomething);
  loadJSON();
}

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

console.log(create_UUID());

function clickSomething() {
  const element = event.target;
  console.log(element);

  if (element.dataset.action === "remove") {
    element.parentElement.parentElement.remove();
    console.log("remove button clicked!");

    // const index = element.dataset.index;

    const id = element.dataset.id;
    console.log(id);
    const index = currentList.findIndex(findFunction);

    function findFunction(student) {
      if (student.id === id) {
        return true;
      } else {
        return false;
      }
    }
    console.log(index);
    currentList.splice(index, 1);
  }
}

function selectSorting(event) {
  const sortBy = event.target.value;

  sortListBy(sortBy);
  displayList(currentList);
}

function loadJSON() {
  fetch("http://petlatkea.dk/2019/hogwartsdata/students.json")
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    // Create new object with cleaned data
    const student = Object.create(Student);
    console.log(jsonObject);

    //CLEAN HOUSE
    let house = jsonObject.house.trim();

    if (jsonObject.house.charAt(0) === " ") {
      student.house = house.toUpperCase().charAt(0) + jsonObject.house.toLowerCase().slice(2);
    } else {
      student.house = house.toUpperCase().charAt(0) + jsonObject.house.toLowerCase().slice(1);
    }
    //CLEAN NAME

    let name = jsonObject.fullname.trim().split(" ");

    student.firstName = name[0].toUpperCase().charAt(0) + name[0].toLowerCase().slice(1);

    // FIND MIDDLENAME

    if (name.length === 3) {
      console.log("middlename detected", name);
      student.middleName = name[1].toUpperCase().charAt(0) + name[1].toLowerCase().slice(1);
      student.lastName = name[2].toUpperCase().charAt(0) + name[2].toLowerCase().slice(1);
    } else if (name.length === 2) {
      console.log("no middlename");
      student.lastName = name[1].toUpperCase().charAt(0) + name[1].toLowerCase().slice(1);
    }

    // FIND NICKNAME
    let nickName = name[1];
    if (name.length === 1) {
      // dont do shit!
    } else if (nickName.charAt(0) === `"`) {
      student.nickName = nickName;
    }

    //CLEAN GENDER
    student.gender = jsonObject.gender.toUpperCase().charAt(0) + jsonObject.gender.toLowerCase().slice(1);
    // GET ID
    student.id = create_UUID();

    //PHOTO
    if (name.length === 1) {
    } else {
      const photosrc = `${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;

      student.photo = photosrc;
      console.log(photosrc);
    }

    allStudents.push(student);
  });
  rebuildList();
}

function rebuildList() {
  currentList = filterListBy(house);
  sortListBy("name");
  displayList(currentList);
}

function sortListBy(prop) {
  currentList.sort((a, b) => (a[prop] > b[prop] ? 1 : -1)); // Don't copy this sorting function, it sucks ...
}

function startFilter() {
  house = this.dataset.filter;
  console.log(house);
  currentList = filterListBy(house);
  displayList(currentList);
}

function filterListBy(house) {
  console.log(house);
  let filteredStudents = allStudents.filter(filterByHouses);
  function filterByHouses(student) {
    if (student.house == house || house == "all") {
      return true;
    } else {
      return false;
    }
  }
  console.log(filteredStudents);
  return filteredStudents;
}
function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#students").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=first_name]").textContent = student.firstName;
  clone.querySelector("[data-field=middle_name]").textContent = student.middleName;
  clone.querySelector("[data-field=last_name]").textContent = student.lastName;
  clone.querySelector("[data-field=nick_name]").textContent = student.nickName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=photo]").innerHTML = `<img src="images/${student.photo}">`;

  // append clone to list

  document.querySelector("#list tbody").appendChild(clone);

  document.querySelector("#list tbody").lastElementChild.addEventListener("click", () => {
    showSingle(student);
  });
  // TODO: Add event-listeners for filter-buttons
  document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", startFilter);
  });

  console.log(allStudents.length);
  const listLength = currentList.length;
  document.querySelector("#list-length").innerHTML = `Number of students: ${listLength}`;
}

function showSingle(student) {
  if (student.house === "Gryffindor") {
    document.querySelector("#popup").style.backgroundImage = "url(img/gryffindore.jpg)";
    console.log(student.house);
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#popup").style.backgroundImage = "url(img/huflepufff.png)";
    console.log(student.house);
  } else if (student.house === "Slytherin") {
    document.querySelector("#popup").style.backgroundImage = "url(img/slytrin.png)";
    console.log(student.house);
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#popup").style.backgroundImage = "url(img/r.png)";
    console.log(student.house);
  }

  document.querySelector(
    "#indhold"
  ).innerHTML = `<article class="student"> <h2>${student.house}</h2><h2>${student.firstName}</h2> <p>${student.middleName}</p><p>${student.lastName}</p><h3> gender ${student.gender}</h3><img src="images/${student.photo}"
  </article>`;

  document.querySelector("#popup").style.display = "block";
  document.querySelector("#popup #luk").addEventListener("click", close);
}
function close() {
  document.querySelector("#popup").style.display = "none";
}
function farveKat() {
  console.log("farvekat igang");

  //Her vælger vi attraktionen som dækker over de 3 museer.
  var farveKategorier = document.querySelectorAll("");
  console.log(farveKategorier);
  // hvergang den støder på et museums navn, alt efter hvilket, skal den give en class ud af 3 classer som ændre farven.
  farveKategorier.forEach(function(em) {
    if (em.textContent == "Stevns Klint") em.classList.add("stevnskat");
    else if (em.textContent == "Koldkrigsmuseum Stevnsfort") em.classList.add("koldkat");
    else if (em.textContent == "Geomuseum Faxe") em.classList.add("geokat");
  });
}

// prototype Student
const Student = {
  firstname: "-name-",
  middlename: "",
  lastname: "",
  gender: "-gender-",
  house: "-house-",
  nickname: "-nickname-",
  photo: "photo"
};
