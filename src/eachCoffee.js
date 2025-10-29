import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

// Get the document ID from the URL
function getDocIdFromUrl() {
  const params = new URL(window.location.href).searchParams;
  return params.get("docID");
}

// Fetch the hike and display its name and image
async function displayCoffeeInfo() {
  const id = getDocIdFromUrl();

  try {
    const coffeeRef = doc(db, "coffee", id);
    const coffeeSnap = await getDoc(coffeeRef);

    const coffee = coffeeSnap.data();
    const name = coffee.name;
    const code = coffee.code;

    // Update the page
    document.getElementById("coffeeName").textContent = name;
    const img = document.getElementById("coffeeImage");
    img.src = `./images/${code}.png`;
    img.alt = `${name} image`;
  } catch (error) {
    console.error("Error loading coffee:", error);
    document.getElementById("coffeeName").textContent = "Error loading coffee.";
  }
}

displayCoffeeInfo();
