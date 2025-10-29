import {
  collection,
  getDocs,
  addDoc,
  doc,
  onSnapshot,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebaseConfig.js";

import { onAuthReady } from "./authentication.js";

// Function to read the quote of the day from Firestore
function readQuote(day) {
  const quoteDocRef = doc(db, "cats", day); // Get a reference to the document

  onSnapshot(
    quoteDocRef,
    (docSnap) => {
      // Listen for real-time updates
      if (docSnap.exists()) {
        document.getElementById("quote-goes-here").innerHTML =
          docSnap.data().cats;
      } else {
        console.log("No such document!");
      }
    },
    (error) => {
      console.error("Error listening to document: ", error);
    }
  );
}

function showDashboard() {
  const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

  onAuthReady(async (user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      location.href = "index.html";
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const name = userDoc.exists()
      ? userDoc.data().name
      : user.displayName || user.email;

    // Update the welcome message with their name/email.
    if (nameElement) {
      nameElement.textContent = `${name}!`;
    }
  });
}

// Helper function to add the sample hike documents.
function addCoffeeData() {
  const coffeeRef = collection(db, "coffee");
  console.log("Adding sample coffee data...");
  addDoc(coffeeRef, {
    code: "drink1",
    name: "Iced Blend Matcha Coffee",
    details:
      "A refreshing blend of matcha and coffee with ice sumbreged in it.",
    price: "$5.99",
    last_updated: serverTimestamp(),
  });
  addDoc(coffeeRef, {
    code: "drink2",
    name: "Pure Dark Cacao Coffee",
    details: "A mixture of dark cacao and rich coffee flavors.",
    price: "$9.32",
    last_updated: serverTimestamp(),
  });
  addDoc(coffeeRef, {
    code: "drink3",
    name: "Blackhole Cold Brew",
    details:
      "A shot of espresso mixed with cold brew coffee, egg, and chocolate milk for a bold taste.",
    price: "$10.99",
    last_updated: serverTimestamp(),
  });
}

async function seedCoffee() {
  const coffeeRef = collection(db, "coffee");
  const querySnapshot = await getDocs(coffeeRef);

  // Check if the collection is empty
  if (querySnapshot.empty) {
    console.log("Coffee collection is empty. Seeding data...");
    addCoffeeData();
  } else {
    console.log("Coffee collection already contains data. Skipping seed.");
  }
}

async function displayCardsDynamically() {
  let cardTemplate = document.getElementById("coffeeCardTemplate");
  const coffeeCollectionRef = collection(db, "coffee");

  try {
    const querySnapshot = await getDocs(coffeeCollectionRef);
    querySnapshot.forEach((doc) => {
      // Clone the template
      let newcard = cardTemplate.content.cloneNode(true);
      const coffee = doc.data(); // Get hike data once

      // Populate the card with hike data
      newcard.querySelector(".card-title").textContent = coffee.name;
      newcard.querySelector(".card-text").textContent = coffee.details;
      newcard.querySelector(".card-length").textContent = coffee.price;

      // 👇 ADD THIS LINE TO SET THE IMAGE SOURCE
      newcard.querySelector(".card-image").src = `./images/${coffee.code}.png`;

      // Add the link with the document ID
      newcard.querySelector(
        ".read-more"
      ).href = `eachCoffee.html?docID=${doc.id}`;

      // Attach the new card to the container
      document.getElementById("coffee-go-here").appendChild(newcard);
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

// Call the seeding function when the main.html page loads.
seedCoffee();

// Call the function to display cards when the page loads
displayCardsDynamically();

readQuote("tuesday");

showDashboard();
