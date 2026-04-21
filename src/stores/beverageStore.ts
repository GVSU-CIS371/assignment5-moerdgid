import { defineStore } from "pinia";
import type { User } from "firebase/auth";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
    user: null as User | null,
  }),

  actions: {
    async init() {
      const baseCollection = collection(db, "bases");
      const baseSnapshot = await getDocs(baseCollection);
      this.bases = baseSnapshot.docs.map((doc) => doc.data() as BaseBeverageType);
      this.currentBase = this.bases[0] || null;

      const creamerCollection = collection(db, "creamers");
      const creamerSnapshot = await getDocs(creamerCollection);
      this.creamers = creamerSnapshot.docs.map(
        (doc) => doc.data() as CreamerType
      );
      this.currentCreamer = this.creamers[0] || null;

      const syrupCollection = collection(db, "syrups");
      const syrupSnapshot = await getDocs(syrupCollection);
      this.syrups = syrupSnapshot.docs.map((doc) => doc.data() as SyrupType);
      this.currentSyrup = this.syrups[0] || null;
    },

    setUser(user: User | null) {
      this.user = user;

      if (!user) {
        this.beverages = [];
        this.currentBeverage = null;
        return;
      }

      const q = query(
        collection(db, "beverages"),
        where("uid", "==", user.uid)
      );

      onSnapshot(q, (snapshot) => {
        this.beverages = snapshot.docs.map(
          (doc) => doc.data() as BeverageType
        );

        this.currentBeverage = this.beverages[0] || null;
      });
    },

    async makeBeverage() {
      console.log("makeBeverage clicked");

      try {
        if (!this.user) {
          alert("No user logged in, please sign in first.");
          return;
        }

        if (
          !this.currentName ||
          !this.currentBase ||
          !this.currentCreamer ||
          !this.currentSyrup ||
          !this.currentTemp
        ) {
          alert("Please complete all beverage options and the name before making a beverage.");
          return;
        }

        const beverageId = crypto.randomUUID();

        const newBeverage: BeverageType = {
          id: beverageId,
          uid: this.user.uid,
          name: this.currentName,
          temp: this.currentTemp,
          base: this.currentBase,
          creamer: this.currentCreamer,
          syrup: this.currentSyrup,
        };

        console.log("about to save", newBeverage);

        await setDoc(doc(db, "beverages", beverageId), newBeverage);

        console.log("save worked");

        this.currentName = "";

        alert(`Beverage ${newBeverage.name} made successfully!`);
      } catch (error) {
        console.error("save failed", error);
        alert("Saving failed. Open the console and copy the red error.");
      }
    },

    showBeverage() {
      if (!this.currentBeverage) return;

      this.currentName = this.currentBeverage.name;
      this.currentTemp = this.currentBeverage.temp;
      this.currentBase = this.currentBeverage.base;
      this.currentSyrup = this.currentBeverage.syrup;
      this.currentCreamer = this.currentBeverage.creamer;
    },
  },
});
