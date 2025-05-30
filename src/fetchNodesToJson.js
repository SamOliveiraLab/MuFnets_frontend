// fetchNodesToJson.js
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite"; // use 'lite' for Node.js environments

const firebaseConfig = {
  apiKey: "AIzaSyDy1QlIH5v0M8qd8ch3DBbpFHjtEcZ83ZE",
  authDomain: "mufnets.firebaseapp.com",
  projectId: "mufnets",
  storageBucket: "mufnets.firebasestorage.app",
  messagingSenderId: "130745748558",
  appId: "1:130745748558:web:8c7caf5a37754d0d66c71f",
  measurementId: "G-KNFV6ZZBF2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchAndSave() {
  const nodesCollection = collection(db, "nodes");
  const snapshot = await getDocs(nodesCollection);

  const data = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      species: d.specie,
      flow_behavior: d.flowBehavior,
      inputs: d.inputConnections,
      outputs: d.outputConnections,
      perturbation: d.perturbations,
      flow_rate: d.flow_rate,
      volume: d.volume,
      mu_max: d.mu_max,
      Ks: d.Ks,
      Y_x_s: d.Y_x_s,
      mu_death: d.mu_death,
      OD_desired: d.OD_desired,
      K: d.K,
      S_in: d.S_in,
    };
  });

  fs.writeFileSync("cells_info.json", JSON.stringify(data, null, 2));
  console.log("✔️ Data exported to cells_info.json");
}

fetchAndSave().catch(console.error);


// Schedule to run every 5 minutes
setInterval(fetchAndSave, 1000 * 60 * 5);


